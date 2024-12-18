import { Router } from "express";
import { getAllRolesHandler } from "../controllers/role.controller";

const router: Router = Router();

router.get("/", getAllRolesHandler);
router.post("/", getAllRolesHandler);

export default router;
