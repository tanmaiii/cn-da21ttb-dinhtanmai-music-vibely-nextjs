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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Permissions_1 = __importDefault(require("../models/Permissions"));
const Roles_1 = __importDefault(require("../models/Roles"));
const roleQueryOptions = {
    attributes: ["id", "name"],
    include: [
        {
            model: Permissions_1.default,
            as: "permissions",
            through: { attributes: [] },
        },
    ],
};
class RoleService {
}
_a = RoleService;
// Lấy danh sách role
RoleService.getRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    return Roles_1.default.findAll(Object.assign({}, roleQueryOptions));
});
// Lấy role theo id
RoleService.getRoleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Roles_1.default.findByPk(id, Object.assign({}, roleQueryOptions));
});
RoleService.getRoleByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return Roles_1.default.findOne(Object.assign({ where: { name } }, roleQueryOptions));
});
exports.default = RoleService;
//# sourceMappingURL=Role.service.js.map