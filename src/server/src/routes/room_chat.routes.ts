import { Router } from "express";
import { createChatHandler, deleteChatHandler, getChatHandler } from "../controllers/room_chat.controller";
import { validateData } from "../middleware";
import { createChatSchema, deleteChatSchema, getChatSchema } from "../schema/room_chat.schema";

const router: Router = Router();

router.get("/:id", validateData(getChatSchema), getChatHandler);
router.post("/:id", validateData(createChatSchema), createChatHandler);
router.delete("/:id", validateData(deleteChatSchema), deleteChatHandler);

export default router;
