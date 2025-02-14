import express from 'express';
import { isAuth, isAdmin } from "../middlewares/isAuth.js"; // Import both middlewares
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, getAllUser, updateRole} from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

// Ensure middleware order is correct
router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get('/stats',isAuth,isAdmin,getAllStats);
router.put('/User/:id',isAuth,isAdmin,updateRole);
router.get('/User',isAuth,isAdmin,getAllUser);

export default router;

