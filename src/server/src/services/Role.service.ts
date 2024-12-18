import Permissions from "../models/Permissions";
import RolePermissions from "../models/RolePermissions";
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

  // Tạo role
  static createRole = async (role: Partial<Roles>) => Roles.create(role);

  // Cập nhật role
  static updateRole = async (id: string, role: Partial<Roles>) =>
    Roles.update(role, { where: { id } });

  static addPermissionToRole = async (
    roleId: string,
    permissionIds: string[]
  ) => {
    const rolePermissionsData = await Promise.all(
      permissionIds.map(async (permissionId) => {
        const permission = await Permissions.findByPk(permissionId);
        if (permission === null) return null;
        return {
          roleId,
          permissionId,
        };
      })
    ).then((results) => results.filter((result) => result !== null));

    return RolePermissions.bulkCreate(rolePermissionsData);
  };

  static updatePermissionToRole = async (
    roleId: string,
    permissionIds: string[]
  ) => {
    await RolePermissions.destroy({ where: { roleId } });
    return RoleService.addPermissionToRole(roleId, permissionIds);
  };
}
