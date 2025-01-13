import { Op, Sequelize, WhereOptions } from "sequelize";
import Permissions from "../models/Permissions";
import Roles from "../models/Roles";
import User from "../models/User";
import { SortOptions } from "../utils/commonUtils";
import Follows from "../models/Follows";

export const attributesUser = ["id", "name", "email", "slug", "imagePath"];
export const attributesRole = ["id", "name"];

interface GetAllOptions {
  page: number;
  limit: number;
  userId?: string;
  sort?: SortOptions;
  keyword?: string;
  // role?: string;
  where?: WhereOptions;
}

export default class UserService {
  static userQueryOptions = {
    attributes: [
      ...attributesUser,
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM follows AS f
          WHERE f.followingId = User.id
        )`),
        "followers",
      ],
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM songs AS s
          WHERE s.userId = User.id
        )`),
        "songs",
      ],
      [
        Sequelize.literal(`(
          SELECT COUNT(*)
          FROM playlists AS p
          WHERE p.userId = User.id
        )`),
        "playlists",
      ],
    ],
    include: [
      {
        model: Roles,
        as: "role",
        attributes: attributesRole, // Lấy tên của vai trò
      },
    ],
  };

  static async getAll() {
    return User.findAll({
      attributes: attributesUser,
      include: [{ model: Roles, as: "role", attributes: attributesRole }],
    });
  }

  static async getSongsWithPagination({
    limit = 10,
    page = 1,
    userId,
    sort,
    keyword,
    where,
  }: GetAllOptions) {
    const offset = (page - 1) * limit;

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
          order[0] = [Sequelize.literal("followers"), "DESC"];
          break;
      }
    }

    const whereCondition: any = {};

    if (keyword) {
      whereCondition[Op.and] = whereCondition[Op.and] || [];
      whereCondition[Op.and].push({
        [Op.or]: [
          { name: { [Op.substring]: keyword } },
          { email: { [Op.substring]: keyword } },
          { slug: { [Op.substring]: keyword } },
        ],
      });
    }

    const totalItems = await User.count({
      where: {
        [Op.and]: [whereCondition, where],
      },
    });

    const users = await User.findAndCountAll({
      ...this.userQueryOptions,
      where: {
        [Op.and]: [whereCondition, where],
      },
      order,
      limit,
      offset: offset,
    } as any);

    return {
      data: users.rows,
      sort: sort || "newest",
      keyword: keyword || "",
      user: userId || "",
      limit: limit,
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  static async getAllFollowPagination({
    page = 1,
    limit = 10,
    userId,
    keyword,
  }: GetAllOptions) {
    const offset = (page - 1) * limit;

    const whereCondition = {} as any;
    
    if (keyword) {
      whereCondition[Op.and] = whereCondition[Op.and] || [];
      whereCondition[Op.and].push({
        [Op.or]: [
          { name: { [Op.substring]: keyword } },
          { email: { [Op.substring]: keyword } },
        ],
      });
    }

    const follows = await Follows.findAll({
      where: { followerId: userId },
      attributes: ["followingId", "followerId", 'createdAt'], // Lấy danh sách playlistId
      order: [["createdAt", "DESC"]],
    });

    const followIds = follows.map((f) => f.followingId);

    const totalItems = await User.count({
      where: {
        [Op.and]: [whereCondition, { id: { [Op.in]: followIds } }],
      },
    });

    const users = await User.findAll({
      where: { [Op.and]: [whereCondition, { id: { [Op.in]: followIds } }] },
      ...this.userQueryOptions,
      offset: offset ? offset : undefined,
      limit: limit !== 0 ? limit : undefined,
    } as any);

    const orderedUser = followIds
      .map((id) =>
        users.find((follow) => {
          return follow.id === id;
        })
      )
      .filter((follow) => follow !== null && follow !== undefined);

    return {
      data: orderedUser,
      sort: "newest",
      keyword: keyword || "",
      user: userId || "",
      limit: limit,
      totalItems: totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
    };
  }

  static async getById(id: string) {
    return User.findByPk(id, {
      attributes: attributesUser,

      include: [
        {
          model: Roles,
          as: "role",
          attributes: attributesRole,
          include: [
            {
              model: Permissions,
              attributes: ["id", "name"],
              through: { attributes: [] as never[] },
            },
          ],
        },
      ],
    });
  }

  static async getByEmail(email: string) {
    return User.findOne({
      where: { email },
      include: [{ model: Roles, as: "role", attributes: attributesRole }],
    });
  }

  static async getBySlug(slug: string) {
    return User.findOne({
      ...this.userQueryOptions,
      where: { slug },
    } as any);
  }

  static async create(user: Partial<User>) {
    return User.create(user);
  }

  static async update(id: string, user: Partial<User>) {
    return User.update(user, { where: { id } });
  }
}
