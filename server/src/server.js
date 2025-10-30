import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import movie from "./routes/movieRoute.js";
import user from "./routes/useRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration for Vercel Frontend
app.use(
    cors({
        origin: "https://my-show-mzhy.vercel.app",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ Parse JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Database Connection with Error Handling
try {
    await connectDB();
    console.log("✅ Database connected successfully");
} catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
}

// ✅ Health Check Endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

// ✅ API routes
app.use("/movies", movie);
app.use("/user", user);

// ✅ 404 Not Found Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
        method: req.method,
    });
});

// ✅ Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error Details:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        query: req.query,
        timestamp: new Date().toISOString(),
    });

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal Server Error";

    const response = {
        success: false,
        message: message,
        ...(process.env.NODE_ENV !== "production" && {
            stack: err.stack,
            path: req.path,
        }),
    };

    res.status(statusCode).json(response);
});

// ✅ Handle Unhandled Promise Rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Promise Rejection at:", promise);
    console.error("❌ Reason:", reason);
});

// ✅ Handle Uncaught Exceptions
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1);
});

// ✅ Start server
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`
╔════════════════════════════════════════════╗
║         🎬 MyShow Backend Server          ║
╠════════════════════════════════════════════╣
║ 🌐 URL: http://0.0.0.0:${PORT}            
║ 🗄️  Database: ${process.env.NODE_ENV === "production" ? "Production" : "Development"}
║ 🔒 CORS: https://my-show-mzhy.vercel.app
║ 📡 Health Check: /health                  ║
║ 🎞️  API Routes: /movies, /user            ║
╚════════════════════════════════════════════╝
    `);
});

// ✅ Graceful Shutdown
process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received, shutting down gracefully...");
    server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
    });
});

process.on("SIGINT", () => {
    console.log("🛑 SIGINT received, shutting down gracefully...");
    server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
    });
});

export default app;
