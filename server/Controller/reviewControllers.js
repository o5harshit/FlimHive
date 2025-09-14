import MoviesModel from "../Models/moviesModel.js";
import ReviewModel from "../Models/reviewModel.js";
import UserModel from "../Models/UserModel.js";


export const addReview = async (req, res) => {
  try {
    const { id } = req.params; // movieId
    const { userId, text, rating } = req.body;

    console.log(req.body);

    // Validate inputs
    if (!id) {
      return res.status(400).json({ success: false, message: "Movie id is required" });
    }
    if (!userId) {
      return res.status(400).json({ success: false, message: "User id is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    // Check if movie exists
    const movie = await MoviesModel.findById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create new review
    const newReview = new ReviewModel({
      userId,
      moviesId: id,
      rating,
      reviewText: text,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const GetReview = async (req, res) => {
  try {
    const { id } = req.params; // this should be movieId
    if (!id) {
      return res.status(400).json({ success: false, message: "Movie id is required" });
    }

    const reviews = await ReviewModel.find({ moviesId: id })
      .populate("userId", "name email") // only select needed fields
      .lean();

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ success: false, message: "No reviews found for this movie" });
    }

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (err) {
    console.error("Error while fetching reviews:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
