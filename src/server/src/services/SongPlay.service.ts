import { Sequelize } from "sequelize";
import SongPlay from "../models/SongPlay";

export default class SongPlayService {
  static getPlays = (songId: string) => {
    return SongPlay.findAll({
      attributes: [
        "songId",
        [
          Sequelize.fn("COUNT", Sequelize.col("songPlays.userId")),
          "totalPlays",
        ],
      ],
      where: { songId },
      group: ["songPlays.songId"],
    });
  };
}
