"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGenreHandler = exports.createGenreHandler = exports.getGenresHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const Genre_service_1 = __importDefault(require("../services/Genre.service"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const commonUtils_1 = require("../utils/commonUtils");
const getGenresHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genres = yield Genre_service_1.default.getAll();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ data: genres, message: "Get genres successfully" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.getGenresHandler = getGenresHandler;
const createGenreHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const data = Object.assign(Object.assign({}, req.body), ((0, commonUtils_1.getFilePath)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image"),
        }));
        const genre = yield Genre_service_1.default.create(data);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ data: genre, message: "Create genre successfully" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.createGenreHandler = createGenreHandler;
const updateGenreHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genre = yield Genre_service_1.default.getById(req.params.id);
        if (!genre) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Genre not found");
        }
        const files = req.files;
        const data = Object.assign(Object.assign({}, req.body), ((0, commonUtils_1.getFilePath)(files, "image") && {
            imagePath: (0, commonUtils_1.getFilePath)(files, "image")
        }));
        const newGenre = yield Genre_service_1.default.update(req.params.id, data);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ data: newGenre, message: "Update genre successfully" });
        return;
    }
    catch (error) {
        next(error);
    }
});
exports.updateGenreHandler = updateGenreHandler;
//# sourceMappingURL=genre.controller.js.map