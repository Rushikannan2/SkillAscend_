import { Note } from "../models/Note.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

export const addNote = catchAsyncError(async (req, res, next) => {
  const { title, content, lectureId } = req.body;

  if (!title || !content || !lectureId)
    return next(new ErrorHandler("Please add all fields", 400));

  await Note.create({
    title,
    content,
    lecture: lectureId,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Note added successfully",
  });
});

export const getNotes = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;

  const notes = await Note.find({ 
    lecture: lectureId,
    createdBy: req.user._id 
  }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    notes,
  });
});

export const updateNote = catchAsyncError(async (req, res, next) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  const note = await Note.findById(noteId);

  if (!note) return next(new ErrorHandler("Note not found", 404));

  // Check if the note belongs to the user
  if (note.createdBy.toString() !== req.user._id.toString())
    return next(new ErrorHandler("Unauthorized", 401));

  if (title) note.title = title;
  if (content) note.content = content;

  await note.save();

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
  });
});

export const deleteNote = catchAsyncError(async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findById(noteId);

  if (!note) return next(new ErrorHandler("Note not found", 404));

  // Check if the note belongs to the user
  if (note.createdBy.toString() !== req.user._id.toString())
    return next(new ErrorHandler("Unauthorized", 401));

  await note.deleteOne();

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
}); 