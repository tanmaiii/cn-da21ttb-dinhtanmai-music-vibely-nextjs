import { Router } from "express";
import { getAudioFile, uploadHandler } from "../controllers/upload.controller";
import { authorize, uploadFile } from "../middleware";

const router = Router();

router.post("/",authorize(), uploadFile, uploadHandler);
router.get("/audio/:filename", authorize(), getAudioFile);

export default router;
