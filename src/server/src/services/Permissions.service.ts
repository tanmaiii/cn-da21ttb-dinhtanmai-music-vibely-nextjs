import Permissions from "../models/Permissions";
import Roles from "../models/Roles";

export default class PermissionsService {
  // Lấy danh sách quyền
  static getPermissions = async () =>
    Permissions.findAll({
      attributes: ["id", "name", "description"],
      include: [
        {
          model: Roles,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });

  // Lấy quyền theo id
  static getPermissionById = async (id: string) =>
    Permissions.findByPk(id, {
      include: [
        {
          model: Roles,
          as: "roles",
          through: { attributes: [] },
        },
      ],
    });

  // Tạo quyền
  static createPermission = async (permission: Partial<Permissions>) =>
    Permissions.create(permission);

  // Cập nhật quyền
  static updatePermission = async (
    id: string,
    permission: Partial<Permissions>
  ) => Permissions.update(permission, { where: { id } });

  // Xóa quyền
  static deletePermission = async (id: string) =>
    Permissions.destroy({ where: { id } });
}
