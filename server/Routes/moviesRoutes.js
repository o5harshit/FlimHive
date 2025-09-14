import express from "express"
import { addMovie,deleteMovies,getallMovies, getMovieById, updateMovie } from "../Controller/moviesControllers.js";



const MoviesRoutes = express.Router();


MoviesRoutes.post("/AddMovies",addMovie);
MoviesRoutes.get("/GetallMovies",getallMovies);
MoviesRoutes.patch("/DeleteMovies/:id",deleteMovies);
MoviesRoutes.patch("/UpdateMovies/:id",updateMovie);
MoviesRoutes.get("/getMovies/:id",getMovieById);




export default MoviesRoutes;