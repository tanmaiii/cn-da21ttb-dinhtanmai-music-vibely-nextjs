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
var Playlist_1;
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const commonUtils_1 = require("../utils/commonUtils");
const contants_1 = require("../utils/contants");
const Genre_1 = __importDefault(require("./Genre"));
const Mood_1 = __importDefault(require("./Mood"));
const PlaylistMood_1 = __importDefault(require("./PlaylistMood"));
const User_1 = __importDefault(require("./User"));
const Song_1 = __importDefault(require("./Song"));
const PlaylistSong_1 = __importDefault(require("./PlaylistSong"));
const PlaylistLikes_1 = __importDefault(require("./PlaylistLikes"));
//declare :// Khai báo thuộc tính mà không cần gán giá trị ngay lập tức
// "!" : thuộc tính không bao giờ là null
let Playlist = Playlist_1 = class Playlist extends sequelize_typescript_1.Model {
    static addSlug(instance) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield Playlist_1.count({ where: { title: instance.title } });
            let suffix = "";
            if (count > 0) {
                suffix = "-" + `${count + 1}`;
            }
            instance.slug =
                (0, commonUtils_1.formatStringToSlug)(instance.title).replace(/ /g, "-") + suffix;
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        primaryKey: true,
        type: sequelize_typescript_1.DataType.UUID,
        defaultValue: sequelize_typescript_1.DataType.UUIDV4,
    }),
    __metadata("design:type", String)
], Playlist.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(contants_1.SIZE.TITLE),
    }),
    __metadata("design:type", String)
], Playlist.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(contants_1.SIZE.DESCRIPTION),
    }),
    __metadata("design:type", String)
], Playlist.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Playlist.prototype, "imagePath", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Playlist.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], Playlist.prototype, "public", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Genre_1.default) //Khóa ngoại thể loại
    ,
    __metadata("design:type", String)
], Playlist.prototype, "genreId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default) //Khóa ngoại người dùng
    ,
    __metadata("design:type", String)
], Playlist.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Genre_1.default) //Thuộc về thể loại nào
    ,
    __metadata("design:type", Genre_1.default)
], Playlist.prototype, "genre", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.default) //Thuộc về người dùng nào
    ,
    __metadata("design:type", User_1.default)
], Playlist.prototype, "creator", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Mood_1.default, () => PlaylistMood_1.default),
    __metadata("design:type", Array)
], Playlist.prototype, "moods", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => Song_1.default, () => PlaylistSong_1.default),
    __metadata("design:type", Array)
], Playlist.prototype, "songs", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => User_1.default, () => PlaylistLikes_1.default),
    __metadata("design:type", Array)
], Playlist.prototype, "users", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate // trước khi tạo
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Song_1.default]),
    __metadata("design:returntype", Promise)
], Playlist, "addSlug", null);
Playlist = Playlist_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        timestamps: true,
        tableName: "playlists",
        modelName: "Playlist",
        paranoid: true, // Cho phép xóa mềm
         
    })
], Playlist);
exports.default = Playlist;
//# sourceMappingURL=Playlist.js.map