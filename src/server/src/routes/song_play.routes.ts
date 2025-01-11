import { Router } from "express";
import {
  getAllSongPlay,
  getSongPlays,
} from "../controllers/song_play.controller";
import { authorize } from "../middleware";

const router: Router = Router();

router.get("/", authorize(), getAllSongPlay);
router.get("/:id", authorize(), getSongPlays);

export default router;
