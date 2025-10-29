import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import movie from "./routes/movieRoute.js";
import user from "./routes/useRoute.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 ES module compatible __dirname তৈরি
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ✅ Parse JSON
app.use(express.json());
connectDB()
// ✅ Serve client dist files
const distPath = path.join(__dirname, "../../client/dist");
app.use(express.static(distPath));

// ✅ API routes (example)
app.use("/movies", movie);
app.use("/use", user)

// ✅ Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
