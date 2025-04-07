import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "../main.jsx";

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

// Initialize IndexedDB
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CourseDB", 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("videos")) {
        db.createObjectStore("videos", { keyPath: "id" });
      }
    };
  });
};

// Store video in IndexedDB
const storeVideo = async (id, videoData) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["videos"], "readwrite");
    const store = transaction.objectStore("videos");
    const request = store.put({ id, data: videoData });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// Get video from IndexedDB
const getVideo = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["videos"], "readonly");
    const store = transaction.objectStore("videos");
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result?.data);
    request.onerror = () => reject(request.error);
  });
};

// Export both CourseContextProvider and CourseData for backward compatibility
export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState(() => {
    try {
      const savedCourses = localStorage.getItem("courses");
      return savedCourses ? JSON.parse(savedCourses) : [];
    } catch (error) {
      console.error("Error loading courses from localStorage:", error);
      return [];
    }
  });
  const [course, setCourse] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Save courses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("courses", JSON.stringify(courses));
    } catch (error) {
      console.error("Error saving courses to localStorage:", error);
      if (error.name === "QuotaExceededError") {
        toast.error("Storage limit exceeded. Some data may not be saved.");
      }
    }
  }, [courses]);

  useEffect(() => {
    // Fetch courses from local storage on mount
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to fetch courses");
      setLoading(false);
    }
  };

  const fetchCourse = async (id) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const foundCourse = courses.find(c => c._id === id);
      setCourse(foundCourse || null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to fetch course");
      setLoading(false);
    }
  };

  const fetchMyCourse = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching my courses:", error);
      toast.error("Failed to fetch your courses");
      setLoading(false);
    }
  };

  const addCourse = async (courseData) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCourse = {
        _id: Date.now().toString(),
        ...courseData,
        price: 0, // Set price to 0 for free access
        lectures: [],
        createdAt: new Date().toISOString()
      };

      setCourses(prevCourses => [...prevCourses, newCourse]);
      toast.success("Course added successfully");
      setLoading(false);
      return newCourse;
    } catch (error) {
      console.error("Error adding course:", error);
      toast.error("Failed to add course");
      setLoading(false);
      throw error;
    }
  };

  const addLecture = async (courseId, lectureData) => {
    setLoading(true);
    try {
      // Create a new lecture with a unique ID
      const newLecture = {
        _id: Date.now().toString(),
        title: lectureData.title,
        description: lectureData.description,
        notes: "",
        resources: "",
        quiz: null, // Initialize quiz as null instead of an empty object
        createdAt: new Date().toISOString()
      };
      
      // Store video in IndexedDB if present
      if (lectureData.video) {
        try {
          await storeVideo(newLecture._id, lectureData.video);
          newLecture.hasVideo = true;
        } catch (error) {
          console.error("Error storing video:", error);
          toast.error("Failed to store video. Please try again.");
          setLoading(false);
          throw error;
        }
      }

      // Update courses with the new lecture
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course._id === courseId
            ? { ...course, lectures: [...(course.lectures || []), newLecture] }
            : course
        )
      );

      // Update current course if it's the one being modified
      if (course && course._id === courseId) {
        setCourse(prevCourse => ({
          ...prevCourse,
          lectures: [...(prevCourse.lectures || []), newLecture]
        }));
      }

      toast.success("Lecture added successfully");
      setLoading(false);
      return newLecture;
    } catch (error) {
      console.error("Error adding lecture:", error);
      toast.error("Failed to add lecture");
      setLoading(false);
      throw error;
    }
  };

  const getVideoData = async (lecture) => {
    if (lecture && lecture.hasVideo) {
      try {
        return await getVideo(lecture._id);
      } catch (error) {
        console.error("Error retrieving video:", error);
        return null;
      }
    }
    return null;
  };

  const updateLectureContent = async (courseId, lectureId, contentType, content) => {
    setLoading(true);
    try {
      // Find the course
      const courseToUpdate = courses.find(c => c._id === courseId);
      if (!courseToUpdate) {
        throw new Error("Course not found");
      }
      
      // Find the lecture
      const lectureIndex = courseToUpdate.lectures.findIndex(l => l._id === lectureId);
      if (lectureIndex === -1) {
        throw new Error("Lecture not found");
      }
      
      // Create updated lecture
      const updatedLecture = {
        ...courseToUpdate.lectures[lectureIndex],
        [contentType]: content
      };
      
      // Create updated course
      const updatedLectures = [...courseToUpdate.lectures];
      updatedLectures[lectureIndex] = updatedLecture;
      
      const updatedCourse = {
        ...courseToUpdate,
        lectures: updatedLectures
      };
      
      // Update courses in state
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c._id === courseId ? updatedCourse : c
        )
      );
      
      // Update current course if it's the one being modified
      if (course && course._id === courseId) {
        setCourse(updatedCourse);
      }
      
      // Save to localStorage
      try {
        const coursesFromStorage = JSON.parse(localStorage.getItem("courses") || "[]");
        const updatedCoursesForStorage = coursesFromStorage.map(c => 
          c._id === courseId ? updatedCourse : c
        );
        localStorage.setItem("courses", JSON.stringify(updatedCoursesForStorage));
        console.log(`Updated ${contentType} for lecture ${lectureId} in course ${courseId}`);
        console.log(`New ${contentType} value:`, content);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        if (error.name === "QuotaExceededError") {
          toast.error("Storage limit exceeded. Some data may not be saved.");
        }
      }
      
      toast.success(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} updated successfully`);
      setLoading(false);
      return updatedLecture;
    } catch (error) {
      console.error(`Error updating ${contentType}:`, error);
      toast.error(`Failed to update ${contentType}`);
      setLoading(false);
      throw error;
    }
  };

  const deleteCourse = async (courseId) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${server}/api/admin/course/${courseId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (data.success) {
        // Remove the course from local state
        setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
        
        // If the deleted course is the current course, clear it
        if (course && course._id === courseId) {
          setCourse(null);
        }
        
        toast.success(data.message || "Course deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      if (error.response?.status === 404) {
        toast.error("Course not found");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete course");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteLecture = async (courseId, lectureId) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`${server}/api/admin/lecture/${lectureId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (data.success) {
        // Update the course's lectures in local state
        setCourses(prevCourses => 
          prevCourses.map(course => {
            if (course._id === courseId) {
              return {
                ...course,
                lectures: course.lectures.filter(lecture => lecture._id !== lectureId)
              };
            }
            return course;
          })
        );

        // If the deleted lecture is from the current course, update it
        if (course && course._id === courseId) {
          setCourse(prevCourse => ({
            ...prevCourse,
            lectures: prevCourse.lectures.filter(lecture => lecture._id !== lectureId)
          }));
        }

        toast.success("Lecture deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete lecture");
      }
    } catch (error) {
      console.error("Error deleting lecture:", error);
      toast.error(error.response?.data?.message || "Failed to delete lecture");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    courses,
    course,
    myCourses,
    loading,
    fetchCourses,
    fetchCourse,
    fetchMyCourse,
    addCourse,
    addLecture,
    updateLectureContent,
    getVideoData,
    deleteCourse,
    deleteLecture
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// Alias CourseData to CourseContextProvider for backward compatibility
export const CourseData = CourseContextProvider;

export default CourseContextProvider;