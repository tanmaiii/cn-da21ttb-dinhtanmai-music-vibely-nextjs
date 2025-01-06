"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectSocket = exports.listenForSongPlayed = exports.playSong = exports.sendMessage = exports.leaveRoom = exports.listenForMessages = exports.socket = void 0;
const tokenService_1 = __importDefault(require("@/lib/tokenService"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// Kết nối với server
exports.socket = (0, socket_io_client_1.default)(API, {
    auth: {
        token: tokenService_1.default.accessToken, // Gửi token kèm theo khi kết nối
    },
});
//Đăng ký sự kiện để lắng nghe tin nhắn mới
const listenForMessages = (roomId, userId, callback) => {
    exports.socket.emit("joinRoom", roomId, userId); // Người dùng tham gia phòng chat (emit: gửi sự kiện)
    exports.socket.on("messageReceived", callback); // Lắng nghe sự kiện "messageReceived" (on: nhận sự kiện)
};
exports.listenForMessages = listenForMessages;
const leaveRoom = (roomId, userId) => {
    exports.socket.emit("leaveRoom", roomId, userId);
};
exports.leaveRoom = leaveRoom;
// Gửi một tin nhắn mới
const sendMessage = (roomId, userId, content) => {
    exports.socket.emit("newMessage", roomId, userId, content); // Gửi tin nhắn mới đến server
};
exports.sendMessage = sendMessage;
// Gửi sự kiện phát bài hát
const playSong = (roomId, songId) => {
    const songData = { roomId, songId };
    exports.socket.emit("playSong", songData); // Gửi sự kiện phát bài hát
};
exports.playSong = playSong;
// Lắng nghe sự kiện phát bài hát
const listenForSongPlayed = (callback) => {
    exports.socket.on("songPlayed", callback);
};
exports.listenForSongPlayed = listenForSongPlayed;
const disconnectSocket = () => {
    exports.socket.disconnect();
};
exports.disconnectSocket = disconnectSocket;
//# sourceMappingURL=socket.service.js.map