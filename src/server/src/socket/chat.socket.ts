import { Socket, Server } from "socket.io";
import RoomChat from "../models/RoomChat";
import RoomChatService from "../services/RoomChat.service";

export const createNewMessageHandler = async (
  socket: Socket,
  io: Server,
  data: { roomId: string; content: string; userId: string }
) => {
  try {
    const { roomId, content, userId } = data;

    console.log("New message:", data);

    const chat = await RoomChatService.create({ userId, roomId, content });

    const newChat = await RoomChatService.getById(chat.id);

    io.to(roomId).emit("messageReceived",newChat); // Phát sự kiện "messageReceived" đến tất cả người dùng trong phòng chat
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const getMessagesInRoom = async (roomId: string) => {
  return await RoomChatService.getChatByRoomId({
    page: 1,
    limit: 20,
    roomId: roomId,
  });
};
