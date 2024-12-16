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
exports.userQueryOptions = exports.attributesRole = exports.attributesUser = void 0;
const sequelize_1 = require("sequelize");
const Roles_1 = __importDefault(require("../models/Roles"));
const User_1 = __importDefault(require("../models/User"));
exports.attributesUser = ["id", "name", "email", "image_path"];
exports.attributesRole = ["id", "name"];
exports.userQueryOptions = {
    attributes: exports.attributesUser,
    include: [{ model: Roles_1.default, as: "role", attributes: exports.attributesRole }],
};
class UserService {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findAll({
                attributes: exports.attributesUser,
                include: [{ model: Roles_1.default, as: "role", attributes: exports.attributesRole }],
            });
        });
    }
    static getSongsWithPagination(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit = 10, page = 1, userId, sort, keyword, }) {
            const offset = (page - 1) * limit;
            const order = [["createdAt", "DESC"]];
            const whereCondition = {};
            if (keyword) {
                whereCondition[sequelize_1.Op.and] = whereCondition[sequelize_1.Op.and] || [];
                whereCondition[sequelize_1.Op.and].push({
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.substring]: keyword } },
                        { email: { [sequelize_1.Op.substring]: keyword } },
                    ],
                });
            }
            const totalItems = yield User_1.default.count({ where: whereCondition });
            const users = yield User_1.default.findAndCountAll(Object.assign(Object.assign({}, exports.userQueryOptions), { where: whereCondition, order,
                limit, offset: offset }));
            return {
                data: users.rows,
                sort: sort || "newest",
                keyword: keyword || "",
                user: userId || "",
                limit: limit,
                totalItems: totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
            };
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findByPk(id, {
                attributes: exports.attributesUser,
                include: [{ model: Roles_1.default, as: "role", attributes: exports.attributesRole }],
            });
        });
    }
    static getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findOne({
                where: { email },
                include: [{ model: Roles_1.default, as: "role", attributes: exports.attributesRole }],
            });
        });
    }
    static create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.create(user);
        });
    }
    static update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.update(user, { where: { id } });
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=User.service.js.map