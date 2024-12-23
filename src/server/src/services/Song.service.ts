import { Op, Sequelize, WhereOptions, where } from "sequelize";
import Genre from "../models/Genre";
import Mood from "../models/Mood";
import Song from "../models/Song";
import { default as SongPlay } from "../models/SongPlay";
import User from "../models/User";
import { attributesMood } from "./Mood.service";
import { attributesUser } from "./User.service";
import { SortOptions } from "../utils/commonUtils";
import PlaylistSong from "../models/PlaylistSong";

interface GetAllOptions {
  page: number;
  limit: number;
  userId?: string;
  sort?: SortOptions;
  keyword?: string;
  where?: WhereOptions;
}

export const attributesSong = [
  "id",
  "slug",
  "title",
  "description",
  "imagePath",
  "duration",
  "public",
  "createdAt",
]; // Lấy các thuộc tính cần thiết

export const attributesExcludeSong = ["updatedAt", "songPath", "lyricPath"]; // Loại bỏ các thuộc tính không cần thiết

export const songQueryOptions = {
  attributes: [
    ...attributesSong,
    [
      Sequelize.literal(
        `(SELECT COUNT(*) FROM song_plays WHERE song_plays.songId = song.id)`
      ),
      "listens",
    ],
    [
      Sequelize.literal(
        `(SELECT COUNT(*) FROM song_likes WHERE song_likes.songId = song.id)`
      ),
      "likes",
    ],
  ],
  include: [
    { model: User, attributes: attributesUser, as: "creator" },
    {
      model: Mood,
      attributes: attributesMood,
      through: { attributes: [] as never[] },
    },
    { model: Genre, attributes: attributesMood },
  ],
};

export default class SongService {
  // Lấy danh sách bài hát
  static getSongs = async (userId?: string, where?: WhereOptions) => {
    return Song.findAll({
      where: { [Op.and]: [{ [Op.or]: [{ public: true }, { userId }] }, where] },
      ...songQueryOptions,
    } as any);
  };

  // Lấy danh sách bài hát với phân trang
  static getSongsWithPagination = async ({
    page = 1,
    limit = 10,
    userId,
    sort,
    keyword,
    where,
  }: GetAllOptions) => {
    const offset = (page - 1) * limit;

    const whereCondition: any = userId
      ? {
          [Op.or]: [{ public: true }, { userId }],
        }
      : { public: true };

    if (keyword) {
      whereCondition[Op.and] = whereCondition[Op.and] || [];
      whereCondition[Op.and].push({
        [Op.or]: [
          { title: { [Op.substring]: keyword } },
          { description: { [Op.substring]: keyword } },
        ],
      });
    }

    const totalItems = await Song.count({
      where: {
        [Op.and]: [whereCondition, where],
      },
    });

    const order: any[] = [["createdAt", "DESC"]];

    if (sort) {
      switch (sort) {
        case "newest":
          order[0] = ["createdAt", "DESC"];
          break;
        case "oldest":
          order[0] = ["createdAt", "ASC"];
          break;
        case "mostLikes":
          order[0] = ["likes", "DESC"];
          break;
        case "mostListens":
          order[0] = [[Sequelize.literal("listens"), "DESC"]];
          break;
        default:
          order[0] = ["createdAt", "DESC"];
          break;
      }
    }

    const songs = await Song.findAndCountAll({
      ...songQueryOptions,
      where: {
        [Op.and]: [whereCondition, where],
      },
      limit,
      offset,
      order,
    } as any);

    return {
      data: songs.rows,
      sort: sort || "newest",
      keyword: keyword || "",
      user: userId || "",
      limit: limit,
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  };

  static getSongByArtistId = async (userId: string) => {
    return Song.findAll({
      where: { userId },
      ...songQueryOptions,
    } as any);
  };

  // Lấy bài hát theo id
  static getSongById = async (id: string, userId?: string) => {
    const whereCondition: any = userId
      ? {
          [Op.or]: [{ public: true }, { userId }],
        }
      : { public: true };
    const song = await Song.findOne({
      ...songQueryOptions,
      where: { id, ...whereCondition },
    } as any);

    return song;
  };

  static getSongBySlug = async (slug: string, userId?: string) => {
    const whereCondition: any = userId
      ? {
          [Op.or]: [{ public: true }, { userId }],
        }
      : { public: true };

    const song = await Song.findOne({
      ...songQueryOptions,
      where: { slug, ...whereCondition },
    } as any);

    return song;
  };

  // static getSongByPlaylist = async (playlistId: string, userId?: string) => {
  //   const whereCondition: any = userId
  //     ? {
  //         [Op.or]: [{ public: true }, { userId }],
  //       }
  //     : { public: true };

  //   return PlaylistSong.findAll({
  //     where: { playlistId },
  //     // include: [
  //     //   {
  //     //     model: Song,
  //     //     attributes: songQueryOptions.attributes as string[],
  //     //     include: songQueryOptions.include,
  //     //     where: whereCondition,
  //     //   },
  //     // ],
  //   });
  // };

  static getPathAudio = async (id: string) => {
    return Song.findByPk(id, {
      attributes: ["songPath"],
    });
  };

  static getSongByIdHasDelete = async (id: string) =>
    Song.findByPk(id, { paranoid: false }); // Lấy bài hát đã xóa theo id

  static updateSong = async (
    id: string,
    song: Partial<Song> // Cập nhật bài hát
  ) => Song.update(song, { where: { id } });

  static createSong = async (song: Partial<Song>) => Song.create(song); // Tạo bài hát

  static deleteSong = async (id: string) => Song.destroy({ where: { id } }); // Xóa bài hát

  static destroySong = async (id: string) =>
    Song.destroy({ where: { id: id }, force: true }); // Xóa vĩnh viễn bài hát

  static getSongsByUserId = async (
    userId: string // Lấy bài hát theo id người dùng
  ) => Song.findAll({ where: { userId } });

  static playSong = async (songId: string, userId: string) => {
    try {
      await SongPlay.create({
        userId: userId,
        songId: songId,
        playedAt: new Date(), // Gán thời gian hiện tại
      });
    } catch (error) {
      console.error("❌❌ Trùng lặp bản ghi phát bài hát.");
    }
  };
}
