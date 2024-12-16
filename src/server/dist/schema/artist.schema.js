"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllArtistSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.getAllArtistSchema = (0, zod_1.object)(Object.assign({}, common_schema_1.querySchema));
//# sourceMappingURL=artist.schema.js.map