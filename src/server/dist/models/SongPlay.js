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
const sequelize_typescript_1 = require("sequelize-typescript");
const Song_1 = __importDefault(require("./Song"));
const User_1 = __importDefault(require("./User"));
let SongPlays = class SongPlays extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Song_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SongPlays.prototype, "songId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.UUID,
        allowNull: false,
    }),
    __metadata("design:type", String)
], SongPlays.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE(6), // Độ chính xác microsecond
        defaultValue: sequelize_typescript_1.Sequelize.literal("CURRENT_TIMESTAMP(6)"), // Thời gian mặc định là hiện tại
        allowNull: false,
    }),
    __metadata("design:type", Date)
], SongPlays.prototype, "playedAt", void 0);
SongPlays = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: "song_plays",
        modelName: "SongPlays",
        timestamps: false,
         
        indexes: [],
    })
], SongPlays);
exports.default = SongPlays;
//# sourceMappingURL=SongPlay.js.map