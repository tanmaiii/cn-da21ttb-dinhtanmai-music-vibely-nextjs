import { Router } from "express";
import {
  createGenreHandler,
  deleteGenreHandler,
  getGenresHandler,
  updateGenreHandler,
} from "../controllers/genre.controller";
import { authorize, uploadFile, validateData } from "../middleware";
import {
  createGenreSchema,
  deleteGenreSchema,
  getAllGenreShema,
  updateGenreSchema,
} from "../schema/genre.schema";
import { PERMISSIONS } from "../utils/contants";

const router = Router();

router.get("/", validateData(getAllGenreShema), getGenresHandler);
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_GENRE),
  uploadFile,
  validateData(createGenreSchema),
  createGenreHandler
);
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_GENRE),
  uploadFile,
  validateData(updateGenreSchema),
  updateGenreHandler
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_GENRE),
  validateData(deleteGenreSchema),
  deleteGenreHandler
);

export default router;
