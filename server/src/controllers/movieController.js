import prisma from "../config/db.js";
import { movieSchema } from "../validators/movieValidator.js";

// ✅ CREATE MOVIE
export const createMovie = async (req, res) => {
    try {
        // Validate request body
        const validatedData = movieSchema.parse(req.body);

        const newMovie = await prisma.movie.create({ data: validatedData });

        res.status(201).json({
            message: "Movie successfully inserted ✅",
            movie: newMovie,
        });
    } catch (error) {
        console.error("Error inserting movie:", error);
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation failed ❌",
                errors: error.errors,
            });
        }
        res.status(500).json({
            message: "Failed to insert movie ❌",
            error: error.message,
        });
    }
};

// ✅ GET MOVIES (Pagination)
export const getMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [movieData, totalMovies] = await Promise.all([
            prisma.movie.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.movie.count(),
        ]);

        res.status(200).json({
            message: "Movies fetched successfully ✅",
            currentPage: page,
            totalMovies,
            totalPages: Math.ceil(totalMovies / limit),
            data: movieData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch movies ❌",
            error: error.message,
        });
    }
};

// ✅ UPDATE MOVIE
export const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate updated data
        const validatedData = movieSchema.partial().parse(req.body);

        const updatedMovie = await prisma.movie.update({
            where: { id: parseInt(id) },
            data: validatedData,
        });

        res.status(200).json({
            message: "Movie successfully updated ✅",
            movie: updatedMovie,
        });
    } catch (error) {
        if (error.name === "ZodError") {
            return res.status(400).json({
                message: "Validation failed ❌",
                errors: error.errors,
            });
        }
        res.status(500).json({
            message: "Failed to update movie ❌",
            error: error.message,
        });
    }
};

// ✅ DELETE MOVIE
export const deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.movie.delete({ where: { id: parseInt(id) } });
        res.status(200).json({
            message: "Movie successfully deleted ✅",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete movie ❌",
            error: error.message,
        });
    }
};
