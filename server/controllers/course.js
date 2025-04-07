import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/User.js";

export const getAllCourses = TryCatch(async (req, res) => {
    try {
        const courses = await Courses.find().sort({ createdAt: -1 });
        
        if (!courses || courses.length === 0) {
            return res.status(200).json({
                success: true,
                courses: [],
                message: "No courses found"
            });
        }

        res.status(200).json({
            success: true,
            courses,
            message: "Courses fetched successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching courses",
            error: error.message
        });
    }
});

export const getSingleCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    res.json({
        course,
    });
});


export const fetchLectures = TryCatch(async (req, res) => {
    const lectures = await Lecture.find({ course: req.params.id });
    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.json({ lectures });
    }

    if (!user.subscription.includes(req.params.id)) {
        return res.status(400).json({
            message: "You have not subscribed to this course",
        });
    }

    res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    const user = await User.findById(req.user._id);

    if (user.role === "admin") {
        return res.json({ lecture });
    }

    if (!user.subscription.includes(req.params.id))
        return res.status(400).json({
            message: "You have not subscribed to this course",
        });

    res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find({ _id: req.user.subscription });

    res.json({
        courses,
    });
});
