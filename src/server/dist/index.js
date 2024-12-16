"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser")); // dùng để đọc dữ liệu từ body của request
const compression_1 = __importDefault(require("compression")); // dùng để nén dữ liệu trước khi gửi đi
const cors_1 = __importDefault(require("cors")); // dùng để giải quyết vấn đề CORS
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http")); // dùng để tạo server
const path_1 = __importDefault(require("path"));
const error_middleware_1 = require("./middleware/error.middleware");
const routes_1 = __importDefault(require("./routes"));
const swagger_1 = require("./utils/swagger");
require("./utils/sequelize");
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
const upload = (0, multer_1.default)();
//http://localhost:8000/audio/...
app.use("/audio", express_1.default.static(path_1.default.join(__dirname, "../uploads/audio")));
app.use("/image", express_1.default.static(path_1.default.join(__dirname, "../uploads/images")));
app.use("/lyric", express_1.default.static(path_1.default.join(__dirname, "../uploads/lyrics")));
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use(middleware_1.globalAuthorize); // Middleware xử lý token
app.use("/api/", (0, routes_1.default)());
app.get("/", (req, res) => {
    res.json("Hello World");
});
// Middleware xử lý lỗi
app.use(error_middleware_1.errorMiddleware);
// Middleware xử lý form data
app.use(express_1.default.urlencoded({ extended: true }));
// Tạo open api cho swagger
(0, swagger_1.setupSwagger)(app);
const server = http_1.default.createServer(app);
server.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map