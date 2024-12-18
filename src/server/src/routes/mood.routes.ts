import { Router } from "express";
import {
  createHandler,
  deleteHandler,
  getAllHandler,
  updateHandler,
} from "../controllers/Mood.controller";
import { authorize, validateData } from "../middleware";
import {
  createMoodSchema,
  deleteMoodSchema,
  updateMoodSchema,
} from "../schema/mood.schema";
import { PERMISSIONS } from "../utils/contants";

const router: Router = Router();

router.get("/", getAllHandler);
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
