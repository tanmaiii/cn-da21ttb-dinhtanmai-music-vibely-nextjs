import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import {
  AddSongToPlaylistInput,
  CreatePlaylistInput,
  GetAllPlaylistInput,
  GetPlaylistInput,
  likePlaylistInput,
  unLikePlaylistInput,
  UpdatePlaylistInput,
} from "../schema/playlist.schema";
import MoodService from "../services/Mood.service";
import PlaylistService from "../services/Playlist.service";
import SongService from "../services/Song.service";
import ApiError from "../utils/ApiError";
import { getFilePath, SortOptions } from "../utils/commonUtils";
import GenreService from "../services/Genre.service";
import LikeService from "../services/Like.service";

export const getAllPlaylistHandler = async (
  req: Request<{}, GetAllPlaylistInput["query"], {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10, page = 1, keyword, sort } = req.query;

    const userId = get(req, "identity.id") as string;

    const playlists = await PlaylistService.getAllWithPagination({
      limit: parseInt(limit as string, 10),
      page: parseInt(page as string, 10),
      sort: sort as SortOptions,
      userId: userId as string,
      keyword: keyword as string,
    });

    res.json({ data: playlists, message: "Get playlists successfully" });
  } catch (error) {
    next(error);
  }
};

export const getPlaylistHandler = async (
  req: Request<GetPlaylistInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const playlist = await PlaylistService.getById(req.params.id, userId);

    if (!playlist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");
    }

    res.json({ data: playlist, message: "Get playlist successfully" });
  } catch (error) {
    next(error);
  }
};

export const createPlaylistHandler = async (
  req: Request<{}, {}, CreatePlaylistInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const userId = get(req, "identity.id") as string;
    const genreId = await GenreService.getById(req.body.genreId);

    if (!genreId) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Genre not found");
    }

    const moodIds = req.body.moodId;

    const playlist = await PlaylistService.create({
      userId: userId,
      ...req.body,
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
    });

    // Nếu có moodId, sử dụng addMoods để lưu vào bảng trung gian
    if (moodIds && moodIds.length > 0) {
      await MoodService.addPlaylistToMood(playlist.id, moodIds);
    }

    const createdPlaylist = await PlaylistService.getById(playlist.id);

    res.status(StatusCodes.CREATED).json({
      data: createdPlaylist,
      message: "Create playlist successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlaylistHandler = async (
  req: Request<UpdatePlaylistInput["params"], {}, UpdatePlaylistInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const playlist = await PlaylistService.getById(req.params.id);

    if (!playlist)
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const moodIds = req.body.moodId;

    const data = {
      ...req.body,
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
    };

    // Nếu có moodId
    if (moodIds && moodIds.length > 0) {
      await MoodService.updatePlaylistToMood(playlist.id, moodIds);
    }

    await PlaylistService.update(playlist.id, data);

    const newPlaylist = await PlaylistService.getById(req.params.id);

    res.status(StatusCodes.CREATED).json({
      data: newPlaylist,
      message: "Update playlist successfully",
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylistHandler = async (
  req: Request<
    AddSongToPlaylistInput["params"],
    {},
    AddSongToPlaylistInput["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const existPlaylist = await PlaylistService.getById(req.params.id);
    const existSong = await SongService.getSongById(req.body.songId);

    if (!existPlaylist || !existSong) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist or song not found");
    }

    const existSongInPlaylist = await PlaylistService.checkSongInPlaylist(
      req.params.id,
      req.body.songId
    );

    if (existSongInPlaylist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Song already in playlist");
    }

    const body = {
      playlistId: req.params.id,
      songId: req.body.songId,
    };

    const playlist = await PlaylistService.addSong(body);

    res
      .status(StatusCodes.CREATED)
      .json({ data: playlist, message: "Add song to playlist successfully" });

    return;
  } catch (error) {
    next(error);
  }
};

export const removeSongToPlaylistHandler = async (
  req: Request<
    AddSongToPlaylistInput["params"],
    {},
    AddSongToPlaylistInput["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const existPlaylist = await PlaylistService.getById(req.params.id);
    const existSong = await SongService.getSongById(req.body.songId);

    if (!existPlaylist || !existSong) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist or song not found");
    }

    const existSongInPlaylist = await PlaylistService.checkSongInPlaylist(
      req.params.id,
      req.body.songId
    );

    if (!existSongInPlaylist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Song not in playlist");
    }

    const body = {
      playlistId: req.params.id,
      songId: req.body.songId,
    };

    await PlaylistService.removeSong(body);

    res
      .status(StatusCodes.OK)
      .json({ message: "Remove song to playlist successfully" });

    return;
  } catch (error) {
    next(error);
  }
};

export const likePlaylistHandler = async (
  req: Request<likePlaylistInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const id = req.params.id;

    const existPlaylist = await PlaylistService.getById(id, userId);

    if (!existPlaylist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");
    }

    const existLike = await LikeService.getLikePlaylist(userId, id);

    if (existLike) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Playlist is already liked");
    }

    await LikeService.likePlaylist(userId, id);

    res.status(StatusCodes.CREATED).json({
      message: "Like playlist successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const unLikePlaylistHandler = async (
  req: Request<unLikePlaylistInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const id = req.params.id;

    const existPlaylist = await PlaylistService.getById(id, userId);

    if (!existPlaylist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");
    }

    const existLike = await LikeService.getLikePlaylist(userId, id);

    if (!existLike) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Playlist is not liked");
    }

    await LikeService.unLikePlaylist(userId, id);

    res.status(StatusCodes.OK).json({
      message: "Unlike playlist successfully",
    });
  } catch (error) {
    next(error);
  }
};
