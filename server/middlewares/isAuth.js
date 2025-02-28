import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(403).json({
        message: "Please Login",
      });
    }

    req.user = await User.findById(req.session.user.id);

    if (!req.user) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
    res.status(500).json({
      message: error.message || "Login First",
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not admin",
      });
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
