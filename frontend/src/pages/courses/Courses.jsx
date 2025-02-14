import React, { useState, useEffect } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Courses = () => {
  const { courses } = CourseData(); // Fetch courses from the context
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredCourses, setFilteredCourses] = useState(courses); // Initial state of filtered courses

  useEffect(() => {
    if (courses && courses.length > 0) {
      setFilteredCourses(courses); // Initially load all courses
    }
  }, [courses]);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter courses based on the search query
    if (query.trim() === "") {
      setFilteredCourses(courses); // Show all courses when search is empty
    } else {
      const filtered = courses.filter((course) =>
        course.name.toLowerCase().includes(query.toLowerCase()) // Case-insensitive search
      );
      setFilteredCourses(filtered); // Update filtered courses state
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const query = searchQuery.trim();
      if (query) {
        const filtered = courses.filter((course) =>
          course.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses(courses); // Show all courses if no search query
      }
    }
  };

  return (
    <div className="courses">
      <h2 className="title">Available Courses</h2>

      {/* Search bar with animation */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Courses..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyPress}
          className="search-input"
        />
      </div>

      <div className="course-container">
        {/* Display filtered courses or a no-courses message */}
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          <p className="no-courses">No Courses Found!</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
