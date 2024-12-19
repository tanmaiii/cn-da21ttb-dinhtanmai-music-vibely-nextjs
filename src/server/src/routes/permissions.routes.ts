import { Router } from "express";
import {
  createPermissionsHandler,
  deletePermissionsHandler,
  getAllPermissionsHandler,
  updatePermissionsHandler,
} from "../controllers/permissions.controller";
import { authorize, validateData } from "../middleware";
import {
  createPermissionsSchema,
  deletePermissionsSchema,
  updatePermissionsSchema,
} from "../schema/permissions.schema";
import { PERMISSIONS } from "../utils/contants";

const router: Router = Router();

router.get("/", authorize(PERMISSIONS.MANAGE_USERS), getAllPermissionsHandler);
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(createPermissionsSchema),
  createPermissionsHandler
);
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(updatePermissionsSchema),
  updatePermissionsHandler
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(deletePermissionsSchema),
  deletePermissionsHandler
);

export default router;
