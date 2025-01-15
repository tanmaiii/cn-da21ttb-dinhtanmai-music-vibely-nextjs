import { Server, Socket } from "socket.io";
import RoomService from "../services/Room.service";
import RoomSongService from "../services/RoomSong.service";
import SongService from "../services/Song.service";

export const playSongSocketHandler = async (
  socket: Socket,
  io: Server,
  data: { roomId: string; songId: string; userId: string }
) => {
  try {
    const { roomId, songId, userId } = data;
    const room = await RoomService.getById(roomId);
    const song = await SongService.getSongById(songId);
    const startedAt = new Date().toISOString();
    await RoomSongService.addCurrentSongToRoom(roomId, song.id, userId);
    io.to(roomId).emit("playReceived", song, startedAt, userId);
    return;
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
