import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from "sequelize-typescript";
import { SIZE } from "../utils/contants";
import RolePermissions from "./RolePermissions";
import Roles from "./Roles";

// Bảng quyền
@Table({
  timestamps: true,
  tableName: "permissions",
  modelName: "Permissions",
})
class Permissions extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    allowNull: false,
    type: DataType.STRING(SIZE.TITLE),
    unique: true,
  })
  name!: string;

  @Column({
    allowNull: true,
    type: DataType.STRING(SIZE.DESCRIPTION),
  })
  description!: string;

  @BelongsToMany(() => Roles, () => RolePermissions) // Một loại role có nhiều quyền
  roles: Roles[];
}

export default Permissions;
