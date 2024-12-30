import { Server, Socket } from "socket.io";
import { EventEmitter } from "events";
import { JwtPayload } from "jsonwebtoken";
import TokenUtil from "../utils/jwt";
import { createNewMessageHandler } from "./chat.socket";
import { joinRoomHandler, leaveRoomHandler } from "./room.socket";
import { playSongSocketHandler } from "./song.socket";

// Khởi tạo EventEmitter cho việc phát bài hát
const songEmitter = new EventEmitter();

export const socketHandler = (io: Server) => {
  // Middleware xác thực người dùng
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log("[ User connected with token ]");

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const tokenInfo = TokenUtil.decodeToken(token) as JwtPayload;
      if (tokenInfo) {
        socket.data.user = tokenInfo;
      }
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Khi người dùng kết nối
  io.on("connection", (socket: Socket) => {
    console.log("A user connected", socket.data.user);

    // Lắng nghe sự kiện "joinRoom" để người dùng tham gia phòng chat
    socket.on("joinRoom", async (roomId: string, userId: string) => {
      console.log("User joined room", roomId, userId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      joinRoomHandler(socket, roomId, userId);
    });

    socket.on("leaveRoom", async (roomId: string, userId: string) => {
      leaveRoomHandler(socket, roomId, userId);
    })

    // Lắng nghe sự kiện "newMessage" để nhận tin nhắn mới
    socket.on(
      "newMessage",
      async (roomId: string, userId: string, content: string) => {
        createNewMessageHandler(socket, io, { roomId, userId, content });
      }
    );

    // Khi người dùng gửi sự kiện phát bài hát
    socket.on("playSong", (userId: string, roomId: string, songId: string) => {
      playSongSocketHandler(socket, io, songEmitter, {
        userId,
        roomId,
        songId,
      });
    });

    // Lắng nghe sự kiện phát bài hát từ EventEmitter
    songEmitter.on("playSong", (songId: string) => {
      console.log("Song played:", songId);
    });

    socket.on("disconnect", async () => {
      const { roomId, userId } = socket.data;
      console.log("User disconnected", roomId, userId);
      if (roomId && userId) {
        leaveRoomHandler(socket, roomId, userId);
        console.log("User disconnected", socket.id);
      }
    });
  });
};
