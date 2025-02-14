import React from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import axios from "axios";
import { server } from "../../main";
import { useUser } from "../../hooks/useUser";

const Header = ({ isAuth }) => {
  const { setIsAuth, setUser } = UserData();
  const user = useUser();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/api/user/logout`, { withCredentials: true }); // Ends session
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header>
      <div className="logo">Skill Ascend</div>

      <div className="link">
        <Link to={"/"}>Home</Link>
        <Link to={"/courses"}>Courses</Link>
        <Link to={"/about"}>About</Link>
        {user ? (
          <>
            <Link to={"/account"}>Account</Link>
            <a href="/logout">Logout</a>
          </>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </header>
  );
};

export default Header;
