import bodyParser from "body-parser"; // dùng để đọc dữ liệu từ body của request
import compression from "compression"; // dùng để nén dữ liệu trước khi gửi đi
import cors from "cors"; // dùng để giải quyết vấn đề CORS
import express from "express";
import http from "http"; // dùng để tạo server
import path from "path";
import { errorMiddleware } from "./middleware/error.middleware";
import router from "./routes";
import { setupSwagger } from "./utils/swagger";
import "./utils/sequelize";
import multer from "multer";
import { globalAuthorize } from "./middleware";

const app = express();
const PORT = process.env.PORT || 8000;

const upload = multer();

//http://localhost:8000/audio/...
app.use("/audio", express.static(path.join(__dirname, "../uploads/audio")));
app.use("/image", express.static(path.join(__dirname, "../uploads/images")));
app.use("/lyric", express.static(path.join(__dirname, "../uploads/lyrics")));

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(globalAuthorize); // Middleware xử lý token
app.use("/api/", router());
app.get("/", (req, res) => {
  res.json("Hello World");
});

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Middleware xử lý form data
app.use(express.urlencoded({ extended: true }));

// Tạo open api cho swagger
setupSwagger(app);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server is running on port: ${PORT}`);
});
