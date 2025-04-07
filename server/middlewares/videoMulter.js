import multer from "multer";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

// Ensure videos directory exists
const videosDir = "uploads/videos";
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/videos");
  },
  filename(req, file, cb) {
    const id = uuid();
    const extName = path.extname(file.originalname);
    const fileName = `${id}${extName}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only video files
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed!'), false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 550, // 550MB max file size
  files: 1 // Only allow one file at a time
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits
}).single("video");

// Middleware to handle multer errors
export const handleVideoUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 550MB'
      });
    }
  }
  next(err);
}; 