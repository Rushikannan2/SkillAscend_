import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import axios from "axios"; // Import axios for API requests

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, setBtnLoading, setUser } = UserData(); // Added setUser to store session user
  const { fetchMyCourse } = CourseData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Form submission handler
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        { withCredentials: true } // Ensure cookies (session) are sent
      );

      setUser(data.user); // Store user session info
      await fetchMyCourse();
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="auth-page animated-page">
      <div className="auth-form animated-form">
        <h2>Login</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor="email" className="animated-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="animated-input"
          />

          <label htmlFor="password" className="animated-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="animated-input"
          />

          <button
            disabled={btnLoading}
            type="submit"
            className={`common-btn animated-btn ${btnLoading ? "loading" : ""}`}
          >
            {btnLoading ? "Please Wait..." : "Login"}
          </button>
        </form>
        <p className="animated-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p className="animated-text">
          <Link to="/forgot">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
