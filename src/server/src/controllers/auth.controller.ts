import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { get } from "lodash";
import UserService from "../services/User.service";

import {
  LoginInput,
  logoutInput,
  RefreshTokenInput,
  RegisterInput,
} from "../schema/auth.schema";
import ApiError from "../utils/ApiError";
import TokenUtil from "../utils/jwt";
import PasswordUtil from "../utils/passwordUtil";
import AccountsService from "../services/Accounts.service";
import RoleService from "../services/Role.service";
import { ROLES } from "../utils/contants";

export async function login(
  req: Request<{}, {}, LoginInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

    const existAccount = await AccountsService.getByEmail(email);
    
    if (existAccount) {
      existAccount.toJSON();
    }

    if (!existAccount) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `User with email ${email} not found`
      );
    }

    if (!PasswordUtil.compare(password, existAccount.password)) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Password is incorrect");
    }

    const userInfo = await UserService.getById(existAccount.userId);

    const accessToken = TokenUtil.generateAccessToken(userInfo.toJSON());
    const refreshToken = TokenUtil.generateRefreshToken(existAccount);

    // Lưu refresh token vào db
    // code

    const exitRefreshToken = await AccountsService.getRefeshTokenById(
      existAccount.id
    );

    exitRefreshToken
      ? AccountsService.updateRefreshToken(existAccount.id, refreshToken)
      : AccountsService.createRefreshToken(existAccount.id, refreshToken);

    res.status(StatusCodes.OK).json({
      data: {
        ...userInfo.toJSON(),
        accessToken,
        refreshToken,
      },
      message: "Login successfully",
    });

    return;
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request<{}, {}, RegisterInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await AccountsService.getByEmail(email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
    }

    // Mã hóa mật khẩu
    const hashedPassword = PasswordUtil.hash(password);

    // Lấy role mặc định
    const defaultRole = await RoleService.getRoleByName(ROLES.USER);

    // Tạo user
    const newUser = await UserService.create({
      name,
      email,
      roleId: defaultRole.id,
    });

    // Tạo account cho user
    const newAccount = await AccountsService.create({
      userId: newUser.id,
      email,
      password: hashedPassword,
    });

    const userInfo = await UserService.getById(newUser.id);

    const accessToken = TokenUtil.generateAccessToken(userInfo.toJSON());
    const refreshToken = TokenUtil.generateRefreshToken(newAccount.toJSON());

    // Save refresh token to the database
    await AccountsService.createRefreshToken(newAccount.id, refreshToken);

    res.status(StatusCodes.CREATED).json({
      data: {
        ...userInfo.toJSON(),
        accessToken,
        refreshToken,
      },
      message: "Register successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, role } = get(req, "identity") as { id: string; role: string };

    if (!id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const user = await UserService.getById(id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const { password, ...userInfo } = user.toJSON();

    res.status(StatusCodes.OK).json({
      data: userInfo,
      message: "Get user successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request<{}, {}, RefreshTokenInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken } = req.body;
    const refreshTokenInfo = (await TokenUtil.decodeRefreshToken(
      refreshToken
    )) as JwtPayload;

    const existToken =
      refreshTokenInfo.id &&
      (await AccountsService.getRefeshTokenById(refreshTokenInfo.id)).toJSON();

    if (!existToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
    }

    if (refreshToken === existToken.token) {
      const accountInfo = await AccountsService.getById(refreshTokenInfo.id);

      console.log(accountInfo);

      if (!accountInfo)
        throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");

      const user = await UserService.getById(accountInfo.userId);

      const accessToken = await TokenUtil.generateAccessToken(user.toJSON());

      res.status(StatusCodes.OK).json({
        data: {
          accessToken,
        },
        message: "Refresh token successfully",
      });
      return;
    }

    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request<{}, {}, logoutInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken } = req.body;
    const refreshTokenInfo = TokenUtil.decodeRefreshToken(
      refreshToken
    ) as JwtPayload;

    const existToken =
      refreshTokenInfo.id &&
      (await AccountsService.getRefeshTokenById(refreshTokenInfo.id));

    if (!existToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
    }

    await AccountsService.deleteRefreshToken(refreshTokenInfo.id);

    res.status(StatusCodes.OK).json({
      message: "Logout successfully",
    });
  } catch (error) {
    next(error);
  }
}
