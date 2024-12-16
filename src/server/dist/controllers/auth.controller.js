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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.register = register;
exports.validate = validate;
exports.refreshToken = refreshToken;
exports.logout = logout;
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const User_service_1 = __importDefault(require("../services/User.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const jwt_1 = __importDefault(require("../utils/jwt"));
const passwordUtil_1 = __importDefault(require("../utils/passwordUtil"));
const Accounts_service_1 = __importDefault(require("../services/Accounts.service"));
const Role_service_1 = __importDefault(require("../services/Role.service"));
const contants_1 = require("../utils/contants");
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const existAccount = yield Accounts_service_1.default.getByEmail(email);
            if (existAccount) {
                existAccount.toJSON();
            }
            if (!existAccount) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, `User with email ${email} not found`);
            }
            if (!passwordUtil_1.default.compare(password, existAccount.password)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Password is incorrect");
            }
            const userInfo = yield User_service_1.default.getById(existAccount.userId);
            const accessToken = jwt_1.default.generateAccessToken(userInfo.toJSON());
            const refreshToken = jwt_1.default.generateRefreshToken(existAccount);
            // Lưu refresh token vào db
            // code
            const exitRefreshToken = yield Accounts_service_1.default.getRefeshTokenById(existAccount.id);
            exitRefreshToken
                ? Accounts_service_1.default.updateRefreshToken(existAccount.id, refreshToken)
                : Accounts_service_1.default.createRefreshToken(existAccount.id, refreshToken);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                data: Object.assign(Object.assign({}, userInfo.toJSON()), { accessToken,
                    refreshToken }),
                message: "Login successfully",
            });
            return;
        }
        catch (error) {
            next(error);
        }
    });
}
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, name } = req.body;
            // Kiểm tra email đã tồn tại chưa
            const existingUser = yield Accounts_service_1.default.getByEmail(email);
            if (existingUser) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Email already exists");
            }
            // Mã hóa mật khẩu
            const hashedPassword = passwordUtil_1.default.hash(password);
            // Lấy role mặc định
            const defaultRole = yield Role_service_1.default.getRoleByName(contants_1.ROLES.USER);
            // Tạo user
            const newUser = yield User_service_1.default.create({
                name,
                email,
                roleId: defaultRole.id,
            });
            // Tạo account cho user
            const newAccount = yield Accounts_service_1.default.create({
                userId: newUser.id,
                email,
                password: hashedPassword,
            });
            const userInfo = yield User_service_1.default.getById(newUser.id);
            const accessToken = jwt_1.default.generateAccessToken(userInfo.toJSON());
            const refreshToken = jwt_1.default.generateRefreshToken(newAccount.toJSON());
            // Save refresh token to the database
            yield Accounts_service_1.default.createRefreshToken(newAccount.id, refreshToken);
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                data: Object.assign(Object.assign({}, userInfo.toJSON()), { accessToken,
                    refreshToken }),
                message: "Register successfully",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
function validate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id, role } = (0, lodash_1.get)(req, "identity");
            if (!id) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized");
            }
            const user = yield User_service_1.default.getById(id);
            if (!user) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
            }
            const _a = user.toJSON(), { password } = _a, userInfo = __rest(_a, ["password"]);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                data: userInfo,
                message: "Get user successfully",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
function refreshToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            const refreshTokenInfo = (yield jwt_1.default.decodeRefreshToken(refreshToken));
            const existToken = refreshTokenInfo.id &&
                (yield Accounts_service_1.default.getRefeshTokenById(refreshTokenInfo.id)).toJSON();
            if (!existToken) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
            }
            if (refreshToken === existToken.token) {
                const accountInfo = yield Accounts_service_1.default.getById(refreshTokenInfo.id);
                console.log(accountInfo);
                if (!accountInfo)
                    throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Account not found");
                const user = yield User_service_1.default.getById(accountInfo.userId);
                const accessToken = yield jwt_1.default.generateAccessToken(user.toJSON());
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    data: {
                        accessToken,
                    },
                    message: "Refresh token successfully",
                });
                return;
            }
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
        }
        catch (error) {
            next(error);
        }
    });
}
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            const refreshTokenInfo = jwt_1.default.decodeRefreshToken(refreshToken);
            const existToken = refreshTokenInfo.id &&
                (yield Accounts_service_1.default.getRefeshTokenById(refreshTokenInfo.id));
            if (!existToken) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Refresh token is invalid");
            }
            yield Accounts_service_1.default.deleteRefreshToken(refreshTokenInfo.id);
            res.status(http_status_codes_1.StatusCodes.OK).json({
                message: "Logout successfully",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
//# sourceMappingURL=auth.controller.js.map