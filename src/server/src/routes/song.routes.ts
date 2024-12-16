import { Router } from "express";
import {
  createSongHandler,
  deleteSongHandler,
  destroySongHandler,
  getAllHandler,
  getSongDetailBySlugHandler,
  getSongDetailHandler,
  likeSongHandler,
  playSongHandler,
  unLikeSongHandler,
  updateSongHandler
} from "../controllers/song.controller";
import {
  authorize,
  isSongAuthor,
  uploadFile,
  validateData,
} from "../middleware";
import {
  createSongSchema,
  deleteSongSchema,
  destroySongSchema,
  getAllSongSchema,
  getLyricsSongSchema,
  getSongSchema,
  getSongSlugSchema,
  likeSongSchema,
  playSongSchema,
  unLikeSongSchema,
  updateSongSchema,
} from "../schema/song.schema";
import { PERMISSIONS } from "../utils/contants";

const router = Router();

// Lấy tất cả bài hát
router.get("/", validateData(getAllSongSchema), getAllHandler);

// Lấy chi tiết bài hát
router.get("/:id", validateData(getSongSchema), getSongDetailHandler);

router.get("/:slug/slug", validateData(getSongSlugSchema), getSongDetailBySlugHandler);

router.get("/:id/lyrics", validateData(getLyricsSongSchema), getSongDetailHandler);

// Tạo bài hát
router.post(
  "/",
  authorize(PERMISSIONS.CREATE_SONGS),
  uploadFile,
  validateData(createSongSchema),
  createSongHandler
);

// Cập nhật bài hát
router.put(
  "/:id",
  uploadFile,
  authorize(PERMISSIONS.UPDATE_SONGS),
  isSongAuthor,
  validateData(updateSongSchema),
  updateSongHandler
);

// Xóa mềm
router.put(
  "/:id/delete",
  authorize(PERMISSIONS.DELETE_SONGS),
  isSongAuthor,
  validateData(deleteSongSchema),
  deleteSongHandler
);

// Xóa vĩnh viễn
router.delete(
  "/:id",
  authorize(PERMISSIONS.DELETE_SONGS),
  isSongAuthor,
  validateData(destroySongSchema),
  destroySongHandler
);

// Like song
router.post(
  "/:id/like",
  authorize(),
  validateData(likeSongSchema),
  likeSongHandler
);

// Like song
router.delete(
  "/:id/like",
  authorize(),
  validateData(unLikeSongSchema),
  unLikeSongHandler
);

// Phát nhạc

router.post(
  "/:id/play",
  authorize(PERMISSIONS.PLAY_SONGS),
  validateData(playSongSchema),
  playSongHandler
);

export default router;
