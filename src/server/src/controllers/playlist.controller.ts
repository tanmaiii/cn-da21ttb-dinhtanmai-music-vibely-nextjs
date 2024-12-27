import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import {
  AddSongToPlaylistInput,
  CreatePlaylistInput,
  GetAllPlaylistInput,
  GetAllPlaylistLikeInput,
  GetPlaylistInput,
  GetPlaylistSlugInput,
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
import PlaylistSongService from "../services/PlaylistSong.service";
import { IIdentity } from "../middleware/auth.middleware";
import PlaylistSong from "../models/PlaylistSong";

// Lấy tất cả playlist
export const getAllPlaylistHandler = async (
  req: Request<{}, GetAllPlaylistInput["query"], {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 4, page = 1, keyword, sort } = req.query;

    const userInfo = get(req, "identity") as IIdentity;

    // if (!userInfo) {
    //   throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
    // }

    const playlists = await PlaylistService.getAllWithPagination({
      limit: parseInt(limit as string, 10),
      page: parseInt(page as string, 10),
      sort: sort as SortOptions,
      userId: userInfo ? userInfo.id : "",
      keyword: keyword as string,
    });

    res.status(StatusCodes.OK).json({
      data: playlists,
      message: "Get playlists successfully",
      statusCode: StatusCodes.OK,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy playlist theo id
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

// Lấy playlist theo slug
export const getPlaylistBySlugHandler = async (
  req: Request<GetPlaylistSlugInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;
    const playlist = await PlaylistService.getBySlug(
      req.params.slug,
      userInfo.id
    );

    if (!playlist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");
    }

    res.json({ data: playlist, message: "Get playlist successfully" });
  } catch (error) {
    next(error);
  }
};

// Tạo playlist
export const createPlaylistHandler = async (
  req: Request<{}, {}, CreatePlaylistInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const genreId = await GenreService.getById(req.body.genreId);

    if (!genreId) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Genre not found");
    }

    const moodIds = req.body.moodIds;
    const songIds = req.body.songIds;

    const playlist = await PlaylistService.create({
      userId: userId,
      ...req.body,
    });

    // Nếu có moodId, sử dụng addMoods để lưu vào bảng trung gian
    if (moodIds && moodIds.length > 0) {
      await MoodService.addPlaylistToMood(playlist.id, moodIds);
    }

    if (songIds && songIds.length > 0) {
      await PlaylistSongService.addSong(playlist.id, songIds);
    }

    const newPlaylist = await PlaylistService.getById(playlist.id);
    await LikeService.likePlaylist(userId, newPlaylist.id);

    res.status(StatusCodes.CREATED).json({
      data: newPlaylist,
      message: "Create playlist successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Chỉnh sửa playlist
export const updatePlaylistHandler = async (
  req: Request<UpdatePlaylistInput["params"], {}, UpdatePlaylistInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;
    const playlist = await PlaylistService.getById(req.params.id, userInfo.id);

    if (!playlist)
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");

    const moodIds = req.body.moodIds;
    const songIds = req.body.songIds;

    const data = {
      ...req.body,
    };

    // Nếu có moodId
    if (moodIds && moodIds.length > 0) {
      await MoodService.updatePlaylistToMood(playlist.id, moodIds);
    }

    if (songIds && songIds.length > 0) {
      await PlaylistSongService.updateSong(playlist.id, songIds);
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

// Thêm bài hát vào playlist
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
    const songIds = req.body.songIds;

    if (!existPlaylist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist or song not found");
    }

    if (songIds.length > 0) {
      for (const songId of songIds) {
        const existSong = await SongService.getSongById(songId);
        if (!existSong) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Song id ${songIds} not found`
          );
        }
      }
    }

    const playlist = await PlaylistSongService.addSong(req.params.id, songIds);

    res
      .status(StatusCodes.CREATED)
      .json({ data: playlist, message: "Add song to playlist successfully" });

    return;
  } catch (error) {
    next(error);
  }
};

// Xóa bài hát khỏi playlist
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
    const songIds = req.body.songIds;

    if (!existPlaylist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist or song not found");
    }

    await PlaylistSongService.removeSong(req.params.id, songIds);

    res
      .status(StatusCodes.OK)
      .json({ message: "Remove song to playlist successfully" });

    return;
  } catch (error) {
    next(error);
  }
};

// Lấy tất cả bài hát trong playlist
export const getSongInPlaylistHandler = async (
  req: Request<GetPlaylistInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const playlistId = req.params.id;
    const playlist = await PlaylistService.getById(playlistId);
    const userInfo = get(req, "identity") as IIdentity;

    if (!playlist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");
    }

    const songs = await PlaylistSongService.getAll(
      playlistId,
      userInfo.id ?? ""
    );

    res.json({ data: songs, message: "Get songs in playlist successfully" });
  } catch (error) {
    next(error);
  }
};

// Thích playlist
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

// Bỏ thích playlist
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

// Check playlist đã thích
export const checkLikePlaylistHandler = async (
  req: Request<GetPlaylistInput["params"]>,
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

    res.status(StatusCodes.OK).json({
      data: !!existLike,
      message: "Check like playlist successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Lấy playlist đã thích
export const getAllPlaylistLikedHandler = async (
  req: Request<{}, GetAllPlaylistLikeInput["query"], {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 4, page = 1, keyword, my } = req.query;

    const userId = get(req, "identity") as IIdentity;

    const playlists = await PlaylistService.getAllLikePagination({
      limit: parseInt(limit as string, 10),
      page: parseInt(page as string, 10),
      userId: userId.id,
      keyword: keyword as string,
      my: my === "true" ? true : false,
    });

    res.status(StatusCodes.OK).json({
      data: playlists,
      message: "Get playlists liked successfully",
    });
  } catch (error) {
    next(error);
  }
};
