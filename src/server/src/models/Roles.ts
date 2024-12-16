import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table
} from "sequelize-typescript";
import { SIZE } from "../utils/contants";
import Permissions from "./Permissions";
import RolePermissions from "./RolePermissions";
import User from "./User";

// Bảng loại quyền
@Table({
  timestamps: true,
  tableName: "roles",
  modelName: "Roles",
   
})
class Roles extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  // Tiêu đề bài hát
  @Column({
    allowNull: false,
    type: DataType.STRING(SIZE.TITLE),
    unique: true,
  })
  name!: string;

  @BelongsToMany(() => Permissions, () => RolePermissions) // Một loại role có nhiều quyền
  permissions!: Permissions[];

  @HasMany(() => User) // Bao gồm nhiều người dùng
  users: User[];
}

export default Roles;
