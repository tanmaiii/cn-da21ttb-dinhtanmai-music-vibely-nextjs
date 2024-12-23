import { Router } from "express";
import {
  checkFollowArtistHandler,
  followArtistHandler,
  getArtistBySlugHandler,
  getArtistPlaylistHandler,
  getArtistsHandler,
  getArtistSongHandler,
  unFollowArtistHandler,
} from "../controllers/artist.controller";
import { validateData } from "../middleware";
import {
  followArtistSchema,
  getAllArtistSchema,
  getArtistBySlugSchema,
  getArtistPlaylistSchema,
  getArtistSongSchema
} from "../schema/artist.schema";

const router = Router();

router.get("/", validateData(getAllArtistSchema), getArtistsHandler);
router.get("/:slug/slug", validateData(getArtistBySlugSchema), getArtistBySlugHandler);
router.get(
  "/:id/playlist",
  validateData(getArtistPlaylistSchema),
  getArtistPlaylistHandler
);
router.get(
  "/:id/song",
  validateData(getArtistSongSchema),
  getArtistSongHandler
);
router.post(
  "/:id/follow",
  validateData(followArtistSchema),
  followArtistHandler
);
router.delete(
  "/:id/follow",
  validateData(followArtistSchema),
  unFollowArtistHandler
);
router.get(
  "/:id/follow",
  validateData(followArtistSchema),
  checkFollowArtistHandler
);

export default router;
