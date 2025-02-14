import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Register = () => {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Form submission handler
  const submitHandler = async (e) => {
    e.preventDefault();
    
    const success = await registerUser(name, email, password);
    if (success) {
      navigate("/login"); // Redirect to login after successful registration
    }
  };

  return (
    <div className="auth-page animated-page">
      <div className="auth-form animated-form">
        <h2>Register</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor="name" className="animated-label">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="animated-input"
          />

          <label htmlFor="email" className="animated-label">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="animated-input"
          />

          <label htmlFor="password" className="animated-label">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="animated-input"
          />

          <button
            type="submit"
            disabled={btnLoading}
            className={`common-btn animated-btn ${btnLoading ? "loading" : ""}`}
          >
            {btnLoading ? "Please Wait..." : "Register"}
          </button>
        </form>
        <p className="animated-text">
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
