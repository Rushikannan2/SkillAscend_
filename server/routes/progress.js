import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { updateProgress, getLectureProgress, getCourseProgress } from "../controllers/progress.js";

const router = express.Router();

router.post("/update", isAuth, updateProgress);
router.get("/lecture/:lectureId", isAuth, getLectureProgress);
router.get("/course/:courseId", isAuth, getCourseProgress);

export default router; 