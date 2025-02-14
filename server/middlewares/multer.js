import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads"); // Specify the upload folder
  },
  filename(req, file, cb) {
    const id = uuid(); // Generate a unique ID using UUID
    const extName = file.originalname.split(".").pop(); // Get file extension

    // Correct string interpolation with backticks
    const fileName = `${id}.${extName}`;

    cb(null, fileName); // Set the final file name
  },
});

// Set up multer to handle file uploads
export const uploadFiles = multer({ storage }).single("file");
