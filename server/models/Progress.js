import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastPosition: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Compound index to ensure one progress record per user per lecture
progressSchema.index({ user: 1, lecture: 1 }, { unique: true });

export const Progress = mongoose.model("Progress", progressSchema); 