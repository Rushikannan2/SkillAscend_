import { Progress } from "../models/Progress.js";
import TryCatch from "../middlewares/TryCatch.js";

export const updateProgress = TryCatch(async (req, res) => {
    const { lectureId, courseId, progress, lastPosition } = req.body;
    const userId = req.user._id;

    const progressDoc = await Progress.findOneAndUpdate(
        { user: userId, lecture: lectureId, course: courseId },
        {
            progress,
            lastPosition,
            completed: progress >= 90, // Mark as completed if progress is >= 90%
        },
        { upsert: true, new: true }
    );

    res.json({
        success: true,
        message: "Progress updated successfully",
        progress: progressDoc
    });
});

export const getLectureProgress = TryCatch(async (req, res) => {
    const { lectureId } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({
        user: userId,
        lecture: lectureId
    });

    res.json({
        success: true,
        progress: progress || { progress: 0, lastPosition: 0, completed: false }
    });
});

export const getCourseProgress = TryCatch(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    const progress = await Progress.find({
        user: userId,
        course: courseId
    });

    const totalProgress = progress.reduce((acc, curr) => acc + curr.progress, 0);
    const averageProgress = progress.length > 0 ? totalProgress / progress.length : 0;

    res.json({
        success: true,
        progress: {
            lectures: progress,
            averageProgress: Math.round(averageProgress)
        }
    });
}); 