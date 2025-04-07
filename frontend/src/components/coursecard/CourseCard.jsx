import React from "react";
import "./courseCard.css";
import { server } from "../../main.jsx";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useCourse } from "../../context/CourseContext";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  const { fetchCourses, deleteCourse } = useCourse();

  const deleteHandler = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await deleteCourse(courseId);
    }
  };

  return (
    <div className="course-card">
      <img src={course.image.startsWith('data:') ? course.image : `${server}/${course.image}`} alt="" className="course-image" />
      <h3>{course.title}</h3>
      <p>Instructor- {course.instructor || course.createdBy}</p>
      <p>Duration- {course.duration}</p>
      <p>Price- Free</p>
      {isAuth ? (
        <>
          {user && user.role !== "admin" ? (
            <>
              <button
                onClick={() => navigate(`/course/study/${course._id}`)}
                className="common-btn"
              >
                Start Learning
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          )}
        </>
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Get Started
        </button>
      )}

      <br />

      {user && user.role === "admin" && (
        <button
          onClick={() => deleteHandler(course._id)}
          className="common-btn"
          style={{ background: "red" }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default CourseCard;