"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMood = exports.updateMood = exports.createMood = exports.getMoodById = exports.getMoods = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Song_1 = __importDefault(require("./Song"));
const SongMood_1 = __importDefault(require("./SongMood"));
const Playlist_1 = __importDefault(require("./Playlist"));
const PlaylistMood_1 = __importDefault(require("./PlaylistMood"));
let Mood = class Mood extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], Mood.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
    }),
    __metadata("design:type", String)
], Mood.prototype, "title", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Mood.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Song_1.default, () => SongMood_1.default),
    __metadata("design:type", Array)
], Mood.prototype, "songs", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Playlist_1.default, () => PlaylistMood_1.default),
    __metadata("design:type", Array)
], Mood.prototype, "playlists", void 0);
Mood = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "moods", modelName: "Mood",   timestamps: true })
], Mood);
exports.default = Mood;
const getMoods = () => Mood.findAll();
exports.getMoods = getMoods;
const getMoodById = (id) => Mood.findByPk(id);
exports.getMoodById = getMoodById;
const createMood = (mood) => Mood.create(mood);
exports.createMood = createMood;
const updateMood = (id, mood) => Mood.update(mood, { where: { id } });
exports.updateMood = updateMood;
const deleteMood = (id) => Mood.destroy({ where: { id } });
exports.deleteMood = deleteMood;
//# sourceMappingURL=Mood.js.map