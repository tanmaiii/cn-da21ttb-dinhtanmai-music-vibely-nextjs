import { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import TokenUtil from "../utils/jwt";
import { createNewMessageHandler } from "./chat.socket";
import { joinRoomHandler, leaveRoomHandler } from "./room.socket";
import { playSongSocketHandler } from "./song.socket";

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
    // Lắng nghe sự kiện "joinRoom" để người dùng tham gia phòng chat
    socket.on("joinRoom", async (roomId: string, userId: string) => {
      console.log("User joined room", roomId, userId);
      socket.data.roomId = roomId;
      socket.data.userId = userId;
      joinRoomHandler(socket, io, roomId, userId);
    });

    socket.on("leaveRoom", async (roomId: string, userId: string) => {
      leaveRoomHandler(socket, roomId, userId);
    });

    // Lắng nghe sự kiện "newMessage" để nhận tin nhắn mới
    socket.on(
      "newMessage",
      async (roomId: string, userId: string, content: string) => {
        createNewMessageHandler(socket, io, { roomId, userId, content });
      }
    );

    socket.on(
      "playSong",
      async (roomId: string, userId: string, songId: string) => {
        playSongSocketHandler(socket, io, { roomId, userId, songId });
      }
    );

    socket.on("onChangeSong", async (roomId: string, userId: string) => {
      console.log("onChangeSong", roomId, userId);
      io.to(roomId).emit("onChangeSong");
    });

    socket.on("disconnect", async () => {
      console.log("____________________ User disconnected");

      const { roomId, userId } = socket.data;
      leaveRoomHandler(socket, roomId, userId);
    });
  });
};
