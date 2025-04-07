import React, { useEffect } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUser } = UserData();
  const { fetchCourse, course, loading } = useCourse();

  useEffect(() => {
    fetchCourse(id);
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h1>{course.title}</h1>
                  <p>{course.description}</p>
                  <p>This course is completely free!</p>
                  <button
                    onClick={() => navigate(`/course/study/${course._id}`)}
                    className="common-btn"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;