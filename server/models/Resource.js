import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  lecture: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lecture",
    required: true,
  },
  type: {
    type: String,
    enum: ["pdf", "doc", "ppt", "other"],
    default: "other"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Resource = mongoose.model("Resource", resourceSchema); 