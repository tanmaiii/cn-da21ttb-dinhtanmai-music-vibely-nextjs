import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
dotenv.config();

const db_name = process.env.DB_NAME;
const db_username = process.env.DB_USER;
const db_password = process.env.DB_PASS;
const db_host = process.env.DB_HOST;

// Thiết lập kết nối MySQL
const sequelize = new Sequelize({
  database: db_name,
  username: db_username,
  password: db_password,
  host: db_host,
  dialect: "mysql",
  models: [__dirname + "/../models"],
  // Không log ra câu lệnh SQL
  // logging: (...msg) => console.log("DATABASE: ", msg),
  logging: false,
});

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => console.log("✅ Conneted successfully to MySQL."))
  .catch((err: any) => console.error("❌ Conneted error to MySQL:", err));

// Đồng bộ database
sequelize.sync({ alter: false }).then(() => {
  console.log("✅ Database schema has been updated (altered).");
});

export default sequelize;
