import React from "react";
import "./dashbord.css";
import { useCourse } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Dashbord = () => {
  const { mycourse } = useCourse();
  
  return (
    <div className="student-dashboard">
      <h2 className="dashboard-title">📚 Your Enrolled Courses</h2>
      <div className="dashboard-content">
        {mycourse && mycourse.length > 0 ? (
          mycourse.map((e) => <CourseCard key={e._id} course={e} />)
        ) : (
          <p className="no-course">No courses enrolled yet. Start learning today! 🚀</p>
        )}
      </div>
    </div>
  );
};

export default Dashbord;