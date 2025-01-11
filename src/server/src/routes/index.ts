import express from "express";
const router = express.Router();

import ArtistRouter from "./artists.routes";
import AuthRouter from "./auth.routes";
import GenreRouter from "./genre.routes";
import MoodRouter from "./mood.routes";
import PermissionsRouter from "./permissions.routes";
import PlaylistRouter from "./playlist.routes";
import RoleRouter from "./role.routes";
import RoomRouter from "./room.routes";
import RoomChatRouter from "./room_chat.routes";
import SongRouter from "./song.routes";
import SongPlayRouter from "./song_play.routes";
import UploadRouter from "./upload.routes";
import UserRouter from "./user.routes";
import AdminRouter from "./admin.routes";

export default (): express.Router => {
  router.use("/auth", AuthRouter);
  router.use("/user", UserRouter);
  router.use("/song", SongRouter);
  router.use("/genre", GenreRouter);
  router.use("/playlist", PlaylistRouter);
  router.use("/role", RoleRouter);
  router.use("/permissions", PermissionsRouter);
  router.use("/artist", ArtistRouter);
  router.use("/song_play", SongPlayRouter);
  router.use("/mood", MoodRouter);
  router.use("/room", RoomRouter);
  router.use("/room-chat", RoomChatRouter);
  router.use("/upload", UploadRouter);
  router.use("/admin", AdminRouter);
  return router;
};