"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let folder = "./uploads/";
        if (file.fieldname === "image") {
            folder += "images/";
        }
        else if (file.fieldname === "audio") {
            folder += "audio/";
        }
        else if (file.fieldname === "lyric") {
            folder += "lyrics/";
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "image" &&
        file.mimetype !== "image/jpeg" &&
        file.mimetype !== "image/jpg" &&
        file.mimetype !== "image/png") {
        return cb(new Error("Image file type is not supported"));
    }
    if (file.fieldname === "audio" &&
        file.mimetype !== "audio/mpeg" &&
        file.mimetype !== "audio/ogg" &&
        file.mimetype !== "audio/wav") {
        return cb(new Error("Audio file type is not supported"));
    }
    if (file.fieldname === "lyric" &&
        file.mimetype !== "application/octet-stream") {
        return cb(new Error("Lyrics file type is not supported"));
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: fileFilter,
});
const uploadFile = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
    { name: "lyric", maxCount: 1 },
]);
exports.default = uploadFile;
//# sourceMappingURL=upload.middleware.js.map