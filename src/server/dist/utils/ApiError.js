"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, stack) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.stack = stack;
        // Ghi lại Stack Trace (dấu vết ngăn xếp) để thuận tiện cho việc debug
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map