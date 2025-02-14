import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import MongoStore from "connect-mongo"; // Store sessions in MongoDB
import { connectDb } from "./database/db.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { auth } from "express-openid-connect";
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// Load environment variables
dotenv.config();

// __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware Setup
app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:5000',
  clientID: 'Srx4FF0G86lWKIIBXdIJcpjGlnKQcunh',
  issuerBaseURL: 'https://dev-qr5qwfbt6tsbx26u.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// CORS Configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "https://skillascend.com" : "http://localhost:5000", // Allow frontend to access backend (adjust as needed)
    credentials: true, // Allow cookies (for sessions)
  })
);

const port = process.env.PORT || 5000;

// Serving Static Files (e.g., images, documents)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// Route Middleware
app.use("/api/user", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist"); // Serving the built frontend for production
  app.use(express.static(frontendPath));

  // Catch-all route for serving the index.html in production
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// Fallback Route for Unmatched URLs (handles invalid routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

// Start the Server
app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connectDb(); // Ensure DB is connected
});
