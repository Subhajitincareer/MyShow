import { Router } from "express";
import { createMovie } from "../controllers/movieController.js";
import { getMovies } from "../controllers/movieController.js";
import { updateMovie } from "../controllers/movieController.js";
import { deleteMovie } from "../controllers/movieController.js";
const router = Router();

router.post("/create", createMovie);
router.get("/all", getMovies)
router.put("/update/:id", updateMovie);
router.delete("/delete/:id", deleteMovie);

export default router;