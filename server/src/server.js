import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs"; // ✅ Added for file checking
import { connectDB } from "./config/db.js";
import movie from "./routes/movieRoute.js";
import user from "./routes/useRoute.js"; // ✅ Fixed typo

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS Configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
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

// ✅ Serve static files (client build)
const distPath = path.join(__dirname, "../../client/dist");

// Debug logging
console.log("📂 __dirname:", __dirname);
console.log("📂 distPath:", distPath);
console.log("✅ Dist folder exists?", fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log("📄 Files in dist folder:", files);
}

// ✅ Serve static files with proper caching
app.use(express.static(distPath, {
    maxAge: "1d",
    etag: false,
    lastModified: false,
}));

// ✅ SPA Fallback Route - Express 5 compatible
app.get("{/*path}", (req, res) => {
    const indexPath = path.join(distPath, "index.html");

    // Check if index.html exists
    if (!fs.existsSync(indexPath)) {
        console.error("❌ index.html not found at:", indexPath);
        return res.status(404).json({
            success: false,
            error: "index.html not found",
            debug: {
                distPath: distPath,
                indexPath: indexPath,
                distExists: fs.existsSync(distPath),
            },
        });
    }

    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error("❌ Error serving index.html:", err);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    error: "Failed to load application",
                    message: err.message,
                });
            }
        }
    });
});

// ✅ 404 Not Found Handler (before error handler)
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

    // Don't send stack trace in production
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
    // Optionally exit or send alert
    // process.exit(1);
});

// ✅ Handle Uncaught Exceptions
process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
    process.exit(1);
});

// ✅ Start server
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║         🎬 MyShow Backend Server          ║
╠════════════════════════════════════════════╣
║ 🌐 URL: http://localhost:${PORT}            
║ 📂 Dist Path: ${distPath}
║ 🗄️  Database: ${process.env.NODE_ENV === "production" ? "Production" : "Development"}
║ 🔒 CORS: ${process.env.CLIENT_URL || "Open"}
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
