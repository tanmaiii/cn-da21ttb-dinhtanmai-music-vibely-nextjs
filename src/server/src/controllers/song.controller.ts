import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import { IIdentity } from "../middleware/auth.middleware";
import {
  CreateSongInput,
  DeleteSongInput,
  DestroySongInput,
  GetAllSongInput,
  GetLyricsSongInput,
  GetSongInput,
  GetSongSlugInput,
  LikeSongInput,
  PlaySongInput,
  UnLikeSongInput,
  UpdateSongInput
} from "../schema/song.schema";
import GenreService from "../services/Genre.service";
import LikeService from "../services/Like.service";
import MoodService from "../services/Mood.service";
import SongService from "../services/Song.service";
import ApiError from "../utils/ApiError";
import { getFilePath, SortOptions } from "../utils/commonUtils";

// Lấy danh sách bài hát
export const getAllHandler = async (
  req: Request<{}, GetAllSongInput["query"], {}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { limit = 10, page = 1, keyword, sort } = req.query;

    const userInfo = get(req, "identity") as IIdentity;

    const songs = await SongService.getSongsWithPagination({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: sort as SortOptions,
      userId: userInfo.id || "",
      keyword: keyword as string,
    });

    res.json({ data: songs, message: "Get songs successfully" });
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết bài hát
export const getSongDetailHandler = async (
  req: Request<GetSongInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;
    const song = await SongService.getSongById(req.params.id, userInfo.id);

    if (!song) throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");

    res.json({ data: song, message: "Get song successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

// Lấy chi tiết bài hát theo slug
export const getSongDetailBySlugHandler = async (
  req: Request<GetSongSlugInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const song = await SongService.getSongBySlug(req.params.slug, userId);

    if (!song) throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");

    res.json({ data: song, message: "Get song successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

// Lấy lời bài hát
export const getLyricsSongHandler = async (
  req: Request<GetLyricsSongInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const song = await SongService.getSongById(req.params.id, userId);

    if (!song) throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");

    res.json({ data: song, message: "Get song successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

// Tạo bài hát
export const createSongHandler = async (
  req: Request<{}, {}, CreateSongInput["body"]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Lấy userId từ token
    const userId = get(req, "identity.id") as string;
    const genreId = await GenreService.getById(req.body.genreId);

    if (!genreId) throw new ApiError(StatusCodes.NOT_FOUND, "Genre not found");

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const moodIds = req.body.moodId;

    if (!getFilePath(files, "audio")) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Audio file is invalid");
    }

    const data = {
      ...req.body,
      userId: userId,
      ...(getFilePath(files, "audio") && {
        songPath: getFilePath(files, "audio"),
      }),
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
      ...(getFilePath(files, "lyric") && {
        lyricPath: getFilePath(files, "lyric"),
      }),
    };

    const createSong = await SongService.createSong(data);

    if (moodIds && moodIds.length > 0) {
      await MoodService.addSongToMood(createSong.id, moodIds);
    }

    const songNew = await SongService.getSongById(createSong.id);

    res.status(StatusCodes.CREATED).json({
      message: "Create song successfully",
      data: songNew,
    });
    return;
  } catch (error) {
    next(error);
  }
};

// Cập nhật bài hát
export const updateSongHandler = async (
  req: Request<UpdateSongInput["params"], {}, UpdateSongInput["body"]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const song = await SongService.getSongById(req.params.id);

    if (!song) throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const moodIds = req.body.moodId;

    const data = {
      ...req.body,
      ...(getFilePath(files, "audio") && {
        songPath: getFilePath(files, "audio"),
      }),
      ...(getFilePath(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
      ...(getFilePath(files, "lyric") && {
        lyricPath: getFilePath(files, "lyric"),
      }),
    };

    await SongService.updateSong(req.params.id, data);

    if (moodIds && moodIds.length > 0) {
      await MoodService.updateSongToMood(req.params.id, moodIds);
    }

    const songInfo = await SongService.getSongById(req.params.id);

    res
      .status(StatusCodes.OK)
      .json({ data: songInfo, message: "Update song successfully" });
    return;
  } catch (error) {
    next(error);
  }
};

// Xóa bài hát
export const deleteSongHandler = async (
  req: Request<DeleteSongInput["params"]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const song = await SongService.getSongById(req.params.id);

    if (!song) throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");

    await SongService.deleteSong(req.params.id);

    res.status(StatusCodes.OK).json({ data: {}, message: "Song deleted" });
    return;
  } catch (error) {
    next(error);
  }
};

// Xóa vĩnh viễn bài hát
export const destroySongHandler = async (
  req: Request<DestroySongInput["params"]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const song = await SongService.getSongByIdHasDelete(req.params.id);

    if (!song) throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");

    console.log(song);
    await SongService.destroySong(song.id);

    res.json({ message: "Song detroy" });
    return;
  } catch (error) {
    next(error);
  }
};

// Thích bài hát
export const likeSongHandler = async (
  req: Request<LikeSongInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const existSong = await SongService.getSongById(req.params.id, userId);

    if (!existSong) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }

    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    const existSongLike = await LikeService.getLikeSong(userId, req.params.id);

    if (existSongLike) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Song is already liked");
    }

    await LikeService.likeSong(userId, req.params.id);

    res.status(StatusCodes.OK).json({ message: "Like song successfully" });
  } catch (error) {
    next(error);
  }
};

export const unLikeSongHandler = async (
  req: Request<UnLikeSongInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const existSong = await SongService.getSongById(req.params.id, userId);

    if (!existSong) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }

    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    const existSongLike = await LikeService.getLikeSong(userId, req.params.id);

    if (!existSongLike) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Song is not liked");
    }

    await LikeService.unLikeSong(userId, req.params.id);

    res.status(StatusCodes.OK).json({ message: "Unlike song successfully" });
  } catch (error) {
    next(error);
  }
};

export const checkLikeSongHandler = async (
  req: Request<LikeSongInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;
    const existSong = await SongService.getSongById(req.params.id, userInfo.id);

    if (!existSong) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }

    const existSongLike = await LikeService.getLikeSong(
      userInfo.id,
      existSong.id
    );

    res
      .status(StatusCodes.OK)
      .json({ data: !!existSongLike, message: "Check like successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllLikeSongHandler = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;

    const songs = await SongService.getAllLikeSong(userInfo.id);

    res
      .status(StatusCodes.OK)
      .json({ data: songs, message: "Get successfully" });
  } catch (error) {
    next(error);
  }
};

// Phát nhạc
export async function playSongHandler(
  req: Request<PlaySongInput["params"]>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = get(req, "identity.id") as string;
    const existSong = await SongService.getSongById(req.params.id, userId);

    if (!existSong) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }

    const pathAudio = (await SongService.getPathAudio(req.params.id)).toJSON();

    if (!pathAudio) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Path audio not found");
    }

    // await SongService.playSong(req.params.id, userId);
    await SongService.playSong(req.params.id, userId);

    const data = fs.existsSync(`./uploads/audio/${pathAudio.songPath}`);

    if (!data) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Audio not found");
    }

    res
      .status(StatusCodes.OK)
      .json({ data: pathAudio, message: "Play song successfully" });
  } catch (error) {
    next(error);
  }
}
