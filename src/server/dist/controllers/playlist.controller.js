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
exports.getSongInPlaylistHandler = exports.addSongToPlaylistHandler = exports.updatePlaylistHandler = exports.createPlaylistHandler = exports.getPlaylistHandler = exports.getAllPlaylistHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const Mood_service_1 = __importDefault(require("../services/Mood.service"));
const Playlist_service_1 = __importDefault(require("../services/Playlist.service"));
const Song_service_1 = __importDefault(require("../services/Song.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const commonUtils_1 = require("../utils/commonUtils");
const Genre_service_1 = __importDefault(require("../services/Genre.service"));
const getAllPlaylistHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10, page = 1, keyword, sort } = req.query;
        const userId = (0, lodash_1.get)(req, "identity.id");
        const playlists = yield Playlist_service_1.default.getAllWithPagination({
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: sort,
            userId: userId,
            keyword: keyword,
        });
        res.json({ data: playlists, message: "Get playlists successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPlaylistHandler = getAllPlaylistHandler;
const getPlaylistHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield Playlist_service_1.default.getById(req.params.id);
        const userId = (0, lodash_1.get)(req, "identity.id");
        if (!playlist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Playlist not found");
        }
        if ((!playlist.public && playlist.userId !== userId) || playlist.public) {
            res.json({ data: playlist, message: "Get playlist successfully" });
            return;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You don't have permission");
    }
    catch (error) {
        next(error);
    }
});
exports.getPlaylistHandler = getPlaylistHandler;
const createPlaylistHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const userId = (0, lodash_1.get)(req, "identity.id");
        const genreId = yield Genre_service_1.default.getById(req.body.genreId);
        if (!genreId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Genre not found");
        }
        const moodIds = req.body.moodId;
        const playlist = yield Playlist_service_1.default.create(Object.assign(Object.assign({ userId: userId }, req.body), ((0, commonUtils_1.getFilePath)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image"),
        })));
        // Nếu có moodId, sử dụng addMoods để lưu vào bảng trung gian
        if (moodIds && moodIds.length > 0) {
            yield Mood_service_1.default.addPlaylistToMood(playlist.id, moodIds);
        }
        const createdPlaylist = yield Playlist_service_1.default.getById(playlist.id);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            data: createdPlaylist,
            message: "Create playlist successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createPlaylistHandler = createPlaylistHandler;
const updatePlaylistHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const playlist = yield Playlist_service_1.default.getById(req.params.id);
        if (!playlist)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Playlist not found");
        const files = req.files;
        const moodIds = req.body.moodId;
        const data = Object.assign(Object.assign({}, req.body), ((0, commonUtils_1.getFilePath)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image"),
        }));
        // Nếu có moodId, sử dụng addMoods để lưu vào bảng trung gian
        if (moodIds && moodIds.length > 0) {
            yield Mood_service_1.default.updatePlaylistToMood(playlist.id, moodIds);
        }
        const newPlaylist = yield Playlist_service_1.default.update(playlist.id, data);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            data: newPlaylist,
            message: "Update playlist successfully",
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.updatePlaylistHandler = updatePlaylistHandler;
const addSongToPlaylistHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existPlaylist = yield Playlist_service_1.default.getById(req.params.id);
        const existSong = yield Song_service_1.default.getSongById(req.body.songId);
        if (!existPlaylist || !existSong) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Playlist or song not found");
        }
        const existSongInPlaylist = yield Playlist_service_1.default.getAllSongs(existPlaylist.id);
        if (existSongInPlaylist.some((song) => song.songs.some((s) => s.id === req.body.songId))) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Song already in playlist");
        }
        const body = {
            playlistId: req.params.id,
            songId: req.body.songId,
        };
        const playlist = yield Playlist_service_1.default.addSong(body);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ data: playlist, message: "Add song to playlist successfully" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.addSongToPlaylistHandler = addSongToPlaylistHandler;
const getSongInPlaylistHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existPlaylist = yield Playlist_service_1.default.getById(req.params.id);
        if (!existPlaylist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Playlist not found");
        }
        const songs = yield Playlist_service_1.default.getAllSongs(existPlaylist.id);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ data: songs, message: "Get songs in playlist successfully" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getSongInPlaylistHandler = getSongInPlaylistHandler;
//# sourceMappingURL=playlist.controller.js.map