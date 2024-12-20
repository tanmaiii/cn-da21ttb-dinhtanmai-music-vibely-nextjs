// src/routes/user.ts
import { Router } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  getUserHandler,
  updateUserHandler,
  updateUserRoleHandler,
} from "../controllers/user.controller";
import { uploadFile } from "../middleware";
import { authorize } from "../middleware/auth.middleware";
import { validateData } from "../middleware/validate.middleware";
import {
  createUserSchema,
  getUserSchema,
  UpdateRoleUserSchema,
  updateUserSchema,
} from "../schema/user.schema";
import { PERMISSIONS } from "../utils/contants";
const router: Router = Router();

router.get("/", getAllUsersHandler);
router.get("/:id", validateData(getUserSchema), getUserHandler);
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_USERS),
  uploadFile,
  validateData(createUserSchema),
  createUserHandler
);
router.put(
  "/:id",
  authorize(),
  uploadFile,
  validateData(updateUserSchema),
  updateUserHandler
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(getUserSchema),
  deleteUserHandler
);
router.put(
  "/:id/role",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(UpdateRoleUserSchema),
  updateUserRoleHandler
);

export default router;
