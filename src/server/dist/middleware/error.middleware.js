"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const responseError = {
        statusCode: statusCode,
        message: err.message || "Internal Server Error",
        stack: err.stack || null, // Lưu ý : không trả về stack trace trong production
    };
    console.log("❌EROR❌", responseError);
    // Ghi log lỗi
    logger_1.default.error(err);
    // Trả về lỗi cho client
    res.status(statusCode).json(responseError);
};
exports.errorMiddleware = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map