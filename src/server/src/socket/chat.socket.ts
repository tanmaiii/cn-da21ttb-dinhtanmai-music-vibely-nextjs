import { Server, Socket } from "socket.io";
import RoomChatService from "../services/RoomChat.service";

export const createNewMessageHandler = async (
  socket: Socket,
  io: Server,
  data: { roomId: string; content: string; userId: string }
) => {
  try {
    const { roomId, content, userId } = data;

    const chat = await RoomChatService.create({ userId, roomId, content });

    const newChat = await RoomChatService.getById(chat.id);

    io.to(roomId).emit("messageReceived", newChat); // Phát sự kiện "messageReceived" đến tất cả người dùng trong phòng chat
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
