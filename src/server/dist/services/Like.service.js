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
const SongLikes_1 = __importDefault(require("../models/SongLikes"));
class LikeService {
}
_a = LikeService;
LikeService.getLikeSong = (userId, songId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield SongLikes_1.default.findOne({ where: { userId, songId } });
});
LikeService.likeSong = (userId, songId) => __awaiter(void 0, void 0, void 0, function* () {
    yield SongLikes_1.default.create({ userId, songId });
});
LikeService.unLikeSong = (userId, songId) => __awaiter(void 0, void 0, void 0, function* () {
    const existLike = yield SongLikes_1.default.findOne({ where: { userId, songId } });
    yield existLike.destroy();
});
LikeService.likePlaylist = (userId, playlistId) => __awaiter(void 0, void 0, void 0, function* () { });
LikeService.unLikePlaylist = (userId, playlistId) => __awaiter(void 0, void 0, void 0, function* () { });
LikeService.likeAlbum = (userId, albumId) => __awaiter(void 0, void 0, void 0, function* () { });
LikeService.unLikeAlbum = (userId, albumId) => __awaiter(void 0, void 0, void 0, function* () { });
LikeService.likeArtist = (userId, artistId) => __awaiter(void 0, void 0, void 0, function* () { });
LikeService.unLikeArtist = (userId, artistId) => __awaiter(void 0, void 0, void 0, function* () { });
exports.default = LikeService;
//# sourceMappingURL=Like.service.js.map