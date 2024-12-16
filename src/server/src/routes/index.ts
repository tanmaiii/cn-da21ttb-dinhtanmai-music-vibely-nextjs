import express from "express";

const router = express.Router();

import UserRouter from "./user.routes";
import SongRouter from "./song.routes";
import AuthRouter from "./auth.routes";
import GenreRouter from "./genre.routes";
import PlaylistRouter from "./playlist.routes";
import RoleRouter from "./role.routes";
import ArtistRouter from "./artists.routes";
import SongPlayRouter from "./song_play.routes";

export default (): express.Router => {
  // Define your routes here

  /**
   * @openapi
   * tags:
   *  - name: Auth
   *    description: Authentication
   *    externalDocs:
   *      description: Find out more
   *  - name: Users
   *    description: User management
   *    externalDocs:
   *     description: Find out more
   *  - name: Songs
   *    description: Song management
   *    externalDocs:
   *      description: Find out more
   */

  router.use("/auth", AuthRouter);

  router.use("/user", UserRouter);

  router.use("/song", SongRouter);

  router.use("/genre", GenreRouter);

  router.use("/playlist", PlaylistRouter);

  router.use("/role", RoleRouter);

  router.use("/artist", ArtistRouter);

  router.use("/song_play", SongPlayRouter);

  return router;
};
