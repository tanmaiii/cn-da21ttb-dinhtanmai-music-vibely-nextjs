"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSongAuthor = exports.authorize = exports.globalAuthorize = void 0;
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const Role_service_1 = __importDefault(require("../services/Role.service"));
const User_service_1 = __importDefault(require("../services/User.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const Song_service_1 = __importDefault(require("../services/Song.service"));
const globalAuthorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
        if (token === undefined) {
            next();
            return;
        }
        // Lấy thông tin từ token
        const tokenInfo = jwt_1.default.decodeToken(token);
        if (!tokenInfo)
            return next();
        const user = yield User_service_1.default.getById(tokenInfo.id);
        // Thêm thông tin user vào req
        (0, lodash_1.merge)(req, { identity: user });
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.globalAuthorize = globalAuthorize;
// Kiểm tra xem user có quyền cần thiết không
const authorize = (requiredPermission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // if (req.headers.authorization === undefined) {
            //   throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
            // }
            // const token = req.headers.authorization.split(" ")[1];
            // const tokenInfo = TokenUtil.decodeToken(token) as JwtPayload;
            const userId = (0, lodash_1.get)(req, "identity.id");
            if (!userId) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
            }
            const user = yield User_service_1.default.getById(userId);
            if (!user) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
            }
            if (requiredPermission) {
                const roles = yield Role_service_1.default.getRoleByName(user.role.name);
                if (!roles) {
                    throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Role not found");
                }
                // Kiểm tra xem user có quyền cần thiết không
                const hasPermissions = roles.permissions.some((permission) => {
                    return permission.name === requiredPermission;
                });
                // Nếu không có quyền thì trả về lỗi
                if (!hasPermissions) {
                    throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, `User not have permission ${requiredPermission}`);
                }
            }
            (0, lodash_1.merge)(req, { identity: user });
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
};
exports.authorize = authorize;
// Middleware kiểm tra quyền sở hữu bài hát
const isSongAuthor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Lấy token từ header Authorization
        const token = req.headers.authorization.split(" ")[1];
        const tokenInfo = jwt_1.default.decodeToken(token);
        if (!tokenInfo || !token) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized: No token provided");
        }
        const { id } = req.params;
        if (!id) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Missing songId");
        }
        // Tìm bài hát theo songId
        const song = yield Song_service_1.default.getSongById(id);
        if (!song) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
        }
        // Kiểm tra userId có phải là creatorId của bài hát không
        if (song.creator.id !== tokenInfo.id) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not the author of this song");
        }
        // Nếu hợp lệ, cho phép tiếp tục
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.isSongAuthor = isSongAuthor;
//# sourceMappingURL=auth.middleware.js.map