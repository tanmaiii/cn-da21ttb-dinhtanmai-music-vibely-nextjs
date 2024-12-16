import { Router } from "express";
import { getAllRolesHandler } from "../controllers/role.controller";

const router = Router();

router.get("/", getAllRolesHandler);

export default router;
