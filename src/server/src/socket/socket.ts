import { Server, Socket } from "socket.io";
import RoomChat from "../models/RoomChat";
// import Message from "../models/messageModel"; // Mô hình Message
import { EventEmitter } from "events";
import RoomService from "../services/Room.service";

// Khởi tạo EventEmitter cho việc phát bài hát
const songEmitter = new EventEmitter();

export const socketHandler = (io: Server) => {
  // Khi người dùng kết nối
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.id);

    // Lắng nghe sự kiện "joinRoom" để người dùng tham gia phòng chat
    socket.on("joinRoom", async (roomId: string, userId: string) => {
      socket.join(roomId); // Người dùng vào phòng chat

      await RoomService.addUserToRoom(roomId, userId); //Lưu người dùng vào phòng chat

      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Lắng nghe sự kiện "newMessage" để nhận tin nhắn mới
    socket.on("newMessage", async (messageData) => {
      const { roomId, content, userId } = messageData;

      try {
        // Lưu tin nhắn vào cơ sở dữ liệu
        const newMessage = await RoomChat.create({
          roomId,
          userId,
          content,
        });

        // Phát sự kiện "messageReceived" đến tất cả người dùng trong phòng chat
        io.to(roomId).emit("messageReceived", newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Khi người dùng gửi sự kiện phát bài hát
    socket.on("playSong", (songData) => {
      const { roomId, songId } = songData;

      console.log(`Playing song ${songId} in room ${roomId}`);

      // Phát sự kiện songPlayed cho tất cả người trong phòng
      songEmitter.emit("playSong", songData);
      
      io.to(roomId).emit("songPlayed", songData);
    });

    // Lắng nghe sự kiện phát bài hát từ EventEmitter
    songEmitter.on("playSong", (songId: string) => {
      console.log("Song played:", songId);
    });

    // Lắng nghe khi người dùng ngắt kết nối
    socket.on("disconnect", async (roomId: string, userId: string) => {
      await RoomService.addUserToRoom(roomId, userId); //Lưu người dùng vào phòng chat

      console.log("User disconnected", socket.id);
    });
  });
};
