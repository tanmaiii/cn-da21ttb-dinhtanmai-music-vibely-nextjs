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
exports.songQueryOptions = exports.attributesExcludeSong = exports.attributesSong = void 0;
const sequelize_1 = require("sequelize");
const Genre_1 = __importDefault(require("../models/Genre"));
const Mood_1 = __importDefault(require("../models/Mood"));
const Song_1 = __importDefault(require("../models/Song"));
const User_1 = __importDefault(require("../models/User"));
const Mood_service_1 = require("./Mood.service");
const User_service_1 = require("./User.service");
const SongPlay_1 = __importDefault(require("../models/SongPlay"));
exports.attributesSong = [
    "id",
    "slug",
    "title",
    "description",
    "imagePath",
    "duration",
    "public",
    "createdAt",
]; // Lấy các thuộc tính cần thiết
exports.attributesExcludeSong = ["updatedAt", "songPath", "lyricPath"]; // Loại bỏ các thuộc tính không cần thiết
exports.songQueryOptions = {
    attributes: exports.attributesSong,
    include: [
        { model: User_1.default, attributes: User_service_1.attributesUser, as: "creator" },
        {
            model: Mood_1.default,
            attributes: Mood_service_1.attributesMood,
            through: { attributes: [] },
        },
        { model: Genre_1.default, attributes: Mood_service_1.attributesMood },
    ],
};
class SongService {
}
_a = SongService;
// Lấy danh sách bài hát
SongService.getSongs = (userId, where) => __awaiter(void 0, void 0, void 0, function* () {
    return Song_1.default.findAll(Object.assign({ where: Object.assign(Object.assign({}, where), { [sequelize_1.Op.or]: [
                { public: true }, // Bài hát công khai
                ...(userId ? [{ userId }] : []), // Hoặc bài hát của người dùng
            ] }) }, exports.songQueryOptions));
});
// Lấy danh sách bài hát với phân trang
SongService.getSongsWithPagination = (_b) => __awaiter(void 0, [_b], void 0, function* ({ page = 1, limit = 10, userId, sort, keyword, }) {
    const offset = (page - 1) * limit;
    const whereCondition = userId
        ? {
            [sequelize_1.Op.or]: [{ public: true }, { userId }],
        }
        : { public: true };
    if (keyword) {
        whereCondition[sequelize_1.Op.and] = whereCondition[sequelize_1.Op.and] || [];
        whereCondition[sequelize_1.Op.and].push({
            [sequelize_1.Op.or]: [
                { title: { [sequelize_1.Op.substring]: keyword } },
                { description: { [sequelize_1.Op.substring]: keyword } },
            ],
        });
    }
    const totalItems = yield Song_1.default.count({ where: whereCondition });
    const order = [["createdAt", "DESC"]];
    if (sort) {
        switch (sort) {
            case "newest":
                order[0] = ["createdAt", "DESC"];
                break;
            case "oldest":
                order[0] = ["createdAt", "ASC"];
                break;
            case "mostLikes":
                order[0] = ["likes", "DESC"];
                break;
            case "mostListens":
                order[0] = ["listens", "DESC"];
                break;
            default:
                order[0] = ["createdAt", "DESC"];
                break;
        }
    }
    const songs = yield Song_1.default.findAndCountAll(Object.assign(Object.assign({}, exports.songQueryOptions), { where: whereCondition, limit,
        offset,
        order }));
    return {
        data: songs.rows,
        sort: sort || "newest",
        keyword: keyword || "",
        user: userId || "",
        limit: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
    };
});
// Lấy bài hát theo id
SongService.getSongById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const whereCondition = userId
        ? {
            [sequelize_1.Op.or]: [{ public: true }, { userId }],
        }
        : { public: true };
    const song = yield Song_1.default.findOne(Object.assign(Object.assign({}, exports.songQueryOptions), { where: Object.assign({ id }, whereCondition) }));
    return song;
});
SongService.getPathAudio = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Song_1.default.findByPk(id, {
        attributes: ["songPath"],
    });
});
SongService.getSongByIdHasDelete = (id) => __awaiter(void 0, void 0, void 0, function* () { return Song_1.default.findByPk(id, { paranoid: false }); }); // Lấy bài hát đã xóa theo id
SongService.getSongBySlug = (slug // Lấy bài hát theo slug
) => __awaiter(void 0, void 0, void 0, function* () { return Song_1.default.findOne(Object.assign(Object.assign({}, exports.songQueryOptions), { where: { slug } })); });
SongService.updateSong = (id, song // Cập nhật bài hát
) => __awaiter(void 0, void 0, void 0, function* () { return Song_1.default.update(song, { where: { id } }); });
SongService.createSong = (song) => __awaiter(void 0, void 0, void 0, function* () { return Song_1.default.create(song); }); // Tạo bài hát
SongService.deleteSong = (id) => __awaiter(void 0, void 0, void 0, function* () { return Song_1.default.destroy({ where: { id } }); }); // Xóa bài hát
SongService.destroySong = (id) => __awaiter(void 0, void 0, void 0, function* () { return Song_1.default.destroy({ where: { id: id }, force: true }); }); // Xóa vĩnh viễn bài hát
SongService.getSongsByUserId = (userId // Lấy bài hát theo id người dùng
) => __awaiter(void 0, void 0, void 0, function* () { return Song_1.default.findAll({ where: { userId } }); });
SongService.playSong = (songId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield SongPlay_1.default.create({
            userId: userId,
            songId: songId,
            playedAt: new Date(), // Gán thời gian hiện tại
        });
        console.log("Bản ghi phát bài hát đã được tạo.");
    }
    catch (error) {
        console.error("❌❌ Trùng lặp bản ghi phát bài hát.");
    }
});
exports.default = SongService;
//# sourceMappingURL=Song.service.js.map