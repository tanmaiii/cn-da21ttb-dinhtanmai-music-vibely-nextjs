"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.uploadFile = exports.errorMiddleware = exports.globalAuthorize = exports.isSongAuthor = exports.authorize = void 0;
var auth_middleware_1 = require("./auth.middleware");
Object.defineProperty(exports, "authorize", { enumerable: true, get: function () { return auth_middleware_1.authorize; } });
Object.defineProperty(exports, "isSongAuthor", { enumerable: true, get: function () { return auth_middleware_1.isSongAuthor; } });
Object.defineProperty(exports, "globalAuthorize", { enumerable: true, get: function () { return auth_middleware_1.globalAuthorize; } });
var error_middleware_1 = require("./error.middleware");
Object.defineProperty(exports, "errorMiddleware", { enumerable: true, get: function () { return error_middleware_1.errorMiddleware; } });
var upload_middleware_1 = require("./upload.middleware");
Object.defineProperty(exports, "uploadFile", { enumerable: true, get: function () { return __importDefault(upload_middleware_1).default; } });
var validate_middleware_1 = require("./validate.middleware");
Object.defineProperty(exports, "validateData", { enumerable: true, get: function () { return validate_middleware_1.validateData; } });
//# sourceMappingURL=index.js.map