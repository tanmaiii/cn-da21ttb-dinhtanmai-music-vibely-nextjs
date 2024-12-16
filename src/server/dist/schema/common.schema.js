"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySchema = void 0;
const zod_1 = require("zod");
exports.querySchema = {
    query: (0, zod_1.object)({
        limit: (0, zod_1.string)().default("10").optional(),
        page: (0, zod_1.string)().default("1").optional(),
        keyword: (0, zod_1.string)().optional(),
        sort: (0, zod_1.enum)(["newest", "oldest", "mostLikes", "mostListens"]).optional(),
    }),
};
//# sourceMappingURL=common.schema.js.map