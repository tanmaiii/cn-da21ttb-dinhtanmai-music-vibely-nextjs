import Permissions from "../models/Permissions";
import Roles from "../models/Roles";

const roleQueryOptions = {
  attributes: ["id", "name"],
  include: [
    {
      model: Permissions,
      as: "permissions",
      through: { attributes: [] as never[] },
    },
  ],
};

export default class RoleService {
  // Lấy danh sách role
  static getRoles = async () =>
    Roles.findAll({
      ...roleQueryOptions,
    });

  // Lấy role theo id
  static getRoleById = async (id: string) =>
    Roles.findByPk(id, {
      ...roleQueryOptions,
    });

  static getRoleByName = async (name: string) =>
    Roles.findOne({
      where: { name },
      ...roleQueryOptions,
    });
}
