import { Sequelize } from "sequelize-typescript";
import SongPlay from "../models/SongPlay";
import { Op } from "sequelize";

export default class SongPlayService {
  static getAllPlays = () => {
    return SongPlay.findAll();
  };

  static getRecentPlays = async (days: number = 30) => {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const res = await SongPlay.findAll({
      where: {
        playedAt: {
          [Op.gte]: date,
        },
      },
    });

    const playCountByDate = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reduce((acc: { [key: string]: number }, date) => {
      acc[date] = 0;
      return acc;
    }, {});

    res.forEach((play) => {
      const date = play.playedAt.toISOString().split("T")[0];
      playCountByDate[date]++;
    });

    return playCountByDate;
  };

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
