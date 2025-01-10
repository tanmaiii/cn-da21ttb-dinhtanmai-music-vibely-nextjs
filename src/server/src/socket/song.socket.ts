import { Server, Socket } from "socket.io";
import SongService from "../services/Song.service";
import RoomSongService from "../services/RoomSong.service";

// export const updateSongSocketHandler = (
//   socket: Socket,
//   io: Server,
//   data: { userId: string; roomId: string; songId: string; currentTime: number }
// ) => {
//   const { userId, roomId, songId, currentTime } = data;

//   // Emit sự kiện tới tất cả người dùng trong phòng ngoại trừ người gửi
//   console.log("Phát sự kiện songUpdated cho tất cả người trong phòng");

//   io.to(roomId).emit("songUpdated", { songId, currentTime });
// };

export const playSongSocketHandler = async (
  socket: Socket,
  io: Server,
  data: { roomId: string; songId: string; userId: string }
) => {
  try {
    const { roomId, songId, userId } = data;

    console.log("New message:", data);

    // const chat = await RoomChatService.create({ userId, roomId, songId });
    const song = await SongService.getSongById(songId);

    // const newChat = await RoomChatService.getById(chat.id);

    await RoomSongService.addCurrentSongToRoom(roomId, songId);

    io.to(roomId).emit("playReceived", song); // Phát sự kiện "messageReceived" đến tất cả người dùng trong phòng chat
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
