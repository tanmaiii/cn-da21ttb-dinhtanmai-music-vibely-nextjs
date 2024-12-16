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
exports.getAllRolesHandler = void 0;
const Role_service_1 = __importDefault(require("../services/Role.service"));
const http_status_codes_1 = require("http-status-codes");
const getAllRolesHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield Role_service_1.default.getRoles();
        res.status(http_status_codes_1.StatusCodes.OK).json({ data: roles, message: "Get roles successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRolesHandler = getAllRolesHandler;
//# sourceMappingURL=role.controller.js.map