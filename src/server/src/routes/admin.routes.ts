import { Router } from "express";
import { authorize } from "../middleware";
import {
  getAllCreateSong,
  getAllGenre,
  getAllPlaying,
} from "../controllers/admin.controller";

const router: Router = Router();

router.get("/playing", authorize(), getAllPlaying);
router.get("/create-song", authorize(), getAllCreateSong);
router.get("/genre-numbers", authorize(), getAllGenre);

export default router;
