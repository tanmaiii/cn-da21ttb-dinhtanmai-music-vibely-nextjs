"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const song_controller_1 = require("../controllers/song.controller");
const middleware_1 = require("../middleware");
const song_schema_1 = require("../schema/song.schema");
const contants_1 = require("../utils/contants");
const router = (0, express_1.Router)();
// Lấy tất cả bài hát
router.get("/", (0, middleware_1.validateData)(song_schema_1.getAllSongSchema), song_controller_1.getAllHandler);
// Lấy chi tiết bài hát
router.get("/:id", (0, middleware_1.validateData)(song_schema_1.getSongSchema), song_controller_1.getSongDetail);
// Tạo bài hát
router.post("/", (0, middleware_1.authorize)(contants_1.PERMISSIONS.CREATE_SONGS), middleware_1.uploadFile, (0, middleware_1.validateData)(song_schema_1.createSongSchema), song_controller_1.createSongHandler);
// Cập nhật bài hát
router.put("/:id", middleware_1.uploadFile, (0, middleware_1.authorize)(contants_1.PERMISSIONS.UPDATE_SONGS), middleware_1.isSongAuthor, (0, middleware_1.validateData)(song_schema_1.updateSongSchema), song_controller_1.updateSongHandler);
// Xóa mềm
router.put("/:id/delete", (0, middleware_1.authorize)(contants_1.PERMISSIONS.DELETE_SONGS), middleware_1.isSongAuthor, (0, middleware_1.validateData)(song_schema_1.deleteSongSchema), song_controller_1.deleteSongHandler);
// Xóa vĩnh viễn
router.delete("/:id", (0, middleware_1.authorize)(contants_1.PERMISSIONS.DELETE_SONGS), middleware_1.isSongAuthor, (0, middleware_1.validateData)(song_schema_1.destroySongSchema), song_controller_1.destroySongHandler);
// Like song
router.post("/:id/like", (0, middleware_1.authorize)(), (0, middleware_1.validateData)(song_schema_1.likeSongSchema), song_controller_1.likeSongHandler);
// Like song
router.delete("/:id/like", (0, middleware_1.authorize)(), (0, middleware_1.validateData)(song_schema_1.unLikeSongSchema), song_controller_1.unLikeSongHandler);
// Phát nhạc
router.post("/:id/play", (0, middleware_1.authorize)(contants_1.PERMISSIONS.PLAY_SONGS), (0, middleware_1.validateData)(song_schema_1.playSongSchema), song_controller_1.playSongHandler);
exports.default = router;
//# sourceMappingURL=song.routes.js.map