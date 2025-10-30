import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // ✅ CORS import
import { connectDB } from "./config/db.js";
import movie from "./routes/movieRoute.js";
import user from "./routes/useRoute.js"; // ✅ Typo fix

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 ES module compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS Configuration
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*", // Production এ specific origin দাও
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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
    process.exit(1); // Exit if DB connection fails
}

// ✅ Health Check Endpoint (for Render monitoring)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

// ✅ API routes
app.use("/movies", movie);
app.use("/user", user); // Changed from /use to /user

// ✅ Serve static files (client build)
const distPath = path.join(__dirname, "../../client/dist");
app.use(express.static(distPath));

// ✅ SPA Fallback Route - Must be AFTER API routes
app.get("{/*path}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
});

// ✅ Handle Unhandled Promise Rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    // Close server & exit process (optional)
    process.exit(1);
});

// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
