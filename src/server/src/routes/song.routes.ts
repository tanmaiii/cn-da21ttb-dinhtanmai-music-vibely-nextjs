import { Router } from "express";
import {
  checkLikeSongHandler,
  createSongHandler,
  deleteSongHandler,
  destroySongHandler,
  getAllHandler,
  getAllLikeSongHandler,
  getSongDetailBySlugHandler,
  getSongDetailHandler,
  likeSongHandler,
  playSongHandler,
  unLikeSongHandler,
  updateSongHandler,
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
  getAllLikeSongSchema,
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

const router: Router = Router();

// Like song
router.get(
  "/like",
  authorize(),
  validateData(getAllLikeSongSchema),
  getAllLikeSongHandler
);

router.delete(
  "/:id/like",
  authorize(),
  validateData(unLikeSongSchema),
  unLikeSongHandler
);

//Check like
router.get(
  "/:id/like",
  authorize(),
  validateData(likeSongSchema),
  checkLikeSongHandler
);

// Lấy tất cả bài hát
router.get(
  "/",
  authorize(PERMISSIONS.READ_SONGS),
  validateData(getAllSongSchema),
  getAllHandler
);

// Lấy chi tiết bài hát
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_SONGS),
  validateData(getSongSchema),
  getSongDetailHandler
);

router.get(
  "/:slug/slug",
  authorize(PERMISSIONS.READ_SONGS),
  validateData(getSongSlugSchema),
  getSongDetailBySlugHandler
);

router.get(
  "/:id/lyrics",
  authorize(PERMISSIONS.READ_SONGS),
  validateData(getLyricsSongSchema),
  getSongDetailHandler
);

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

// Phát nhạc
router.post(
  "/:id/play",
  authorize(PERMISSIONS.PLAY_SONGS),
  validateData(playSongSchema),
  playSongHandler
);

export default router;
