import { Router } from "express";
import { authorize, validateData } from "../middleware";
import {
  createMoodSchema,
  deleteMoodSchema,
  getAllMoodSchema,
  updateMoodSchema,
} from "../schema/mood.schema";
import { PERMISSIONS } from "../utils/contants";
import { createHandler, deleteHandler, getAllHandler, updateHandler } from "../controllers/mood.controller";

const router: Router = Router();

router.get("/", validateData(getAllMoodSchema), getAllHandler);
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_MOODS),
  validateData(createMoodSchema),
  createHandler
);
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_MOODS),
  validateData(updateMoodSchema),
  updateHandler
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_MOODS),
  validateData(deleteMoodSchema),
  deleteHandler
);

export default router;
