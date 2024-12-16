"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        username: "your_username",
        password: "your_password",
        database: "your_database",
        host: "127.0.0.1",
        dialect: "mysql", // hoặc postgres, sqlite, v.v.
    },
    test: {
        username: "root",
        password: "",
        database: "test_db",
        host: "127.0.0.1",
        dialect: "mysql",
    },
    production: {
        username: "root",
        password: "",
        database: "prod_db",
        host: "127.0.0.1",
        dialect: "mysql",
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map