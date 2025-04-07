import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

// Note routes
router.route("/note/add").post(isAuthenticated, addNote);
router.route("/notes/:lectureId").get(isAuthenticated, getNotes);
router
  .route("/note/:noteId")
  .put(isAuthenticated, updateNote)
  .delete(isAuthenticated, deleteNote);

export default router; 