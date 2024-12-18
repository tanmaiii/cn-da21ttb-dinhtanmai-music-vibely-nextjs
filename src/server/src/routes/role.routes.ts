import { Router } from "express";
import {
  createRoleHandler,
  deleteRoleHandler,
  getAllRolesHandler,
  updateRoleHandler,
} from "../controllers/role.controller";
import { PERMISSIONS } from "../utils/contants";
import { authorize } from "../middleware";

const router: Router = Router();

router.get("/", authorize(PERMISSIONS.MANAGE_USERS), getAllRolesHandler);
router.post("/", authorize(PERMISSIONS.MANAGE_USERS), createRoleHandler);
router.put("/:id", authorize(PERMISSIONS.MANAGE_USERS), updateRoleHandler);
router.delete("/:id", authorize(PERMISSIONS.MANAGE_USERS), deleteRoleHandler);

export default router;
