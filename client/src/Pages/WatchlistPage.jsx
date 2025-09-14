import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { GET_MOVIES_WATCHLIST, REMOVE_WATCHLIST } from "@/utils/constants";
import { useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const WatchlistPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});
  const userInfo = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`${GET_MOVIES_WATCHLIST}`, {
          withCredentials: true,
        });
        setMovies(res.data?.movies || []);
      } catch (err) {
        console.error("Failed to load watchlist:", err);
        toast.error("Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) fetchWatchlist();
    else {
      setLoading(false);
      setMovies([]);
    }
  }, [userInfo]);

  const handleRemove = async (movieId) => {
    if (!userInfo) {
      toast.error("Please login to manage your watchlist");
      return;
    }

    try {
      const res = await apiClient.post(
        `${REMOVE_WATCHLIST}`,
        { movieId },
        { withCredentials: true }
      );
       window.location.reload();
      toast.success(res.data?.message || "Removed from watchlist");
    } catch (err) {
      console.error("Remove failed:", err);
      toast.error(err.response?.data?.message || "Failed to remove");
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Watchlist</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-gray-400">Loading watchlist...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="bg-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-300 text-lg">No movies in your watchlist yet.</p>
            <p className="text-gray-400 mt-2">
              Add movies from the catalogue to see them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden cursor-pointer">
              <thead className="bg-gray-700 text-gray-300 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Poster</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-center">Year</th>
                  <th className="px-4 py-3 text-center">Added</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {movies.map((item) => {
                  const m = item.movieId || {};
                  const movieId = m._id || "";
                  return (
                    <tr
                      key={movieId}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      {/* Poster */}
                      <td className="px-4 py-3">
                        <img
                          src={m.poster}
                          alt={m.title}
                          className="w-16 h-24 object-cover rounded"
                        />
                      </td>

                      {/* Title */}
                      <td className="px-4 py-3 font-medium">{m.title}</td>

                      {/* Year */}
                      <td className="px-4 py-3 text-center">{m.releaseYear || "—"}</td>

                      {/* Added */}
                      <td className="px-4 py-3 text-center">
                        {item.dateAdded
                          ? new Date(item.dateAdded).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          onClick={() => handleRemove(movieId)}
                          disabled={!!removing[movieId]}
                          className={`flex items-center gap-2 mx-auto cursor-pointer ${
                            removing[movieId]
                              ? "opacity-60 cursor-not-allowed"
                              : "hover:bg-red-600/20"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Remove</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
