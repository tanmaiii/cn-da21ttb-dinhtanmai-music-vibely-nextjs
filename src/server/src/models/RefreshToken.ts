import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "refresh_tokens",
  modelName: "RefreshToken",
   
})
class RefreshToken extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare token: string;
}

export default RefreshToken;
