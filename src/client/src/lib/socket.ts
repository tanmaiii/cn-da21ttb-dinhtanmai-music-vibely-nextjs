import { io } from "socket.io-client";
import tokenService from "./tokenService";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const socket = io(API, {
  auth: {
    token: tokenService.accessToken, // Gửi token kèm theo khi kết nối
  },
});
