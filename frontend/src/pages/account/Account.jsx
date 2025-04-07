import React from "react";
import { MdDashboard } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./account.css";

import { UserData } from "../../context/UserContext";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <div className="profile">
      {user && (
        <div className="profile-card">
          <h2 className="profile-title">👤 My Profile</h2>

          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <div className="btn-group">
              <button
                onClick={() => navigate(`/${user._id}/dashboard`)}
                className="profile-btn"
              >
                <MdDashboard />
                Dashboard
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() => navigate(`/admin/dashboard`)}
                  className="profile-btn admin"
                >
                  <MdDashboard />
                  Admin Dashboard
                </button>
              )}

              <button
                onClick={logoutHandler}
                className="profile-btn logout"
              >
                <IoMdLogOut />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
