import { Router } from "express";
import {
  createRoleHandler,
  deleteRoleHandler,
  getAllRolesHandler,
  updateRoleHandler,
} from "../controllers/role.controller";
import { authorize, validateData } from "../middleware";
import {
  createRoleSchema,
  getRoleSchema,
  updateRoleSchema,
} from "../schema/role.schema";
import { deleteChatSchema } from "../schema/room_chat.schema";
import { PERMISSIONS } from "../utils/contants";

const router: Router = Router();

router.get("/", authorize(PERMISSIONS.MANAGE_USERS), getAllRolesHandler);
router.get(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(getRoleSchema),
  updateRoleHandler
);
router.post(
  "/",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(createRoleSchema),
  createRoleHandler
);
router.put(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(updateRoleSchema),
  updateRoleHandler
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.MANAGE_USERS),
  validateData(deleteChatSchema),
  deleteRoleHandler
);

export default router;
