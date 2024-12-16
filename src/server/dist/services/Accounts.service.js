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
exports.attributesAccount = void 0;
const Accounts_1 = __importDefault(require("../models/Accounts"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
exports.attributesAccount = [
    "id",
    "email",
    "userId",
    "username",
    "provider",
    "providerId",
];
class AccountsService {
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Accounts_1.default.findByPk(id, {
                attributes: exports.attributesAccount,
            });
        });
    }
    static getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return Accounts_1.default.findOne({
                where: { email },
            });
        });
    }
    static create(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return Accounts_1.default.create(payload);
        });
    }
    static update(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return Accounts_1.default.update(payload, { where: { id } });
        });
    }
}
AccountsService.getRefeshTokenById = (id) => RefreshToken_1.default.findByPk(id);
AccountsService.getRefeshTokenByToken = (token) => RefreshToken_1.default.findOne({ where: { token } });
AccountsService.createRefreshToken = (id, token) => RefreshToken_1.default.create({ id, token });
AccountsService.updateRefreshToken = (id, token) => RefreshToken_1.default.update({ token }, { where: { id } });
AccountsService.deleteRefreshToken = (id) => RefreshToken_1.default.destroy({ where: { id } });
exports.default = AccountsService;
//# sourceMappingURL=Accounts.service.js.map