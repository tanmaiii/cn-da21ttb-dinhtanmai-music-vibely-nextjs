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

    const currentSong = await RoomSongService.getCurrentSongInRoom(roomId);

    if (room.userId === userId) {
      await RoomSongService.addCurrentSongToRoom(roomId, song.id, userId);
      const startedAt = new Date().toISOString();
      io.to(roomId).emit("playReceived", song, startedAt, userId);
      return;
    }

    if (currentSong.userId === userId) {
      const startedAt = new Date().toISOString();
      await RoomSongService.addCurrentSongToRoom(roomId, song.id, userId);
      io.to(roomId).emit("playReceived", song, startedAt, userId);
      return;
    }

    const startedAt = new Date().toISOString();
    io.to(roomId).emit("playReceived", song, startedAt, currentSong.userId);

    // if (currentSong.userId !== userId) {
    //   await RoomSongService.addCurrentSongToRoom(roomId, song.id, userId);
    //   const startedAt = new Date().toISOString();
    //   io.to(roomId).emit("playReceived", song, startedAt, userId); // Phát sự kiện "messageReceived" đến tất cả người dùng trong phòng chat
    //   return;
    // } else {
    //   const startedAt = new Date().toISOString();
    //   io.to(roomId).emit("playReceived", song, startedAt, userId); // Phát sự kiện "messageReceived" đến tất cả người dùng trong phòng chat
    // }
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
