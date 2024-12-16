import { Router } from "express";
import {
  createGenreHandler,
  getGenresHandler,
  updateGenreHandler,
} from "../controllers/genre.controller";
import {
  uploadFile,
  validateData
} from "../middleware";
import { createGenreSchema, updateGenreSchema } from "../schema/genre.schema";

const router = Router();

router.get("/", getGenresHandler);
router.post(
  "/",
  uploadFile,
  validateData(createGenreSchema),
  createGenreHandler
);

router.put(
  "/:id",
  uploadFile,
  validateData(updateGenreSchema),
  updateGenreHandler
);

export default router;
