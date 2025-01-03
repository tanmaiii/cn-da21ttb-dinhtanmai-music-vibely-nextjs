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
  getAllUserSchema,
  getUserSchema,
  updateRoleUserSchema,
  updateUserSchema,
} from "../schema/user.schema";
import { PERMISSIONS } from "../utils/contants";
const router: Router = Router();

router.get("/", validateData(getAllUserSchema), getAllUsersHandler);
router.get("/:id", validateData(getUserSchema), getUserHandler);
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(createUserSchema),
  createUserHandler
);
router.put(
  "/:id",
  authorize(),
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
  validateData(updateRoleUserSchema),
  updateUserRoleHandler
);

export default router;
