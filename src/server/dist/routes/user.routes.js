"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.ts
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const middleware_1 = require("../middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const user_schema_1 = require("../schema/user.schema");
const contants_1 = require("../utils/contants");
const router = (0, express_1.Router)();
router.get("/", user_controller_1.getAllUsersHandler);
router.get("/:id", (0, validate_middleware_1.validateData)(user_schema_1.getUserSchema), user_controller_1.getUserHandler);
router.delete("/:id", (0, auth_middleware_1.authorize)(contants_1.PERMISSIONS.MANAGE_USERS), (0, validate_middleware_1.validateData)(user_schema_1.getUserSchema), user_controller_1.deleteUserHandler);
router.put("/:id", (0, auth_middleware_1.authorize)(), middleware_1.uploadFile, (0, validate_middleware_1.validateData)(user_schema_1.updateUserSchema), user_controller_1.updateUserHandler);
router.post("/", (0, auth_middleware_1.authorize)(contants_1.PERMISSIONS.MANAGE_USERS), middleware_1.uploadFile, (0, validate_middleware_1.validateData)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
exports.default = router;
//# sourceMappingURL=user.routes.js.map