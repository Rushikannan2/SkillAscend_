import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";


export const createCourse = TryCatch(async (req, res) => {
    try {
        const { title, description, category, createdBy, duration, price } = req.body;

        if (!title || !description || !category || !createdBy || !duration || !price) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const image = req.file;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Please provide a course image"
            });
        }

        // Validate image file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (image.size > maxSize) {
            // Remove the uploaded file
            fs.unlinkSync(image.path);
            return res.status(400).json({
                success: false,
                message: "Image file size must be less than 5MB"
            });
        }

        const course = await Courses.create({
            title,
            description,
            category,
            createdBy,
            image: image.path,
            duration: Number(duration),
            price: Number(price),
        });

        res.status(201).json({
            success: true,
            message: "Course Created Successfully",
            course
        });
    } catch (error) {
        // If there's an error and a file was uploaded, remove it
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: "Error creating course",
            error: error.message
        });
    }
});


export const addLectures = TryCatch(async (req, res) => {
  try {
    const course = await Courses.findById(req.params.id);
  
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No Course with this id",
      });
    }
  
    const { title, description } = req.body;
  
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide both title and description",
      });
    }
  
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a video file",
      });
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      // Remove the uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: "Video file size must be less than 100MB",
      });
    }
  
    const lecture = await Lecture.create({
      title,
      description,
      video: file.path,
      course: course._id,
    });
  
    res.status(201).json({
      success: true,
      message: "Lecture Added Successfully",
      lecture,
    });
  } catch (error) {
    // If there's an error and a file was uploaded, remove it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: "Error adding lecture",
      error: error.message,
    });
  }
});

export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found"
        });
    }

    if (lecture.video) {
        rm(lecture.video, (err) => {
            if (err) {
                console.log("Error deleting video file:", err);
            } else {
                console.log("Video deleted successfully");
            }
        });
    }

    await lecture.deleteOne();

    res.json({ 
        success: true,
        message: "Lecture Deleted Successfully" 
    });
});

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found"
        });
    }

    try {
        // Delete associated lectures and their videos
        const lectures = await Lecture.find({ course: course._id });
        
        for (const lecture of lectures) {
            if (lecture.video) {
                try {
                    await unlinkAsync(lecture.video);
                    console.log(`Video deleted for lecture: ${lecture._id}`);
                } catch (err) {
                    console.log(`Error deleting video for lecture ${lecture._id}:`, err);
                    // Continue with deletion even if video file is missing
                }
            }
        }

        // Delete course image if it exists
        if (course.image) {
            try {
                await unlinkAsync(course.image);
                console.log("Course image deleted");
            } catch (err) {
                console.log("Error deleting course image:", err);
                // Continue with deletion even if image file is missing
            }
        }

        // Delete all lectures associated with the course
        await Lecture.deleteMany({ course: course._id });

        // Delete the course itself
        await course.deleteOne();

        // Remove course from all users' subscriptions
        await User.updateMany(
            { subscription: course._id }, 
            { $pull: { subscription: course._id } }
        );

        return res.status(200).json({
            success: true,
            message: "Course and associated content deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteCourse:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting course",
            error: error.message
        });
    }
});


export const getAllStats = TryCatch(async (req, res) => {
    try {
        // Use countDocuments() instead of find().length for better performance
        const [totalCourses, totalLectures, totalUsers] = await Promise.all([
            Courses.countDocuments({}),
            Lecture.countDocuments({}),
            User.countDocuments({})
        ]);

        const stats = {
            totalCourses,
            totalLectures,
            totalUsers,
        };

        res.status(200).json({
            success: true,
            stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching statistics",
            error: error.message
        });
    }
});

export const cleanupDatabase = TryCatch(async (req, res) => {
    try {
        // Delete all courses
        await Courses.deleteMany({});
        
        // Delete all lectures
        await Lecture.deleteMany({});
        
        // Remove course subscriptions from all users
        await User.updateMany({}, { $set: { subscription: [] } });

        res.status(200).json({
            success: true,
            message: "Database cleaned up successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error cleaning up database",
            error: error.message
        });
    }
});

export const getAllUsers = TryCatch(async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            users,
            message: "Users fetched successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
});

