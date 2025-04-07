import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { uploadVideo, handleVideoUploadError } from "../middlewares/videoMulter.js";
import {
  createLecture,
  getLecture,
  updateLecture,
  deleteLecture,
} from "../controllers/lectureController.js";

const router = express.Router();

// Lecture routes - only admin can create/update/delete
router.route("/lecture/create").post(
  isAuthenticated,
  isAdmin,
  uploadVideo,
  handleVideoUploadError,
  createLecture
);

router.route("/lecture/:lectureId")
  .get(isAuthenticated, getLecture) // All authenticated users can view
  .put(
    isAuthenticated,
    isAdmin,
    uploadVideo,
    handleVideoUploadError,
    updateLecture
  )
  .delete(isAuthenticated, isAdmin, deleteLecture);

export default router; 