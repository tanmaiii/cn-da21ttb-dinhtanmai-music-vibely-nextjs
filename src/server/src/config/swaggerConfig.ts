import swaggerAutogen from 'swagger-autogen';
import dotenv from "dotenv";
dotenv.config();

const doc = {
  info: {
    title: "Hahaha",
    version: "1.0.0",
  },
  host: "http://localhost:8000", // Thay đổi địa chỉ host của bạn
  basePath: "/",
  schemes: ["https", "http"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ['./routes/index.ts']; // Thay đổi đường dẫn của file routes của bạn

swaggerAutogen()(outputFile, endpointsFiles, doc);

// node src/config/swaggerConfig.ts