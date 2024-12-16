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
exports.unLikeSongHandler = exports.likeSongHandler = exports.destroySongHandler = exports.deleteSongHandler = exports.updateSongHandler = exports.createSongHandler = exports.getSongDetail = exports.getAllHandler = void 0;
exports.playSongHandler = playSongHandler;
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const lodash_1 = require("lodash");
const Genre_service_1 = __importDefault(require("../services/Genre.service"));
const Mood_service_1 = __importDefault(require("../services/Mood.service"));
const Song_service_1 = __importDefault(require("../services/Song.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const commonUtils_1 = require("../utils/commonUtils");
const Like_service_1 = __importDefault(require("../services/Like.service"));
// Lấy danh sách bài hát
const getAllHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 10, page = 1, keyword, sort } = req.query;
        const userId = (0, lodash_1.get)(req, "identity.id");
        const songs = yield Song_service_1.default.getSongsWithPagination({
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: sort,
            userId: userId,
            keyword: keyword,
        });
        res.json({ data: songs, message: "Get songs successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllHandler = getAllHandler;
// Lấy chi tiết bài hát
const getSongDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, lodash_1.get)(req, "identity.id");
        const song = yield Song_service_1.default.getSongById(req.params.id, userId);
        if (!song)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
        res.json({ data: song, message: "Get song successfully" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getSongDetail = getSongDetail;
// Tạo bài hát
const createSongHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Lấy userId từ token
        const userId = (0, lodash_1.get)(req, "identity.id");
        const genreId = yield Genre_service_1.default.getById(req.body.genreId);
        if (!genreId)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Genre not found");
        const files = req.files;
        const moodIds = req.body.moodId;
        if (!(0, commonUtils_1.getFilePath)(files, "audio")) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Audio file is invalid");
        }
        const data = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), { userId: userId }), ((0, commonUtils_1.getFilePath)(files, "audio") && {
            songPath: (0, commonUtils_1.getFilePath)(files, "audio"),
        })), ((0, commonUtils_1.getFilePath)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image"),
        })), ((0, commonUtils_1.getFilePath)(files, "lyric") && {
            lyricPath: (0, commonUtils_1.getFilePath)(files, "lyric"),
        }));
        const createSong = yield Song_service_1.default.createSong(data);
        if (moodIds && moodIds.length > 0) {
            yield Mood_service_1.default.addSongToMood(createSong.id, moodIds);
        }
        const songNew = yield Song_service_1.default.getSongById(createSong.id);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: "Create song successfully",
            data: songNew,
        });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.createSongHandler = createSongHandler;
// Cập nhật bài hát
const updateSongHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_service_1.default.getSongById(req.params.id);
        if (!song)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
        const files = req.files;
        const data = Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), ((0, commonUtils_1.getFilePath)(files, "audio") && {
            songPath: (0, commonUtils_1.getFilePath)(files, "audio"),
        })), ((0, commonUtils_1.getFilePath)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image"),
        })), ((0, commonUtils_1.getFilePath)(files, "lyric") && {
            lyricPath: (0, commonUtils_1.getFilePath)(files, "lyric"),
        }));
        yield Song_service_1.default.updateSong(req.params.id, data);
        const songInfo = yield Song_service_1.default.getSongById(req.params.id);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ data: songInfo, message: "Update song successfully" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.updateSongHandler = updateSongHandler;
// Xóa bài hát
const deleteSongHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_service_1.default.getSongById(req.params.id);
        if (!song)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
        yield Song_service_1.default.deleteSong(req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ data: {}, message: "Song deleted" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.deleteSongHandler = deleteSongHandler;
// Xóa vĩnh viễn bài hát
const destroySongHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield Song_service_1.default.getSongByIdHasDelete(req.params.id);
        if (!song)
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
        console.log(song);
        yield Song_service_1.default.destroySong(song.id);
        res.json({ message: "Song detroy" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.destroySongHandler = destroySongHandler;
// Thích bài hát
const likeSongHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existSong = yield Song_service_1.default.getSongById(req.params.id);
        const userId = (0, lodash_1.get)(req, "identity.id");
        if (!existSong) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
        }
        if (!userId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User not found");
        }
        const existSongLike = yield Like_service_1.default.getLikeSong(userId, req.params.id);
        if (existSongLike) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Song is already liked");
        }
        yield Like_service_1.default.likeSong(userId, req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Like song successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.likeSongHandler = likeSongHandler;
// Bỏ thích bài hát
const unLikeSongHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existSong = yield Song_service_1.default.getSongById(req.params.id);
        const userId = (0, lodash_1.get)(req, "identity.id");
        if (!existSong) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
        }
        if (!userId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "User not found");
        }
        const existSongLike = yield Like_service_1.default.getLikeSong(userId, req.params.id);
        if (!existSongLike) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Song is not liked");
        }
        yield Like_service_1.default.unLikeSong(userId, req.params.id);
        res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Unlike song successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.unLikeSongHandler = unLikeSongHandler;
// Phát nhạc
function playSongHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (0, lodash_1.get)(req, "identity.id");
            const existSong = yield Song_service_1.default.getSongById(req.params.id, userId);
            if (!existSong) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Song not found");
            }
            const pathAudio = (yield Song_service_1.default.getPathAudio(req.params.id)).toJSON();
            if (!pathAudio) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Path audio not found");
            }
            // await SongService.playSong(req.params.id, userId);
            yield Song_service_1.default.playSong(req.params.id, userId);
            const data = fs_1.default.existsSync(`./uploads/audio/${pathAudio.songPath}`);
            if (!data) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Audio not found");
            }
            res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ data: pathAudio, message: "Play song successfully" });
        }
        catch (error) {
            next(error);
        }
    });
}
//# sourceMappingURL=song.controller.js.map