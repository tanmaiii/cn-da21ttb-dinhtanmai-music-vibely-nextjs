import { Router } from "express";
import { getAllHandler } from "../controllers/permissions.controller";

const router: Router = Router();

router.get("/", getAllHandler);

export default router;
