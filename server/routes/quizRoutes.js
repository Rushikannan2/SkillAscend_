import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createQuiz,
  getQuiz,
  getLectureQuizzes,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

// Quiz routes
router.route("/quiz/create").post(isAuthenticated, createQuiz);
router.route("/quiz/:quizId").get(isAuthenticated, getQuiz);
router.route("/quizzes/:lectureId").get(isAuthenticated, getLectureQuizzes);
router
  .route("/quiz/:quizId")
  .put(isAuthenticated, updateQuiz)
  .delete(isAuthenticated, deleteQuiz);
router.route("/quiz/:quizId/submit").post(isAuthenticated, submitQuiz);

export default router; 