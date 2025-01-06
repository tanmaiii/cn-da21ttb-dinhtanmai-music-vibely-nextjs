import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";

// Cấu hình cho Swagger
const options: swaggerJsdoc.Options = {
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
const swaggerSpec = swaggerJsdoc(options);

// Hàm khởi tạo Swagger UI trong ứng dụng Express
export function setupSwagger(app: Express) {
  //   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}
