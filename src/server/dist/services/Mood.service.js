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
exports.attributesMood = void 0;
const Mood_1 = __importDefault(require("../models/Mood"));
const PlaylistMood_1 = __importDefault(require("../models/PlaylistMood"));
const SongMood_1 = __importDefault(require("../models/SongMood"));
exports.attributesMood = ["id", "title", "description"];
class MoodService {
}
_a = MoodService;
MoodService.getMoods = () => Mood_1.default.findAll();
MoodService.getMoodById = (id) => Mood_1.default.findByPk(id);
MoodService.createMood = (mood) => Mood_1.default.create(mood);
MoodService.updateMood = (id, mood) => Mood_1.default.update(mood, { where: { id } });
MoodService.deleteMood = (id) => Mood_1.default.destroy({ where: { id } });
MoodService.addSongToMood = (songId, moodIds) => __awaiter(void 0, void 0, void 0, function* () {
    const SongMoods = yield Promise.all(moodIds.map((moodId) => __awaiter(void 0, void 0, void 0, function* () {
        const mood = yield _a.getMoodById(moodId);
        if (mood === null)
            return null;
        return {
            songId,
            moodId,
        };
    }))).then((results) => results.filter((result) => result !== null));
    return SongMood_1.default.bulkCreate(SongMoods);
});
MoodService.addPlaylistToMood = (playlistId, moodIds) => __awaiter(void 0, void 0, void 0, function* () {
    const playlistMood = yield Promise.all(moodIds.map((moodId) => __awaiter(void 0, void 0, void 0, function* () {
        const mood = yield _a.getMoodById(moodId);
        if (mood === null)
            return null;
        return {
            playlistId,
            moodId,
        };
    }))).then((results) => results.filter((result) => result !== null));
    return PlaylistMood_1.default.bulkCreate(playlistMood);
});
MoodService.updatePlaylistToMood = (playlistId, moodIds) => __awaiter(void 0, void 0, void 0, function* () {
    yield PlaylistMood_1.default.destroy({ where: { playlistId } });
    return _a.addPlaylistToMood(playlistId, moodIds);
});
exports.default = MoodService;
//# sourceMappingURL=Mood.service.js.map