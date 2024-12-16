"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const genre_controller_1 = require("../controllers/genre.controller");
const middleware_1 = require("../middleware");
const genre_schema_1 = require("../schema/genre.schema");
const router = (0, express_1.Router)();
router.get("/", genre_controller_1.getGenresHandler);
router.post("/", middleware_1.uploadFile, (0, middleware_1.validateData)(genre_schema_1.createGenreSchema), genre_controller_1.createGenreHandler);
router.put("/:id", middleware_1.uploadFile, (0, middleware_1.validateData)(genre_schema_1.updateGenreSchema), genre_controller_1.updateGenreHandler);
exports.default = router;
//# sourceMappingURL=genre.routes.js.map