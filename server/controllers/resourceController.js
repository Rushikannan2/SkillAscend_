import { Resource } from "../models/Resource.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const addResource = catchAsyncError(async (req, res, next) => {
  const { title, description, lectureId } = req.body;

  if (!title || !description || !lectureId || !req.file)
    return next(new ErrorHandler("Please add all fields", 400));

  const file = req.file;
  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await Resource.create({
    title,
    description,
    lecture: lectureId,
    file: mycloud.secure_url,
    type: file.mimetype.split("/")[1],
  });

  res.status(201).json({
    success: true,
    message: "Resource added successfully",
  });
});

export const getResources = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;

  const resources = await Resource.find({ lecture: lectureId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    resources,
  });
});

export const updateResource = catchAsyncError(async (req, res, next) => {
  const { resourceId } = req.params;
  const { title, description } = req.body;

  const resource = await Resource.findById(resourceId);

  if (!resource) return next(new ErrorHandler("Resource not found", 404));

  if (title) resource.title = title;
  if (description) resource.description = description;

  if (req.file) {
    const file = req.file;
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    
    // Delete old file from cloudinary
    await cloudinary.v2.uploader.destroy(resource.file.split("/").pop().split(".")[0]);
    
    resource.file = mycloud.secure_url;
    resource.type = file.mimetype.split("/")[1];
  }

  await resource.save();

  res.status(200).json({
    success: true,
    message: "Resource updated successfully",
  });
});

export const deleteResource = catchAsyncError(async (req, res, next) => {
  const { resourceId } = req.params;

  const resource = await Resource.findById(resourceId);

  if (!resource) return next(new ErrorHandler("Resource not found", 404));

  // Delete file from cloudinary
  await cloudinary.v2.uploader.destroy(resource.file.split("/").pop().split(".")[0]);

  await resource.deleteOne();

  res.status(200).json({
    success: true,
    message: "Resource deleted successfully",
  });
}); 