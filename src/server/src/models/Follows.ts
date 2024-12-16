import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./User";

@Table({
  tableName: "follows",
  modelName: "Follows",
  timestamps: true,
  updatedAt: false,
})
class Follows extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  followerId!: string; // Người theo dõi

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  followingId!: string; // Người được theo dõi

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW, // Giá trị mặc định là thời gian hiện tại
  })
  createdAt!: Date;
}

export default Follows;
