"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const middleware_1 = require("../middleware");
const auth_schema_1 = require("../schema/auth.schema");
const router = (0, express_1.Router)();
/**
 * @openapi
 * '/auth/login':
 *  post:
 *    tags:
 *    - Auth
 *    summary: login
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *             $ref: '#/components/schemas/LoginInput'
 *    responses:
 *      200:
 *        description: Login
 *        content:
 *          application/json:
 *             schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *      403:
 *        description: Forbidden
 */
router.post("/validate", (0, middleware_1.authorize)(), auth_controller_1.validate);
router.post("/register", (0, middleware_1.validateData)(auth_schema_1.registerSchema), auth_controller_1.register);
router.post("/login", (0, middleware_1.validateData)(auth_schema_1.loginSchema), auth_controller_1.login);
router.post("/refresh-token", (0, middleware_1.validateData)(auth_schema_1.refreshTokenSchema), auth_controller_1.refreshToken);
router.post("/logout", (0, middleware_1.authorize)(), (0, middleware_1.validateData)(auth_schema_1.logoutSchema), auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map