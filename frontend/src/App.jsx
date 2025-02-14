import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import Footer from "./components/footer/Footer";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import { UserData } from "./context/UserContext";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/coursedescription/CourseDescription";
import Dashbord from "./pages/dashbord/Dashbord";
import CourseStudy from "./pages/coursestudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashbord from "./admin/Dashboard/AdminDashbord";
import AdminCourses from "./admin/Courses/AdminCourses";
import AdminUsers from "./admin/Users/AdminUsers";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Import the GamifiedCursor component
import GamifiedCursor from "./components/GamifiedCursor/GamifiedCursor";

// Private Route component to handle authenticated routes
const PrivateRoute = ({ element, isAuth }) => {
  return isAuth ? element : <Login />;
};

const App = () => {
  const { isAuth, user, loading, fetchUserData, error } = UserData(); // Assuming `UserData` provides the `fetchUserData` function
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Fetch user data on initial load
    const fetchData = async () => {
      try {
        await fetchUserData(); // Ensure this function is properly defined in your context
      } catch (err) {
        console.error("Error fetching user data", err); // Log any error if the fetch fails
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [fetchUserData]);

  // If the user data is still being fetched or app is loading, show the loading spinner
  if (loading || initialLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      {/* Add the custom cursor */}
      <GamifiedCursor />

      <Header isAuth={isAuth} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />

        {/* Authenticated Routes */}
        <Route
          path="/account"
          element={<PrivateRoute element={<Account user={user} />} isAuth={isAuth} />}
        />
        <Route
          path="/course/:id"
          element={<PrivateRoute element={<CourseDescription user={user} />} isAuth={isAuth} />}
        />
        <Route
          path="/:id/dashboard"
          element={<PrivateRoute element={<Dashbord user={user} />} isAuth={isAuth} />}
        />
        <Route
          path="/course/study/:id"
          element={<PrivateRoute element={<CourseStudy user={user} />} isAuth={isAuth} />}
        />
        <Route
          path="/lectures/:id"
          element={<PrivateRoute element={<Lecture user={user} />} isAuth={isAuth} />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<PrivateRoute element={<AdminDashbord user={user} />} isAuth={isAuth} />}
        />
        <Route
          path="/admin/course"
          element={<PrivateRoute element={<AdminCourses user={user} />} isAuth={isAuth} />}
        />
        <Route
          path="/admin/users"
          element={<PrivateRoute element={<AdminUsers user={user} />} isAuth={isAuth} />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
