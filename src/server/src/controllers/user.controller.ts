import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserService from "../services/User.service";
import ApiError from "../utils/ApiError";
import { UpdateUserInput } from "../schema/user.schema";
import passwordUtil from "../utils/passwordUtil";
import { get } from "lodash";
import { getFilePath } from "../utils/commonUtils";

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const Users = await UserService.getAll();

    res
      .status(200)
      .json({ data: Users, message: "Get all users successfully" });
  } catch (error) {
    next(error);
  }
};

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

export const deleteUserHandler = async (
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

    await user.destroy();

    res
      .status(StatusCodes.OK)
      .json({ data: user, message: "Delete user successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (
  req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { password, ...userUpdateInfo } = req.body;

    let hashPassword;
    if (password) {
      hashPassword = await passwordUtil.hash(password);
    }

    const user = await UserService.getById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const data = {
      ...userUpdateInfo,
      ...(hashPassword && { password: hashPassword }),
      ...(get(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
    };

    console.log(data);

    await user.update(data);

    const userNew = await UserService.getById(id);

    res
      .status(StatusCodes.OK)
      .json({ data: userNew, message: "Update user successfully" });
  } catch (error) {
    next(error);
  }
};

export const createUserHandler = async (
  req: Request<{}, {}, UpdateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email, ...rest } = req.body;

    const hashedPassword = await passwordUtil.hash(password);

    const existUser = await UserService.getByEmail(email);

    if (existUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email already exists");
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const data = {
      ...rest,
      email,
      password: hashedPassword,
      ...(get(files, "image") && {
        imagePath: getFilePath(files, "image"),
      }),
      // ...(role && { role }),
    };

    await UserService.create(data);

    res
      .status(StatusCodes.CREATED)
      .json({ data: [], message: "Create user successfully" });
  } catch (error) {
    next(error);
  }
};
