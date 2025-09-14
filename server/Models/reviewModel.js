import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    moviesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    reviewText: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("Reviews",reviewSchema);

export default ReviewModel;
