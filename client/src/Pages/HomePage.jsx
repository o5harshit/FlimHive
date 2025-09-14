import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_ALL_MOVIES } from "@/utils/constants";
import HeroSection from "@/components/HeroSection";
import GenreSection from "@/components/GenreSection";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(GET_ALL_MOVIES);
      setMovies(res.data.Movies);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const genreMap = {};
  movies.forEach((movie) => {
    movie.genre.forEach((g) => {
      if (!genreMap[g]) genreMap[g] = [];
      genreMap[g].push(movie);
    });
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <HeroSection />

      <div className="max-w-7xl mx-auto p-6 space-y-10">
        {Object.keys(genreMap).map((genre) => (
          <GenreSection key={genre} genre={genre} movies={genreMap[genre]} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
