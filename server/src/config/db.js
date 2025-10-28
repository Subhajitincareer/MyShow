// server/config/db.js
// ESM-এ file extension দিতে হয় (কিছু case-এ)
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

/**
 * 🔗 Connect to the database using Prisma
 */
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1); // Stop the server if DB connection fails
    }
};

export default prisma;
