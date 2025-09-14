import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { GET_MOVIES_BY_ID, REVIEW_ROUTES } from "@/utils/constants";
import { useSelector } from "react-redux";
import { Star } from "lucide-react";

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState("");
  const [reviewsList, setReviewsList] = useState([]);
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0); 
  const userInfo = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await apiClient.get(`${GET_MOVIES_BY_ID}/${id}`);
        setMovie(res.data.movie);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load movie details");
      }
    };
    const fetchComments = async () => {
         try {
        const res = await apiClient.get(`${REVIEW_ROUTES}/${id}/GetReview`,{withCredentials : true});
        setReviewsList(res.data.reviews|| []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load movie details");
      }
    }
    fetchMovie();
    fetchComments();
  }, [id]);

  const handleAddReview = async (id) => {
    if (!review.trim()) {
      toast.error("Review cannot be empty");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await apiClient.post(`${REVIEW_ROUTES}/${id}/AddReview`, {
        userId: userInfo.id,
        text: review,
        rating, 
      },{withCredentials : true});
       window.location.reload();
      setReview("");
      setRating(0);
      toast.success("Review added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add review");
    }
  };

  if (!movie)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800 text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Column: Poster */}
        <div className="md:w-1/3">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Right Column: Details + Reviews */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Movie Details */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
            <p className="text-gray-400">{movie.releaseYear}</p>
            <p className="text-gray-300">{movie.description}</p>
            <p className="text-gray-300">
              <strong>Genre:</strong> {movie.genre.join(", ")}
            </p>
            <p className="text-gray-300">
              <strong>Cast:</strong> {movie.cast.join(", ")}
            </p>
          </div>

          {/* Add Review */}
          <div className="space-y-3">
            {userInfo ? (
              <div className="flex flex-col gap-3">
                {/* Star Rating Input */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={28}
                      className={`cursor-pointer ${
                        (hoverRating || rating) >= star
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>

                <Textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review..."
                  className="bg-gray-700 text-white"
                  rows={3}
                />
                <Button
                  onClick={() => handleAddReview(movie._id)}
                  className="w-max bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Add Review
                </Button>
              </div>
            ) : (
              <p className="text-gray-400">
                <span
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => navigate("/auth")}
                >
                  Join Us
                </span>{" "}
                to add a review.
              </p>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-3 overflow-y-auto max-h-[400px]">
            {reviewsList.length === 0 && (
              <p className="text-gray-400">No reviews yet.</p>
            )}
            {reviewsList.map((r, index) => (
              <Card
                key={index}
                className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors"
              >
                <CardContent>
                  {/* Show stars in review */}
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={
                          r.rating >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-300">{r.reviewText}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    — {r.userId?.name || "User"} on {new Date(r.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
