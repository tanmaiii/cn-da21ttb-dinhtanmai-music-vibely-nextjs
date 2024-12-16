"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const playlist_controller_1 = require("../controllers/playlist.controller");
const middleware_1 = require("../middleware");
const playlist_schema_1 = require("../schema/playlist.schema");
const contants_1 = require("../utils/contants");
const router = (0, express_1.Router)();
router.get("/", (0, middleware_1.validateData)(playlist_schema_1.getAllPlaylistSchema), playlist_controller_1.getAllPlaylistHandler);
router.get("/:id", (0, middleware_1.validateData)(playlist_schema_1.getPlaylistSchema), playlist_controller_1.getPlaylistHandler);
router.post("/", (0, middleware_1.authorize)(contants_1.PERMISSIONS.CREATE_PLAYLIST), middleware_1.uploadFile, (0, middleware_1.validateData)(playlist_schema_1.createPlaylistSchema), playlist_controller_1.createPlaylistHandler);
router.put("/:id", (0, middleware_1.authorize)(contants_1.PERMISSIONS.UPDATE_PLAYLISTS), middleware_1.uploadFile, (0, middleware_1.validateData)(playlist_schema_1.updatePlaylistSchema), playlist_controller_1.updatePlaylistHandler);
router.post("/:id/song", (0, middleware_1.authorize)(contants_1.PERMISSIONS.UPDATE_PLAYLISTS), (0, middleware_1.validateData)(playlist_schema_1.addSongToPlaylistSchema), playlist_controller_1.addSongToPlaylistHandler);
router.get("/:id/song", (0, middleware_1.authorize)(contants_1.PERMISSIONS.READ_PLAYLISTS), (0, middleware_1.validateData)(playlist_schema_1.getSongInPlaylistSchema), playlist_controller_1.getSongInPlaylistHandler);
exports.default = router;
//# sourceMappingURL=playlist.routes.js.map