import MoviesModel from "../Models/moviesModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const addMovie = async (req, res) => {
  try {
    const { title, releaseYear, synopsis, genre, cast } = req.body;
    console.log(req.body);
    if (!title || !releaseYear || !genre || !cast) {
      console.log("Hii");
      return res
        .status(400)
        .json({ message: "All required fields are needed" });
    }
    const file = req.files.poster;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
      const movie = await MoviesModel.create({
        title,
        releaseYear,
        synopsis,
        genre: genre,
        cast: cast,
        poster: result.url,
      });
      console.log(movie);
      res.status(201).json({ message: "Movie added successfully", movie });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getallMovies = async (req, res) => {
  try {
    const Movies = await MoviesModel.find({ isActive: true, isdeleted: false });
    res.status(201).json({ Movies });
  } catch (err) {
    res.status(500).json({ message: "Something went Wrong" });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const movie = await MoviesModel.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully", movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteMovies = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const movie = await MoviesModel.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Approach 1: Modify + save
    movie.isActive = false;
    movie.isdeleted = true;
    await movie.save();

    res.status(200).json({ message: "Movie deleted successfully", movie });
  } catch (err) {
    console.error("Delete movie error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Movie id is required" });
    }

    // Find movie
    const movie = await MoviesModel.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Collect fields from request body
    const { title, genre, releaseYear, cast, synopsis } = req.body;

    // Update only provided fields
    if (title) movie.title = title;
    if (genre) movie.genre = Array.isArray(genre) ? genre : [genre];
    if (releaseYear) movie.releaseYear = releaseYear;
    if (cast) movie.cast = Array.isArray(cast) ? cast : [cast];
    if (synopsis) movie.synopsis = synopsis;

    if (req.files?.poster) {
      const file = req.files.poster;

      // Use await here
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      movie.poster = result.url;
    }

    await movie.save();

    res.status(200).json({ message: "Movie updated successfully", movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
