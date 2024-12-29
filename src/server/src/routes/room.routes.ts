import { Router } from "express";
import {
  addMemberToRoomHandler,
  addSongToRoomHandler,
  createRoomHandler,
  deleteRoomHandler,
  getAllRoomsHandler,
  getDetailRoomHandler,
  getSongsInRoomHandler,
  removeMemberToRoomHandler,
  removeSongToRoomHandler,
  updateRoomHandler,
} from "../controllers/room.controller";
import { authorize, uploadFile, validateData } from "../middleware";
import {
  addMemberToRoomSchema,
  addSongToRoomSchema,
  createRoomSchema,
  deleteRoomSchema,
  getAllRoomSchema,
  getRoomSchema,
  removeSongToRoomSchema,
  updateRoomSchema,
} from "../schema/room.schema";
import { PERMISSIONS } from "../utils/contants";
import { GetRoomSchema } from "../schema/room.schema";

const router: Router = Router();

router.get(
  "/",
  authorize(PERMISSIONS.READ_ROOM),
  validateData(getAllRoomSchema),
  getAllRoomsHandler
);
router.get(
  "/:id",
  authorize(PERMISSIONS.READ_ROOM),
  validateData(getRoomSchema),
  getDetailRoomHandler
);
router.post(
  "/",
  authorize(PERMISSIONS.CREATE_ROOM),
  validateData(createRoomSchema),
  createRoomHandler
);
router.put(
  "/:id",
  authorize(PERMISSIONS.UPDATE_ROOM),
  validateData(updateRoomSchema),
  updateRoomHandler
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.DELETE_ROOM),
  validateData(deleteRoomSchema),
  deleteRoomHandler
);
// Thêm bài hát vào phòng
router.post(
  "/:id/song",
  authorize(PERMISSIONS.UPDATE_ROOM),
  validateData(addSongToRoomSchema),
  addSongToRoomHandler
);
// Xóa bài hát vào phòng
router.delete(
  "/:id/song",
  authorize(PERMISSIONS.DELETE_ROOM),
  validateData(removeSongToRoomSchema),
  removeSongToRoomHandler
);
router.get(
  "/:id/song",
  authorize(PERMISSIONS.READ_ROOM),
  validateData(getRoomSchema),
  getSongsInRoomHandler
);
router.post(
  // Thêm thành viên vào phòng
  "/:id/member",
  authorize(PERMISSIONS.CREATE_ROOM),
  validateData(addMemberToRoomSchema),
  addMemberToRoomHandler
);
router.delete(
  "/:id/member",
  authorize(PERMISSIONS.CREATE_ROOM),
  validateData(addMemberToRoomSchema),
  removeMemberToRoomHandler
);

export default router;
