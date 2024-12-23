import { Router } from "express";
import {
  addSongToPlaylistHandler,
  checkLikePlaylistHandler,
  createPlaylistHandler,
  getAllPlaylistHandler,
  getPlaylistBySlugHandler,
  getPlaylistHandler,
  getSongInPlaylistHandler,
  likePlaylistHandler,
  removeSongToPlaylistHandler,
  unLikePlaylistHandler,
  updatePlaylistHandler,
} from "../controllers/playlist.controller";
import { authorize, uploadFile, validateData } from "../middleware";
import {
  addSongToPlaylistSchema,
  createPlaylistSchema,
  getAllPlaylistLikeSchema,
  getAllPlaylistSchema,
  getPlaylistSchema,
  getPlaylistSlugSchema,
  likePlaylistSchema,
  unLikePlaylistSchema,
  updatePlaylistSchema,
} from "../schema/playlist.schema";
import { PERMISSIONS } from "../utils/contants";
import { getAllPlaylistLikedHandler } from "../controllers/playlist.controller";

const router: Router = Router();

// Thích
router.get(
  "/like",
  authorize(),
  validateData(getAllPlaylistLikeSchema),
  getAllPlaylistLikedHandler
);
router.get(
  "/:id/like",
  authorize(),
  validateData(likePlaylistSchema),
  checkLikePlaylistHandler
);
router.post(
  "/:id/like",
  authorize(),
  validateData(likePlaylistSchema),
  likePlaylistHandler
);
router.delete(
  "/:id/like",
  authorize(),
  validateData(unLikePlaylistSchema),
  unLikePlaylistHandler
);

// Playlist
router.get("/", validateData(getAllPlaylistSchema), getAllPlaylistHandler);
router.get("/:id", validateData(getPlaylistSchema), getPlaylistHandler);
router.get(
  "/:slug/slug",
  validateData(getPlaylistSlugSchema),
  getPlaylistBySlugHandler
);
router.post(
  "/",
  authorize(PERMISSIONS.CREATE_PLAYLIST),
  uploadFile,
  validateData(createPlaylistSchema),
  createPlaylistHandler
);
router.put(
  "/:id",
  authorize(PERMISSIONS.UPDATE_PLAYLISTS),
  uploadFile,
  validateData(updatePlaylistSchema),
  updatePlaylistHandler
);

// Song
router.get(
  "/:id/song",
  authorize(PERMISSIONS.READ_PLAYLISTS),
  validateData(getPlaylistSchema),
  getSongInPlaylistHandler
);
router.post(
  "/:id/song",
  authorize(PERMISSIONS.UPDATE_PLAYLISTS),
  validateData(addSongToPlaylistSchema),
  addSongToPlaylistHandler
);
router.delete(
  "/:id/song",
  authorize(PERMISSIONS.UPDATE_PLAYLISTS),
  removeSongToPlaylistHandler
);

export default router;
