import { Lecture } from "../models/Lecture.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { Quiz } from "../models/Quiz.js";
import { Resource } from "../models/Resource.js";
import { Note } from "../models/Note.js";

export const createLecture = catchAsyncError(async (req, res, next) => {
  const { title, description, courseId } = req.body;

  if (!title || !description || !courseId || !req.file)
    return next(new ErrorHandler("Please add all fields", 400));

  const file = req.file;
  const fileUri = getDataUri(file);
  
  // Upload to cloudinary with specific settings for video
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
    chunk_size: 6000000, // 6MB chunks for reliable upload
    timeout: 600000 // 10 minutes timeout
  });

  const lecture = await Lecture.create({
    title,
    description,
    video: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
    course: courseId,
  });

  res.status(201).json({
    success: true,
    message: "Lecture created successfully",
    lecture,
  });
});

export const getLecture = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) return next(new ErrorHandler("Lecture not found", 404));

  // Get associated content
  const [resources, notes, quizzes] = await Promise.all([
    Resource.find({ lecture: lectureId }).sort({ createdAt: -1 }),
    Note.find({ lecture: lectureId }).sort({ createdAt: -1 }),
    Quiz.find({ lecture: lectureId }).sort({ createdAt: -1 })
  ]);

  res.status(200).json({
    success: true,
    lecture: {
      ...lecture.toObject(),
      resources,
      notes,
      quizzes
    }
  });
});

export const updateLecture = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;
  const { title, description } = req.body;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) return next(new ErrorHandler("Lecture not found", 404));

  if (title) lecture.title = title;
  if (description) lecture.description = description;

  if (req.file) {
    const file = req.file;
    const fileUri = getDataUri(file);

    // Delete old video
    await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
      resource_type: "video"
    });

    // Upload new video
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      resource_type: "video",
      chunk_size: 6000000,
      timeout: 600000
    });

    lecture.video = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  }

  await lecture.save();

  res.status(200).json({
    success: true,
    message: "Lecture updated successfully",
    lecture,
  });
});

export const deleteLecture = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) return next(new ErrorHandler("Lecture not found", 404));

  // Delete video from cloudinary
  await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video"
  });

  // Delete associated content
  await Promise.all([
    Resource.deleteMany({ lecture: lectureId }),
    Note.deleteMany({ lecture: lectureId }),
    Quiz.deleteMany({ lecture: lectureId })
  ]);

  await lecture.deleteOne();

  res.status(200).json({
    success: true,
    message: "Lecture deleted successfully",
  });
}); 