import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./src/db/connect.js";
import cookieParser from "cookie-parser";
import errorHandler from "./src/helpers/errorhandler.js";
import userRoutes from "./src/routes/userRoutes.js";
import snippetsRoutes from "./src/routes/snippetsRoutes.js";
import tagsRoutes from "./src/routes/tagsRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:3000",
      "https://your-app-name.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// error handler middleware
app.use(errorHandler);

// Connect to database
connect();

// routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", snippetsRoutes);
app.use("/api/v1", tagsRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Export for Vercel
export default app;
