import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { get, merge } from "lodash";
import PlaylistService from "../services/Playlist.service";
import RoleService from "../services/Role.service";
import SongService from "../services/Song.service";
import UserService from "../services/User.service";
import ApiError from "../utils/ApiError";
import TokenUtil from "../utils/jwt";
import { ROLES } from "../utils/contants";
import RoomService from "../services/Room.service";

export interface IIdentity {
  id: string;
  name: string;
  email: string;
  slug: string;
  imagePath: string;
  role: {
    id: string;
    name: string;
  };
}

export const globalAuthorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (token === undefined) {
      next();
      return;
    }
    // Lấy thông tin từ token
    const tokenInfo = TokenUtil.decodeToken(token) as JwtPayload;

    if (!tokenInfo) return next();

    const user = await UserService.getById(tokenInfo.id);

    // Thêm thông tin user vào req
    merge(req, { identity: user });

    return next();
  } catch (error) {
    next(error);
  }
};

// Kiểm tra xem user có quyền cần thiết không
export const authorize = (requiredPermission?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInfo = get(req, "identity") as IIdentity;

      if (!userInfo) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const user = await UserService.getById(userInfo.id);

      if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      if (requiredPermission) {
        const roles = await RoleService.getRoleByName(user.role.name);

        if (!roles) {
          throw new ApiError(StatusCodes.FORBIDDEN, "Role not found");
        }

        // Kiểm tra xem user có quyền cần thiết không
        const hasPermissions = roles.permissions.some((permission) => {
          return permission.name === requiredPermission;
        });

        // Nếu không có quyền thì trả về lỗi
        if (!hasPermissions) {
          throw new ApiError(
            StatusCodes.FORBIDDEN,
            `User not have permission ${requiredPermission}`
          );
        }
      }

      merge(req, { identity: user });
      return next();
    } catch (error) {
      return next(error);
    }
  };
};

// Middleware kiểm tra quyền sở hữu bài hát
export const isSongAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;

    const { id } = req.params;

    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing songId");
    }

    // Tìm bài hát theo songId
    const song = await SongService.getSongNotChecked(id);

    if (!song) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }

    if (userInfo.role.name === ROLES.ADMIN) {
      // Nếu là admin, cho phép tiếp tục
      next();
      return;
    }

    if (song.userId !== userInfo.id) {
      // Kiểm tra userId có phải là creatorId của bài hát không
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not the author of this song"
      );
    }

    // Nếu hợp lệ, cho phép tiếp tục
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware kiểm tra quyền sở hữu playlist
export const isPlaylistAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;

    const { id } = req.params;
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing playlist id");
    }

    const playlist = await PlaylistService.getById(id, userInfo.id);

    if (!playlist) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Playlist not found");
    }

    if (userInfo.role.name === ROLES.ADMIN) {
      // Nếu là admin, cho phép tiếp tục
      next();
      return;
    }

    if (playlist.userId !== userInfo.id) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not the author of this playlist"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const isRoomAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = get(req, "identity") as IIdentity;

    const { id } = req.params;
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing room id");
    }

    const room = await RoomService.getById(id);

    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Room not found");
    }

    if (userInfo.role.name === ROLES.ADMIN) {
      next();
      return;
    }

    if (room.userId !== userInfo.id) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        "You are not the author of this room"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
