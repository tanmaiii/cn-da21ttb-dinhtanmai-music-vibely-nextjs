const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Hahaha",
    version: "1.0.0",
  },
  host: "http://localhost:8000",
  basePath: "/",
  schemes: ["https", "http"],
  consumes: ["application/json"],
  produces: ["application/json"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../routes/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);

// node src/config/swaggerConfig.ts
