import { Router } from "express";
import {
  addSongToPlaylistHandler,
  checkLikePlaylistHandler,
  createPlaylistHandler,
  deletePlaylistHandler,
  getAllPlaylistHandler,
  getAllPlaylistLikedHandler,
  getPlaylistBySlugHandler,
  getPlaylistHandler,
  getSongInPlaylistHandler,
  likePlaylistHandler,
  removeSongToPlaylistHandler,
  unLikePlaylistHandler,
  updatePlaylistHandler,
} from "../controllers/playlist.controller";
import { authorize, validateData } from "../middleware";
import { isPlaylistAuthor } from "../middleware/auth.middleware";
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
  validateData(createPlaylistSchema),
  createPlaylistHandler
);
router.put(
  "/:id",
  authorize(PERMISSIONS.UPDATE_PLAYLISTS),
  isPlaylistAuthor,
  validateData(updatePlaylistSchema),
  updatePlaylistHandler
);

router.delete(
  "/:id",
  authorize(PERMISSIONS.DELETE_PLAYLISTS),
  isPlaylistAuthor,
  deletePlaylistHandler
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
  isPlaylistAuthor,
  authorize(PERMISSIONS.UPDATE_PLAYLISTS),
  validateData(addSongToPlaylistSchema),
  addSongToPlaylistHandler
);

router.delete(
  "/:id/song",
  isPlaylistAuthor,
  authorize(PERMISSIONS.UPDATE_PLAYLISTS),
  removeSongToPlaylistHandler
);

export default router;
