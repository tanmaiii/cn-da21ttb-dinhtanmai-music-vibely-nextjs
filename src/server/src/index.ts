import bodyParser from "body-parser"; // dùng để đọc dữ liệu từ body của request
import compression from "compression"; // dùng để nén dữ liệu trước khi gửi đi
import cors from "cors"; // dùng để giải quyết vấn đề CORS
import express from "express";
import http from "http"; // dùng để tạo server
import path from "path";
import { Server } from "socket.io";
import { globalAuthorize } from "./middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import router from "./routes";
import { socketHandler } from "./socket";
import "./config/sequelizeConfig";
import socketConfig from "./config/socketConfig";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger-output.json";

const PORT = process.env.PORT || 8000;
const url = process.env.URL_FRONTEND || "http://localhost:3000";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { ...socketConfig }); // Tạo socket server

// Đăng ký các folder chứa file tĩnh
app.use("/audio", express.static(path.join(__dirname, "../uploads/audio")));
app.use("/image", express.static(path.join(__dirname, "../uploads/images")));
app.use("/lyric", express.static(path.join(__dirname, "../uploads/lyrics")));

app.use(
  cors({
    origin: url,
    credentials: true,
  })
);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(globalAuthorize); // Middleware xử lý token
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/", router());
app.get("/", (req, res) => {
  res.send("Hello");
});

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Middleware xử lý form data
app.use(express.urlencoded({ extended: true }));

socketHandler(io);

server.listen(PORT, () => console.log(`✅ Server is running on port: ${PORT}`));
