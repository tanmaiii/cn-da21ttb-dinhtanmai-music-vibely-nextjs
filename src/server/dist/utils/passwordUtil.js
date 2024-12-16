"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
class PasswordUtil {
    // Mã hóa mật khẩu
    hash(password) {
        return bcrypt_1.default.hashSync(password, 12);
    }
    // So sánh mật khẩu
    compare(password, hash) {
        return bcrypt_1.default.compareSync(password, hash);
    }
}
exports.default = new PasswordUtil();
//# sourceMappingURL=passwordUtil.js.map