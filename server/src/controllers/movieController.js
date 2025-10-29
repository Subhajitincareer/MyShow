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





export const getMovies = async (req, res) => { };

export const updateMovie = async (req, res) => { };

export const deleteMovie = async (req, res) => { };
