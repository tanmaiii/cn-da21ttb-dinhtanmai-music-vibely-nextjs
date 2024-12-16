import e, { NextFunction, Request, Response } from "express";
import UserService from "../services/User.service";
import {
  followArtistInput,
  GetAllArtistInput,
  GetArtistPlaylistInput,
} from "../schema/artist.schema";
import LikeService from "../services/Like.service";
import { get } from "lodash";
import ApiError from "../utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { SortOptions } from "../utils/commonUtils";
import SongService from "../services/Song.service";
import PlaylistService from "../services/Playlist.service";
import RoleService from "../services/Role.service";
import { ROLES } from "../utils/contants";

export const getArtistsHandler = async (
  req: Request<{}, GetAllArtistInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10, page = 1, keyword, sort } = req.query;

    const roleArtist = await RoleService.getRoleByName(ROLES.ARTIST);

    console.log(roleArtist);
    

    const artists = await UserService.getSongsWithPagination({
      limit: parseInt(limit as string, 10),
      page: parseInt(page as string, 10),
      sort: sort as SortOptions,
      keyword: keyword as string,
      where: { roleId: roleArtist.id },
    });

    res.json({ data: artists, message: "Get artists successfully" });
  } catch (error) {
    next(error);
  }
};

// Lấy bài hát của nghệ sĩ
export const getArtistSongHandler = async (
  req: Request<
    GetArtistPlaylistInput["params"],
    GetArtistPlaylistInput["query"],
    {}
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: artistId } = req.params;
    const userId = get(req, "identity.id") as string;

    const { limit = 10, page = 1, keyword, sort } = req.query;

    const existArtist = await UserService.getById(artistId);

    if (!existArtist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Artist not found");
    }

    const songs = await SongService.getSongsWithPagination({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      userId: userId,
      sort: sort as SortOptions,
      keyword: keyword as string,
      where: { userId: artistId },
    });

    res.json({ data: songs, message: "Get artist's songs successfully" });
  } catch (error) {
    next(error);
  }
};

// Lấy playlist của nghệ sĩ
export const getArtistPlaylistHandler = async (
  req: Request<
    GetArtistPlaylistInput["params"],
    GetArtistPlaylistInput["query"],
    {}
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: artistId } = req.params;
    const userId = get(req, "identity.id") as string;

    const { limit = 10, page = 1, keyword, sort } = req.query;

    const existArtist = await UserService.getById(artistId);

    if (!existArtist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Artist not found");
    }

    const songs = await PlaylistService.getAllWithPagination({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      userId: userId,
      sort: sort as SortOptions,
      keyword: keyword as string,
      where: { userId: artistId },
    });

    res.json({ data: songs, message: "Get artist's songs successfully" });
  } catch (error) {
    next(error);
  }
};

// Lấy bài hát mà nghệ sĩ tham gia
export const getArtistFeaturingHandler = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// Theo dõi nghệ sĩ
export const followArtistHandler = async (
  req: Request<followArtistInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const { id: artistId } = req.params;

    const existArtist = await UserService.getById(artistId);

    if (!existArtist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Artist not found");
    }

    const existFollow = await LikeService.getFollow(userId, artistId);

    if (existFollow) {
      throw new ApiError(StatusCodes.BAD_GATEWAY, "Follow already exists");
    }

    await LikeService.follow(userId, artistId);

    res.json({ message: "Follow artist successfully" });
  } catch (error) {
    next(error);
  }
};

// Bỏ theo dõi
export const unFollowArtistHandler = async (
  req: Request<followArtistInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const { id: artistId } = req.params;

    const existFollow = await LikeService.getFollow(userId, artistId);

    if (!existFollow) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Follow not found");
    }

    await LikeService.unFollowArtist(userId, artistId);

    res.json({ message: "Un follow artist successfully" });
  } catch (error) {
    next(error);
  }
};

// Kiểm tra đã theo dõi nghệ sĩ chưa
export const checkFollowArtistHandler = async (
  req: Request<followArtistInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = get(req, "identity.id") as string;
    const { id: artistId } = req.params;

    const existFollow = await LikeService.getFollow(userId, artistId);

    res.json({ data: existFollow ? true : false, message: "Check follow artist successfully" });
  } catch (error) {
    next(error);
  }
};
