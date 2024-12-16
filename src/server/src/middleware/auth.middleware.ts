import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { get, merge } from "lodash";
import RoleService from "../services/Role.service";
import UserService from "../services/User.service";
import ApiError from "../utils/ApiError";
import TokenUtil from "../utils/jwt";
import SongService from "../services/Song.service";

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
      // if (req.headers.authorization === undefined) {
      //   throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      // }

      // const token = req.headers.authorization.split(" ")[1];
      // const tokenInfo = TokenUtil.decodeToken(token) as JwtPayload;

      const userId = get(req, "identity.id") as string;

      if (!userId) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }

      const user = await UserService.getById(userId);

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
    // Lấy token từ header Authorization
    const token = req.headers.authorization.split(" ")[1];
    const tokenInfo = TokenUtil.decodeToken(token) as JwtPayload;

    if (!tokenInfo || !token) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Unauthorized: No token provided"
      );
    }

    const { id } = req.params;
    if (!id) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing songId");
    }

    // Tìm bài hát theo songId
    const song = await SongService.getSongById(id);

    if (!song) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Song not found");
    }

    // Kiểm tra userId có phải là creatorId của bài hát không
    if (song.creator.id !== tokenInfo.id) {
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
