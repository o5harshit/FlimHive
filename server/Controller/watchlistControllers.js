import WatchlistModel from "../Models/watchlistModel.js";



export const addToWatchlist = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "MovieId is required" });
    }

    let watchlist = await WatchlistModel.findOne({ userId });

    if (!watchlist) {
      watchlist = new WatchlistModel({ userId, movies: [] });
    }


    watchlist.movies.push({ movieId });
    await watchlist.save();

    return res.status(201).json({
      success: true,
      message: "Movie added to watchlist",
      watchlist,
    });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ➤ Remove movie from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ message: "MovieId is required" });
    }

    let watchlist = await WatchlistModel.findOne({ userId });

    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    const movieIndex = watchlist.movies.findIndex(
      (m) => m.movieId.toString() === movieId
    );

    if (movieIndex === -1) {
      return res
        .status(404)
        .json({ message: "Movie not found in watchlist" });
    }

    watchlist.movies.splice(movieIndex, 1); // remove movie
    await watchlist.save();

    return res.status(200).json({
      success: true,
      message: "Movie removed from watchlist",
      watchlist,
    });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export  const getWatchlist = async (req, res) => {
  try {
    const userId = req.userId;

    const watchlist = await WatchlistModel.findOne({ userId }).populate(
      "movies.movieId",
      "title poster releaseYear"
    );

    if (!watchlist) {
      return res.status(200).json({ success: true, movies: [] });
    }

    return res.status(200).json({
      success: true,
      movies: watchlist.movies,
    });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
