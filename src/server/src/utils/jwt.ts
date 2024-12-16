import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "./ApiError";
import { StatusCodes } from "http-status-codes";

class TokenUtil {
  secretKey = process.env.JWT_SECRET || "secret";

  publicKey = process.env.JWT_PUBLIC_KEY || "public";

  // Tạo token
  generateAccessToken(user: any) {
    return jwt.sign(user, this.secretKey, {
      expiresIn: "1d", //15m
      algorithm: "HS256",
    });
  }

  // Tạo refresh token
  generateRefreshToken(user: any) {
    return jwt.sign({ id: user.id }, this.publicKey, {
      expiresIn: "1d",
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
