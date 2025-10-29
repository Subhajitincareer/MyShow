import { z } from "zod";

// Enum must match your Prisma schema exactly
const MovieTypeEnum = z.enum(["Movie", "TvShow"]);

export const movieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.enum(["Movie", "TvShow"]),
    director: z.string().min(1, "Director is required"),
    budget: z.coerce.number().positive("Budget must be a positive number"),
    location: z.string().min(1, "Location is required"),
    duration: z.string().min(1, "Duration is required"),
    year: z.coerce.number().int().min(1880, "Year must be valid"),
});
