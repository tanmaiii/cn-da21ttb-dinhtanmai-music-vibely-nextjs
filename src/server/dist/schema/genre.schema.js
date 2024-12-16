"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGenreSchema = exports.updateGenreSchema = exports.createGenreSchema = void 0;
const zod_1 = require("zod");
const contants_1 = require("../utils/contants");
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required",
        }).max(contants_1.SIZE.TITLE),
        description: (0, zod_1.string)().max(contants_1.SIZE.DESCRIPTION).optional(),
        color: (0, zod_1.string)().optional(),
    }),
};
const payloadUpdate = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)().max(contants_1.SIZE.TITLE).optional(),
        description: (0, zod_1.string)().max(contants_1.SIZE.DESCRIPTION).optional(),
        color: (0, zod_1.string)().optional(),
    }),
};
const params = {
    params: (0, zod_1.object)({
        id: (0, zod_1.string)({
            required_error: "Id is required",
        })
            .min(1)
            .max(contants_1.SIZE.UUID, `Id must be less than ${contants_1.SIZE.UUID} characters`),
    }),
};
exports.createGenreSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.updateGenreSchema = (0, zod_1.object)(Object.assign(Object.assign({}, payloadUpdate), params));
exports.getGenreSchema = (0, zod_1.object)(Object.assign({}, params));
//# sourceMappingURL=genre.schema.js.map