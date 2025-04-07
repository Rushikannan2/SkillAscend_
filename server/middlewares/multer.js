import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = "uploads";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads");
  },
  filename(req, file, cb) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept all files
  cb(null, true);
};

export const uploadFiles = multer({
  storage,
  fileFilter,
}).single("file");