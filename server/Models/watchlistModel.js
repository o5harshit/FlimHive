import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true 
  },
  movies: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movies",
        required: true
      },
      dateAdded: {
        type: Date,
        default: Date.now
      }
    }
  ]
},{timestamps : true});

const WatchlistModel = mongoose.model("Watchlist", watchlistSchema);

export default WatchlistModel;
