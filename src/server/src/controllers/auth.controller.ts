import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { get } from "lodash";
import UserService from "../services/User.service";

import {
  ChangePasswordInput,
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
import { OAuth2Client } from "google-auth-library";
import { IIdentity } from "../middleware/auth.middleware";

const client = new OAuth2Client(process.env.GG_CLIENT_ID);

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

    const accessToken = await AccountsService.createAccessToken(
      userInfo.toJSON()
    );
    const refreshToken = await AccountsService.createRefreshToken(
      userInfo.toJSON()
    );

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
    await AccountsService.create({
      userId: newUser.id,
      email,
      password: hashedPassword,
    });

    const userInfo = await UserService.getById(newUser.id);

    const accessToken = await AccountsService.createAccessToken(
      userInfo.toJSON()
    );
    const refreshToken = await AccountsService.createRefreshToken(
      userInfo.toJSON()
    );

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
      const accountInfo = await AccountsService.getByUserId(
        refreshTokenInfo.id
      );

      if (!accountInfo)
        throw new ApiError(StatusCodes.NOT_FOUND, "Account not found");

      const user = await UserService.getById(accountInfo.userId);

      const accessTokenNew = await AccountsService.createAccessToken(
        user.toJSON()
      );
      const refreshTokenNew = await AccountsService.createRefreshToken(
        user.toJSON()
      );

      console.log("[REFRESH TOKEN]", accessTokenNew);

      res.status(StatusCodes.OK).json({
        data: {
          accessToken: accessTokenNew,
          refreshToken: refreshTokenNew,
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

export async function loginGoogle(
  req: Request<{}, {}, { credential: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.body.credential;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GG_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ");
    }

    const { email, name, picture, sub: googleId } = payload;

    const user = await AccountsService.getByEmail(payload.email);

    if (!user) {
      // Lấy role mặc định
      const defaultRole = await RoleService.getRoleByName(ROLES.USER);
      // Tạo user
      const newUser = await UserService.create({
        name,
        email,
        imagePath: picture || "",
        roleId: defaultRole.id,
      });

      // Tạo account cho user
      await AccountsService.create({
        userId: newUser.id,
        email,
        password: "",
        provider: "google",
        providerId: googleId,
      });

      const userInfo = await UserService.getById(newUser.id);

      const accessToken = TokenUtil.generateAccessToken(userInfo.toJSON());

      const refreshToken = TokenUtil.generateRefreshToken(userInfo.toJSON());

      // Save refresh token to the database

      res.status(StatusCodes.CREATED).json({
        data: {
          ...userInfo.toJSON(),
          accessToken,
          refreshToken,
        },
        message: "Register successfully",
      });
      return;
    }

    const userInfo = await UserService.getById(user.userId);

    if (!userInfo) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const accessToken = await AccountsService.createAccessToken(
      userInfo.toJSON()
    );
    const refreshToken = await AccountsService.createRefreshToken(
      userInfo.toJSON()
    );

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

export async function changePassword(
  req: Request<{}, {}, ChangePasswordInput["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    const userInfo = get(req, "identity") as IIdentity;

    if (!userInfo.id) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const user = await UserService.getById(userInfo.id);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const { password, new_password } = req.body;

    const account = await AccountsService.getByUserId(userInfo.id);

    if (account.provider == "local") {
      if (!PasswordUtil.compare(password, account.password)) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Old password is incorrect"
        );
      }
    }

    await AccountsService.update(account.id, {
      password: PasswordUtil.hash(new_password),
    });

    res.status(StatusCodes.OK).json({
      message: "Change password successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    const user = await AccountsService.getByEmail(email);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    // Gửi email reset password
    // const token = TokenUtil.generateResetPasswordToken(user.toJSON());

    // await MailService.sendResetPasswordEmail(user.toJSON(), token);

    res.status(StatusCodes.OK).json({
      message: "Reset password successfully",
    });
  } catch (error) {
    next(error);
  }
}
