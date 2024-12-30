import { Socket } from "socket.io";
import RoomService from "../services/Room.service";

// Tham gia nhóm
export const joinRoomHandler = async (
  socket: Socket,
  roomId: string,
  userId: string
) => {
  try {
    const existsUser = await RoomService.checkUserToRoom(roomId, userId);
    socket.join(roomId); // Người dùng vào phòng chat

    if (existsUser) {
      console.log(`User ${userId} already in room ${roomId}`);
      return;
    }

    await RoomService.addUserToRoom(roomId, userId); // Lưu người dùng vào phòng chat

    console.log(`User ${userId} joined room ${roomId}`);
  } catch (error) {
    console.error("Error join room:", error);
  }
};

// Rời nhóm
export const leaveRoomHandler = async (
  socket: Socket,
  roomId: string,
  userId: string
) => {
  try {
    const exitsUser = await RoomService.checkUserToRoom(roomId, userId);
    socket.leave(roomId); // Xóa người dùng khỏi phòng chat
  
    if (!exitsUser) {
      console.log(`User ${userId} not in room ${roomId}`);
      return;
    }

    console.log("User left room", roomId, userId);
    await RoomService.removeUserToRoom(roomId, userId); //Lưu người dùng vào phòng chat
  } catch (error) {
    console.error("Error leave room:", error);
  }
};
