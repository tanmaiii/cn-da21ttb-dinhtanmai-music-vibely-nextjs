"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("./ApiError"));
const http_status_codes_1 = require("http-status-codes");
class TokenUtil {
    constructor() {
        this.secretKey = process.env.JWT_SECRET || "secret";
        this.publicKey = process.env.JWT_PUBLIC_KEY || "public";
    }
    // Tạo token
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign(user, this.secretKey, {
            expiresIn: "1d", //15m
            algorithm: "HS256",
        });
    }
    // Tạo refresh token
    generateRefreshToken(user) {
        return jsonwebtoken_1.default.sign({ id: user.id }, this.publicKey, {
            expiresIn: "1d",
            algorithm: "HS256",
        });
    }
    // Giải mã token
    decodeToken(token) {
        try {
            jsonwebtoken_1.default.verify(token, this.secretKey);
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token is invalid");
        }
    }
    decodeRefreshToken(token) {
        try {
            jsonwebtoken_1.default.verify(token, this.publicKey);
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
        }
    }
}
exports.default = new TokenUtil();
//# sourceMappingURL=jwt.js.map