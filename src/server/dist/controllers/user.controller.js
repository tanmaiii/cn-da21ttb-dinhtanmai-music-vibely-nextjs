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
exports.createUserHandler = exports.updateUserHandler = exports.deleteUserHandler = exports.getUserHandler = exports.getAllUsersHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_service_1 = __importDefault(require("../services/User.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const passwordUtil_1 = __importDefault(require("../utils/passwordUtil"));
const lodash_1 = require("lodash");
const commonUtils_1 = require("../utils/commonUtils");
const getAllUsersHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Users = yield User_service_1.default.getAll();
        res
            .status(200)
            .json({ data: Users, message: "Get all users successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsersHandler = getAllUsersHandler;
const getUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_service_1.default.getById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        res.status(200).json({ data: user, message: "Get user successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserHandler = getUserHandler;
const deleteUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield User_service_1.default.getById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        yield user.destroy();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ data: user, message: "Delete user successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserHandler = deleteUserHandler;
const updateUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const _a = req.body, { password } = _a, userUpdateInfo = __rest(_a, ["password"]);
        let hashPassword;
        if (password) {
            hashPassword = yield passwordUtil_1.default.hash(password);
        }
        const user = yield User_service_1.default.getById(id);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        const files = req.files;
        const data = Object.assign(Object.assign(Object.assign({}, userUpdateInfo), (hashPassword && { password: hashPassword })), ((0, lodash_1.get)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image"),
        }));
        console.log(data);
        yield user.update(data);
        const userNew = yield User_service_1.default.getById(id);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ data: userNew, message: "Update user successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserHandler = updateUserHandler;
const createUserHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { password, email } = _a, rest = __rest(_a, ["password", "email"]);
        const hashedPassword = yield passwordUtil_1.default.hash(password);
        const existUser = yield User_service_1.default.getByEmail(email);
        if (existUser) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email already exists");
        }
        // if (role && roleUser !== "admin") {
        //   throw new ApiError(StatusCodes.FORBIDDEN, "You are not admin");
        // }
        const files = req.files;
        const data = Object.assign(Object.assign(Object.assign({}, rest), { email, password: hashedPassword }), ((0, lodash_1.get)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image"),
        }));
        yield User_service_1.default.create(data);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ data: [], message: "Create user successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.createUserHandler = createUserHandler;
//# sourceMappingURL=user.controller.js.map