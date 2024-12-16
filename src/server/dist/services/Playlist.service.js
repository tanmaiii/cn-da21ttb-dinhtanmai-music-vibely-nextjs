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
exports.attributesPlaylist = void 0;
const sequelize_1 = require("sequelize");
const Genre_1 = __importDefault(require("../models/Genre"));
const Mood_1 = __importDefault(require("../models/Mood"));
const Playlist_1 = __importDefault(require("../models/Playlist"));
const PlaylistSong_1 = __importDefault(require("../models/PlaylistSong"));
const Song_1 = __importDefault(require("../models/Song"));
const User_1 = __importDefault(require("../models/User"));
const Mood_service_1 = require("./Mood.service");
const Song_service_1 = require("./Song.service");
const User_service_1 = require("./User.service");
exports.attributesPlaylist = [
    "id",
    "slug",
    "title",
    "image_path",
    "description",
    "createdAt",
    "public",
];
const playlistQueryOptions = {
    attributes: exports.attributesPlaylist,
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
class PlaylistService {
}
_a = PlaylistService;
PlaylistService.getAll = () => Playlist_1.default.findAll(Object.assign({}, playlistQueryOptions));
PlaylistService.getAllWithPagination = (_b) => __awaiter(void 0, [_b], void 0, function* ({ page = 1, limit = 10, userId, sort, keyword, }) {
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
    const totalItems = yield Playlist_1.default.count({ where: whereCondition });
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
    const playlists = yield Playlist_1.default.findAndCountAll(Object.assign(Object.assign({}, playlistQueryOptions), { where: whereCondition, limit,
        offset,
        order }));
    return {
        data: playlists.rows,
        sort: sort || "newest",
        keyword: keyword || "",
        user: userId || "",
        limit: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
    };
});
PlaylistService.getById = (id) => Playlist_1.default.findByPk(id, Object.assign({}, playlistQueryOptions));
PlaylistService.getBySlug = (slug) => Playlist_1.default.findOne({ where: { slug } });
PlaylistService.getDeleteById = (id) => __awaiter(void 0, void 0, void 0, function* () { return Playlist_1.default.findByPk(id, { paranoid: false }); }); // Lấy bài hát đã xóa theo id
PlaylistService.create = (playlist) => Playlist_1.default.create(playlist);
PlaylistService.update = (id, playlist) => Playlist_1.default.update(playlist, { where: { id } });
PlaylistService.delete = (id) => Playlist_1.default.destroy({ where: { id } });
PlaylistService.addSong = (playlistSong) => PlaylistSong_1.default.create(playlistSong);
PlaylistService.getAllSongs = (playlistId) => Playlist_1.default.findAll({
    where: { id: playlistId },
    attributes: [],
    include: [
        Object.assign({ model: Song_1.default, as: "songs", through: { attributes: [] } }, Song_service_1.songQueryOptions),
    ],
});
PlaylistService.removeSong = (playlistSong) => PlaylistSong_1.default.destroy({ where: playlistSong });
exports.default = PlaylistService;
//# sourceMappingURL=Playlist.service.js.map