import React, { useEffect } from "react";
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import { server } from "../../main.jsx";

const CourseStudy = ({ user }) => {
  const params = useParams();

  const { fetchCourse, course } = useCourse();
  const navigate = useNavigate();

  // Removed subscription check to allow free access to all courses
  // if (user && user.role !== "admin" && !user.subscription.includes(params.id))
  //   return navigate("/");

  useEffect(() => {
    fetchCourse(params.id);
  }, []);
  return (
    <>
      {course && (
        <div className="course-study-page">
          <img src={`${server}/${course.image}`} alt="" width={350} />
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          <h5>by - {course.instructor || course.createdBy}</h5>
          <h5>Duration - {course.duration}</h5>
          <Link to={`/lectures/${course._id}`}>
            <h2>Lectures</h2>
          </Link>
        </div>
      )}
    </>
  );
};

export default CourseStudy;