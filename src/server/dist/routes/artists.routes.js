"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const artist_schema_1 = require("../schema/artist.schema");
const artist_controller_1 = require("../controllers/artist.controller");
const router = (0, express_1.Router)();
router.get("/", (0, middleware_1.validateData)(artist_schema_1.getAllArtistSchema), artist_controller_1.getArtistsHandler);
exports.default = router;
//# sourceMappingURL=artists.routes.js.map