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
exports.attributesGenre = void 0;
const Genre_1 = __importDefault(require("../models/Genre"));
const fs_1 = __importDefault(require("fs"));
exports.attributesGenre = ["id", "title", "description"];
class GenreService {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return Genre_1.default.findAll();
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Genre_1.default.findByPk(id);
        });
    }
    static create(genre) {
        return __awaiter(this, void 0, void 0, function* () {
            return Genre_1.default.create(genre);
        });
    }
    static update(id, genre) {
        return __awaiter(this, void 0, void 0, function* () {
            if (genre.imagePath) {
                const oldGenre = yield Genre_1.default.findByPk(id);
                const imageOldGenre = oldGenre === null || oldGenre === void 0 ? void 0 : oldGenre.imagePath;
                if (imageOldGenre) {
                    try {
                        // Cố gắng xóa ảnh cũ
                        fs_1.default.unlinkSync(`./uploads/images/${imageOldGenre}`);
                    }
                    catch (error) {
                        console.error("Lỗi khi xóa ảnh cũ:", error);
                        // Không throw lỗi để tránh làm gián đoạn việc cập nhật
                    }
                }
            }
            return Genre_1.default.update(genre, { where: { id } });
        });
    }
}
exports.default = GenreService;
//# sourceMappingURL=Genre.service.js.map