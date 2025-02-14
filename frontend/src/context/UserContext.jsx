import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchMyCourse();
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      toast.success(data.message);
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, { otp });

      toast.success(data.message);
      navigate("/login");
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        withCredentials: true,
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.error("Fetch user error:", error);
      setIsAuth(false);
      setUser(null);
      setLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      await axios.post(`${server}/api/user/logout`, {}, { withCredentials: true });

      toast.success("Logged out successfully");
      setUser(null);
      setIsAuth(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  }

  useEffect(() => {
    fetchUser();
    
    return () => {
      // Cleanup if needed (e.g., canceling pending requests, etc.)
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        btnLoading,
        loading,
        registerUser,
        verifyOtp,
        fetchUser,
        logoutUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
