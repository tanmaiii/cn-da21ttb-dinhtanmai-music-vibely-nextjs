import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import Permissions from "./Permissions";
import Roles from "./Roles";

// Bảng quyền
@Table({
  timestamps: true,
  tableName: "role_permissions",
  modelName: "RolePermissions",
   
})
class RolePermissions extends Model {
  @ForeignKey(() => Roles)
  @Column
  roleId!: string;

  @ForeignKey(() => Permissions)
  @Column
  permissionId!: string;
}

export default RolePermissions;
