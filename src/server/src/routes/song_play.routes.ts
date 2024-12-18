import { Router } from "express";
import { getSongPlays } from "../controllers/song_play.controller";
import { authorize } from "../middleware";

const router: Router = Router();

router.get("/:id", authorize(), getSongPlays);

export default router;
