import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { get } from "lodash";
import {
  DeleteUserInput,
  GetAllUserInput,
  UpdateRoleUserInput,
  UpdateUserInput,
} from "../schema/user.schema";
import UserService from "../services/User.service";
import ApiError from "../utils/ApiError";
import { getFilePath, SortOptions } from "../utils/commonUtils";
import passwordUtil from "../utils/passwordUtil";
import AccountsService from "../services/Accounts.service";
import RoleService from "../services/Role.service";

// Lấy danh sách tất cả người dùng
export const getAllUsersHandler = async (
  req: Request<{}, GetAllUserInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = 10, page = 1, keyword, sort } = req.query;

    const users = await UserService.getSongsWithPagination({
      limit: parseInt(limit as string, 10),
      page: parseInt(page as string, 10),
      sort: sort as SortOptions,
      keyword: keyword as string,
      // where: { roleId: roleArtist.id },
    });

    res
      .status(200)
      .json({ data: users, message: "Get all users successfully" });
  } catch (error) {
    next(error);
  }
};

// Lấy thông tin người dùng theo id
export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await UserService.getById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    res.status(200).json({ data: user, message: "Get user successfully" });
  } catch (error) {
    next(error);
  }
};

// Tạo mới người dùng
export const createUserHandler = async (
  req: Request<{}, {}, UpdateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email, role, ...rest } = req.body;

    const hashedPassword = await passwordUtil.hash(password);

    const existUser = await UserService.getByEmail(email);

    if (existUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists");
    }

    const user = await UserService.create({
      ...rest,
      email,
      roleId: role,
    });

    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Create user failed");
    }

    await AccountsService.create({
      userId: user.id,
      email,
      password: hashedPassword,
    });

    res
      .status(StatusCodes.CREATED)
      .json({ data: [], message: "Create user successfully" });
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin người dùng theo id
export const updateUserHandler = async (
  req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { password, role, ...userUpdateInfo } = req.body;

    let hashPassword: string | undefined;
    if (password) {
      hashPassword = await passwordUtil.hash(password);
    }

    const user = await UserService.getById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const data = {
      ...userUpdateInfo,
      ...(hashPassword && { password: hashPassword }),
    };

    await UserService.update(id, data);

    const userNew = await UserService.getById(id);

    res
      .status(StatusCodes.OK)
      .json({ data: userNew, message: "Update user successfully" });
  } catch (error) {
    next(error);
  }
};

// Xóa người dùng theo id
export const deleteUserHandler = async (
  req: Request<DeleteUserInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const user = await UserService.getById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const account = await AccountsService.getByUserId(id);

    if (account) {
      await account.destroy();
    }

    await user.destroy();

    res
      .status(StatusCodes.OK)
      .json({ data: user, message: "Delete user successfully" });
  } catch (error) {
    next(error);
  }
};

// Cập nhật role của người dùng theo id
export const updateUserRoleHandler = async (
  req: Request<UpdateRoleUserInput["params"], {}, UpdateRoleUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const user = await UserService.getById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    await user.update({ roleId: roleId });

    const newUser = await UserService.getById(id);

    res
      .status(StatusCodes.OK)
      .json({ data: newUser, message: "Update user role successfully" });
  } catch (error) {
    next(error);
  }
};
