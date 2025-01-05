import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import ApiError from "./ApiError";

class TokenUtil {
  secretKey = process.env.JWT_SECRET_KEY || "secret";

  publicKey = process.env.JWT_PUBLIC_KEY || "public";

  // Tạo token
  generateAccessToken(user: any) {
    return jwt.sign(user, this.secretKey, {
      expiresIn: "1d", //1d
      algorithm: "HS256",
    });
  }

  // Tạo refresh token
  generateRefreshToken(user: any) {
    return jwt.sign({ id: user.id }, this.publicKey, {
      expiresIn: "7d", //7d
      algorithm: "HS256",
    });
  }

  // Tạo token
  generateResetPasswordToken(user: any) {
    return jwt.sign({ id: user.id }, this.secretKey, {
      expiresIn: "15m", //15m
      algorithm: "HS256",
    });
  }

  // Giải mã token
  decodeToken(token: string) {
    try {
      jwt.verify(token, this.secretKey);
      return jwt.decode(token);
    } catch (error) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token is invalid");
    }
  }

  decodeRefreshToken(token: string) {
    try {
      jwt.verify(token, this.publicKey);
      return jwt.decode(token);
    } catch (error) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
    }
  }
}

export default new TokenUtil();
