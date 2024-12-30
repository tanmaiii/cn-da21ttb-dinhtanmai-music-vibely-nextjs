import { Server, Socket } from "socket.io";
import { EventEmitter } from "events";
import SongService from "../services/Song.service";

export const playSongSocketHandler = async (
  socket: Socket,
  io: Server,
  songEmitter: EventEmitter,
  data: {
    userId: string;
    roomId: string;
    songId: string;
  }
) => {
  // Code here
  try {
    const { userId, roomId, songId } = data;
    console.log(`Playing song ${songId} in room ${roomId}`);

    const song = SongService.getSongById(songId, userId);

    // Phát sự kiện songPlayed cho tất cả người trong phòng
    songEmitter.emit("playSong", song);

    io.to(roomId).emit("songPlayed", song);
  } catch (error) {}
};
