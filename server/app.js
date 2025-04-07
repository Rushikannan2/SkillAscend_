import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import ErrorMiddleware from "./middlewares/Error.js";
import progressRouter from "./routes/progress.js";
import resourceRouter from "./routes/resourceRoutes.js";
import noteRouter from "./routes/noteRoutes.js";
import quizRouter from "./routes/quizRoutes.js";
import lectureRouter from "./routes/lectureRoutes.js";

config({
  path: "./config/config.env",
});

const app = express();

// Using Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb"
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    maxAge: 3600,
  })
);

// Increase timeout for video uploads
app.use((req, res, next) => {
  res.setTimeout(600000); // 10 minutes
  next();
});

// Using Routes
app.use("/api/progress", progressRouter);
app.use("/api/v1", resourceRouter);
app.use("/api/v1", noteRouter);
app.use("/api/v1", quizRouter);
app.use("/api/v1", lectureRouter);

app.get("/", (req, res) =>
  res.send(
    `<h1>Site is Working. Click <a href=${process.env.FRONTEND_URL}>here</a> to visit frontend.</h1>`
  )
);

export default app;

// Using Error Middleware
app.use(ErrorMiddleware); 