import { Op, Sequelize, WhereOptions } from "sequelize";
import Genre from "../models/Genre";
import Mood from "../models/Mood";
import Playlist from "../models/Playlist";
import PlaylistSong from "../models/PlaylistSong";
import User from "../models/User";
import { SortOptions } from "../utils/commonUtils";
import { attributesMood } from "./Mood.service";
import { attributesUser } from "./User.service";

export const attributesPlaylist = [
  "id",
  "slug",
  "title",
  "imagePath",
  "description",
  "createdAt",
  "public",
];

interface GetAllOptions {
  page: number;
  limit: number;
  userId?: string;
  sort?: SortOptions;
  keyword?: string;
  where?: WhereOptions;
}

const playlistQueryOptions = {
  attributes: [
    ...attributesPlaylist,
    [
      Sequelize.literal(
        `(SELECT COUNT(*) FROM playlist_likes WHERE playlist_likes.playlistId = playlist.id)`
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

export default class PlaylistService {
  // Lấy danh sách playlist
  static getAll = () =>
    Playlist.findAll({
      ...playlistQueryOptions,
    } as any);

  // Lấy danh sách playlist với phân trang
  static getAllWithPagination = async ({
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

    const totalItems = await Playlist.count({
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
          order[0] = [[Sequelize.literal("likes"), "DESC"]];
          break;
        default:
          order[0] = ["createdAt", "DESC"];
          break;
      }
    }

    const playlists = await Playlist.findAndCountAll({
      ...playlistQueryOptions,
      where: {
        [Op.and]: [whereCondition, where],
      },
      limit,
      offset,
      order,
    } as any);

    return {
      data: playlists.rows,
      sort: sort || "newest",
      keyword: keyword || "",
      user: userId || "",
      limit: limit,
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  };

  static getById = async (id: string, userId?: string) => {
    const whereCondition: any = userId
      ? {
          [Op.or]: [{ public: true }, { userId }],
        }
      : { public: true };
    const playlist = await Playlist.findOne({
      ...playlistQueryOptions,
      where: { id, ...whereCondition },
    } as any);

    return playlist;
  };

  static getBySlug = (slug: string) => Playlist.findOne({ where: { slug } });

  static getDeleteById = async (id: string) =>
    Playlist.findByPk(id, { paranoid: false }); // Lấy bài hát đã xóa theo id

  static create = (playlist: Partial<Playlist>) => Playlist.create(playlist);

  static update = (id: string, playlist: Partial<Playlist>) =>
    Playlist.update(playlist, { where: { id } });

  static delete = (id: string) => Playlist.destroy({ where: { id } });

  static addSong = (playlistSong: Partial<PlaylistSong>) =>
    PlaylistSong.create(playlistSong);

  static getAllSongs = (playlistId: string) =>
    Playlist.findAll({
      where: { id: playlistId },
      attributes: [],
      // include: [
      //   {
      //     model: Song,
      //     as: "songs",
      //     through: { attributes: [] },
      //     ...songQueryOptions,
      //   },
      // ],
    });

  static removeSong = (playlistSong: Partial<PlaylistSong>) =>
    PlaylistSong.destroy({ where: playlistSong });
}
