"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSongSchema = exports.unLikeSongSchema = exports.likeSongSchema = exports.destroySongSchema = exports.deleteSongSchema = exports.updateSongSchema = exports.createSongSchema = exports.getSongSchema = exports.getAllSongSchema = void 0;
const zod_1 = require("zod");
const contants_1 = require("../utils/contants");
const common_schema_1 = require("./common.schema");
/**
 * @openapi
 * components:
 *   schema:
 *     Song:
 *       type: object
 *       required:
 *        - title
 *        - description
 *        - price
 *        - image
 *       properties:
 *         title:
 *           type: string
 *           default: "Canon EOS 1500D DSLR Camera with 18-55mm Lens"
 *         description:
 *           type: string
 *           default: "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go."
 *         price:
 *           type: number
 *           default: 879.99
 *         image:
 *           type: string
 *           default: "https://i.imgur.com/QlRphfQ.jpg"
 *
 */
const payload = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)({
            required_error: "Title is required",
        }).max(contants_1.SIZE.TITLE, "Title is too long"),
        description: (0, zod_1.string)({})
            .max(contants_1.SIZE.DESCRIPTION, "Description is too long")
            .optional(),
        public: (0, zod_1.boolean)().optional(),
        duration: (0, zod_1.number)().optional(),
        genreId: (0, zod_1.string)().max(contants_1.SIZE.UUID).optional(),
        moodId: (0, zod_1.array)((0, zod_1.string)()).optional(),
    }),
};
const payloadUpdate = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)().max(contants_1.SIZE.TITLE, "Title is too long").optional(),
        description: (0, zod_1.string)()
            .max(contants_1.SIZE.DESCRIPTION, "Description is too long")
            .optional(),
        public: (0, zod_1.boolean)().optional(),
        duration: (0, zod_1.number)().optional(),
        genreId: (0, zod_1.string)().max(contants_1.SIZE.UUID).optional(),
        moodId: (0, zod_1.array)((0, zod_1.string)()).optional(),
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
exports.getAllSongSchema = (0, zod_1.object)(Object.assign({}, common_schema_1.querySchema));
exports.getSongSchema = (0, zod_1.object)(Object.assign({}, params));
exports.createSongSchema = (0, zod_1.object)(Object.assign({}, payload));
exports.updateSongSchema = (0, zod_1.object)(Object.assign(Object.assign({}, params), payloadUpdate));
exports.deleteSongSchema = (0, zod_1.object)(Object.assign({}, params));
exports.destroySongSchema = (0, zod_1.object)(Object.assign({}, params));
exports.likeSongSchema = (0, zod_1.object)(Object.assign({}, params));
exports.unLikeSongSchema = (0, zod_1.object)(Object.assign({}, params));
exports.playSongSchema = (0, zod_1.object)(Object.assign({}, params));
//# sourceMappingURL=song.schema.js.map