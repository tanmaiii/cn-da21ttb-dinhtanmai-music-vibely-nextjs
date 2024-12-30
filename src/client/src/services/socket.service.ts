import tokenService from "@/lib/tokenService";
import { IMessageChat } from "@/types/room.type";
import io from "socket.io-client";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Kết nối với server
export const socket = io(API, {
  auth: {
    token: tokenService.accessToken, // Gửi token kèm theo khi kết nối
  },
});


//Đăng ký sự kiện để lắng nghe tin nhắn mới
export const listenForMessages = (
  roomId: string,
  userId: string,
  callback: (message: IMessageChat) => void
) => {
  socket.emit("joinRoom", roomId, userId); // Người dùng tham gia phòng chat (emit: gửi sự kiện)
  socket.on("messageReceived", callback); // Lắng nghe sự kiện "messageReceived" (on: nhận sự kiện)
};

export const leaveRoom = (roomId: string, userId: string) => {
  socket.emit("leaveRoom", roomId, userId);
}

// Gửi một tin nhắn mới
export const sendMessage = (
  roomId: string,
  userId: string,
  content: string
) => {
  socket.emit("newMessage", roomId, userId, content); // Gửi tin nhắn mới đến server
};

// Gửi sự kiện phát bài hát
export const playSong = (roomId: string, songId: string) => {
  const songData = { roomId, songId };
  socket.emit("playSong", songData); // Gửi sự kiện phát bài hát
};

// Lắng nghe sự kiện phát bài hát
export const listenForSongPlayed = (
  callback: (data: { songId: string; roomId: string }) => void
) => {
  socket.on("songPlayed", callback);
};


export const disconnectSocket = () => {
  socket.disconnect();
};