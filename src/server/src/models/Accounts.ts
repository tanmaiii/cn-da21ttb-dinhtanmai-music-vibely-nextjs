import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import User from "./User";

@Table({
  tableName: "accounts",
  modelName: "Account",
  timestamps: true,
})
export default class Account extends Model<Account> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  username: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({
    type: DataType.ENUM("local", "google", "facebook"),
    allowNull: false,
    defaultValue: "local",
  })
  provider: string;

  @Column({ type: DataType.STRING, allowNull: true })
  providerId: string;

  @BelongsTo(() => User)
  user: User;
}
