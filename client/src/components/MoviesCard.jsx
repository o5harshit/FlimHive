// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart as HeartOutline, Heart as HeartSolid } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_MOVIES_WATCHLIST, WATCHLIST_ROUTES } from "@/utils/constants";

const MovieCard = ({ movie }) => {
  const [wishlist, setWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const toggleWishlist = async () => {
    if (!userInfo) {
      toast.error("Please login to add movies to your wishlist");
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
       await apiClient.post(`${ADD_MOVIES_WATCHLIST}`, {
        movieId: movie._id,
      },{withCredentials : true});
      setWishlist(true); 
      toast.success(`${movie.title} added to your Watchlist`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add to watchlist"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClickPoster = (id) => {
    navigate(`/movies/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      {/* Wishlist button with tooltip */}
      <div className="absolute top-2 right-2 z-20 group">
        <button
          onClick={toggleWishlist}
          disabled={wishlist || loading}
          className={`p-1 rounded-full transition-colors cursor-pointer ${
            wishlist
              ? "bg-gray-700 cursor-not-allowed"
              : "bg-gray-900/70 hover:bg-gray-700"
          }`}
        >
          {wishlist ? (
            <HeartSolid className="w-6 h-6 text-red-500" />
          ) : (
            <HeartOutline className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Tooltip */}
        <span className="absolute top-0 right-full mr-2 -translate-y-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {wishlist ? "Added" : "Add to Watchlist"}
        </span>
      </div>

      {/* Poster image */}
      <div
        className="relative h-64 cursor-pointer"
        onClick={() => handleClickPoster(movie._id)}
      >
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-xl text-indigo-400 mb-2">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm mb-2">{movie.releaseYear}</p>
        <p className="text-gray-300 text-sm line-clamp-3">{movie.synopsis}</p>
      </div>
    </motion.div>
  );
};

export default MovieCard;
