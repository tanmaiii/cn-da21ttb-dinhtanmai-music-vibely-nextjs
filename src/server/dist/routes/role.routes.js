"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const router = (0, express_1.Router)();
router.get("/", role_controller_1.getAllRolesHandler);
exports.default = router;
//# sourceMappingURL=role.routes.js.map