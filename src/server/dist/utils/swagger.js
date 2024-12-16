"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = setupSwagger;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Cấu hình cho Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "This is the API documentation for the project.",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "http://localhost:8000/api/", // URL của server
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/schema/*.ts"], // Đường dẫn tới file có comment về Swagger
};
// Khởi tạo tài liệu Swagger từ cấu hình
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// Hàm khởi tạo Swagger UI trong ứng dụng Express
function setupSwagger(app) {
    //   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // Swagger page
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    // Docs in JSON format
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}
//# sourceMappingURL=swagger.js.map