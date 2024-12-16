import { Op, Sequelize, where, WhereOptions } from "sequelize";
import Roles from "../models/Roles";
import User from "../models/User";
import { SortOptions } from "../utils/commonUtils";

export const attributesUser = [
  "id",
  "name",
  "email",
  "slug",
  "imagePath",
];
export const attributesRole = ["id", "name"];

export const userQueryOptions = {
  attributes: [
    ...attributesUser,
    [
      Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM follows AS f
                WHERE f.followingId = User.id
              )
            `),
      "followers",
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

interface GetAllOptions {
  page: number;
  limit: number;
  userId?: string;
  sort?: SortOptions;
  keyword?: string;
  where?: WhereOptions;
}

export default class UserService {
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
        case "mostFollows":
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
      ...userQueryOptions,
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

  static async getById(id: string) {
    return User.findByPk(id, {
      attributes: attributesUser,
      include: [{ model: Roles, as: "role", attributes: attributesRole }],
    });
  }

  static async getByEmail(email: string) {
    return User.findOne({
      where: { email },
      include: [{ model: Roles, as: "role", attributes: attributesRole }],
    });
  }

  static async create(user: Partial<User>) {
    return User.create(user);
  }

  static async update(id: string, user: Partial<User>) {
    return User.update(user, { where: { id } });
  }
}
