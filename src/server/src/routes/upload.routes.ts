import { Router } from "express";
import { uploadHandler } from "../controllers/upload.controller";
import { uploadFile } from "../middleware";

const router = Router();

router.post("/", uploadFile, uploadHandler);

export default router;
