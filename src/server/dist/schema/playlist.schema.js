"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongInPlaylistSchema = exports.addSongToPlaylistSchema = exports.updatePlaylistSchema = exports.createPlaylistSchema = exports.getPlaylistSchema = exports.getAllPlaylistSchema = void 0;
const zod_1 = require("zod");
const contants_1 = require("../utils/contants");
const common_schema_1 = require("./common.schema");
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required",
        })
            .max(contants_1.SIZE.TITLE, "Title is too long")
            .optional(),
        description: (0, zod_1.string)({})
            .max(contants_1.SIZE.DESCRIPTION, "Description is too long")
            .optional(),
        public: (0, zod_1.boolean)().optional(),
        duration: (0, zod_1.number)().optional(),
        genreId: (0, zod_1.string)().max(contants_1.SIZE.UUID).optional(),
        moodId: (0, zod_1.array)((0, zod_1.string)()).optional(),
    }),
};
const bodySongId = {
    body: (0, zod_1.object)({
        songId: (0, zod_1.string)({
            required_error: "SongId is required",
        }).max(contants_1.SIZE.UUID, "SongId is too long"),
    }),
};
const params = {
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "Id playlist is required",
        }).max(contants_1.SIZE.UUID, "Id is too long"),
    }),
};
exports.getAllPlaylistSchema = (0, zod_1.object)(Object.assign({}, common_schema_1.querySchema));
exports.getPlaylistSchema = (0, zod_1.object)(Object.assign({}, params));
exports.createPlaylistSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.updatePlaylistSchema = (0, zod_1.object)(Object.assign(Object.assign({}, payload), params));
exports.addSongToPlaylistSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), bodySongId));
exports.getSongInPlaylistSchema = (0, zod_1.object)(Object.assign({}, params));
//# sourceMappingURL=playlist.schema.js.map