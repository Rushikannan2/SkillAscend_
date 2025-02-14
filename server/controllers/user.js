import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

// Register User
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User already exists",
    });

  const hashPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const otp = Math.floor(Math.random() * 1000000);

  const data = {
    name,
    otp,
  };

  await sendMail(email, "Skill Ascend", data);

  // Temporarily store the OTP in session
  req.session.otp = otp;
  req.session.tempUser = { name, email, password: hashPassword };

  res.status(200).json({
    message: "OTP sent to your mail. Complete verification within 5 minutes.",
  });
});

// Verify User
export const verifyUser = TryCatch(async (req, res) => {
  const { otp } = req.body;

  // Check if OTP is in session
  if (!req.session.otp || req.session.otp !== otp) {
    return res.status(400).json({
      message: "Invalid or expired OTP",
    });
  }

  const userData = req.session.tempUser;

  // Create the user in the database
  await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  // Clear session OTP and temp user data
  req.session.otp = null;
  req.session.tempUser = null;

  res.json({
    message: "User Registered",
  });
});

// Login User
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No user with this email",
    });

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword)
    return res.status(400).json({
      message: "Wrong password",
    });

  // Store user ID and login status in the session
  req.session.userId = user._id;

  res.json({
    message: `Welcome back ${user.name}`,
    user,
  });
});

// Logout User
export const logoutUser = TryCatch(async (req, res) => {
  // Destroy session to log out the user
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Get User Profile
export const myProfile = TryCatch(async (req, res) => {
  // Check if the user is logged in
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await User.findById(req.session.userId);

  res.json({ user });
});
