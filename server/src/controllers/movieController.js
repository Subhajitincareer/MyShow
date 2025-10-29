import prisma from "../config/db.js";

export const createMovie = async (req, res) => {
    try {
        const { title, type, director, budget, location, duration, year } = req.body;

        const newMovie = await prisma.movie.create({
            data: {
                title,
                type,
                director,
                budget: parseFloat(budget), // ensure number type
                location,
                duration,
                year: parseInt(year) // ensure integer type
            }
        });

        res.status(201).json({
            message: "Movie successfully inserted ✅",
        });

    } catch (error) {
        console.error("Error inserting movie:", error);
        res.status(500).json({
            message: "Failed to insert movie ❌",
            error: error.message
        });
    }
};





export const getMovies = async (req, res) => {
    try {
        // Get pagination parameters from query (default: page 1, limit 10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate how many records to skip
        const skip = (page - 1) * limit;

        // Fetch data
        const movieData = await prisma.movie.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: "desc" } // optional: latest first
        });

        // Count total movies (for frontend pagination UI)
        const totalMovies = await prisma.movie.count();

        res.status(200).json({
            message: "Movies fetched successfully ✅",
            currentPage: page,
            totalMovies,
            totalPages: Math.ceil(totalMovies / limit),
            data: movieData
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch movies ❌",
            error: error.message
        });
    }
};
export const updateMovie = async (req, res) => {

    try {
        const { id } = req.params;
        const { title, type, director, budget, location, duration, year } = req.body;
        await prisma.movie.update({
            where: { id: parseInt(id) },
            data: {
                title, type, director, budget, location, duration, year
            }
        })
        res.status(200).json({
            message: "Movie successfully updated ✅",
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to update movie ❌",
            error: error.message
        });
    }
};

export const deleteMovie = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.movie.delete({
            where: { id: parseInt(id) }
        });
        res.status(200).json({
            message: "Movie successfully deleted ✅",
        })
    } catch (error) {
        error.status(500).json({
            message: "Failed to delete movie ❌",
            error: error.message
        });
    }
};
