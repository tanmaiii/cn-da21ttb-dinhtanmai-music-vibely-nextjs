import { Router } from "express";
import {
  addSongToPlaylistHandler,
  createPlaylistHandler,
  getAllPlaylistHandler,
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
  getAllPlaylistSchema,
  getPlaylistSchema,
  likePlaylistSchema,
  unLikePlaylistSchema,
  updatePlaylistSchema,
} from "../schema/playlist.schema";
import { PERMISSIONS } from "../utils/contants";

const router: Router = Router();

router.get("/", validateData(getAllPlaylistSchema), getAllPlaylistHandler);
router.get("/:id", validateData(getPlaylistSchema), getPlaylistHandler);
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

export default router;
