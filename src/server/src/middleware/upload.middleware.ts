import multer from "multer";
import log from "../utils/logger";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "./uploads/";

    if (file.fieldname === "image") {
      folder += "images/";
    } else if (file.fieldname === "audio") {
      folder += "audio/";
    } else if (file.fieldname === "lyric") {
      folder += "lyrics/";
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
    console.log("file", file);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.fieldname === "image" &&
    file.mimetype !== "image/jpeg" &&
    file.mimetype !== "image/jpg" &&
    file.mimetype !== "image/png"
  ) {
    return cb(new Error("Image file type is not supported"));
  }
  if (
    file.fieldname === "audio" &&
    file.mimetype !== "audio/mpeg" &&
    file.mimetype !== "audio/ogg" &&
    file.mimetype !== "audio/wav"
  ) {
    return cb(new Error("Audio file type is not supported"));
  }
  if (
    file.fieldname === "lyric" &&
    file.mimetype !== "application/octet-stream"
  ) {
    return cb(new Error("Lyrics file type is not supported"));
  }

  cb(null, true);
};

const upload = multer({
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

export default uploadFile;
