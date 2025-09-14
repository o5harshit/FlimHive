import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique : true
  },
  genre: {
    type: [String],
    required: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  cast: {
    type: [String],
    required: true,
  },
  synopsis: {
    type: String,
     required : true
  },
  poster: {
    type: String,
    required : true
  },
  isActive : {
    type : Boolean,
    default : true
  },
  isdeleted : {
    type : Boolean,
    default : false
  },
  averageRating: { type: Number, default: 0 },
},{timestamps : true});

const MoviesModel = mongoose.model("Movies", moviesSchema);

export default MoviesModel;
