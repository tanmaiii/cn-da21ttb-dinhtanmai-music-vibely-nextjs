import { Server, Socket } from "socket.io";
import RoomMemberService from "../services/RoomMember.service";
import RoomSongService from "../services/RoomSong.service";

// Tham gia nhóm
export const joinRoomHandler = async (
  socket: Socket,
  io: Server,
  roomId: string,
  userId: string
) => {
  try {
    const existsUser = await RoomMemberService.checkUserToRoom(roomId, userId);

    if (existsUser) {
      await RoomSongService.updateUser(roomId, userId);
      socket.join(roomId); // Người dùng vào phòng chat
    } else {
      console.log(`User ${userId} not in room ${roomId}`);
      return;
    }
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
    const exitsUser = await RoomMemberService.checkUserToRoom(roomId, userId);

    socket.leave(roomId); // Xóa người dùng khỏi phòng chat

    if (!exitsUser) {
      console.log(`User ${userId} not in room ${roomId}`);
      return;
    }

    // await RoomMemberService.removeUserToRoom(roomId, userId); //Lưu người dùng vào phòng chat
  } catch (error) {
    console.error("Error leave room:", error);
  }
};
