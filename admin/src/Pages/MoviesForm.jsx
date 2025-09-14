import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_MOVIES } from "@/utils/constants";

const AddMovieForm = () => {
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [synopsis, setSynopsis] = useState("");

  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState([]);

  const [castInput, setCastInput] = useState("");
  const [cast, setCast] = useState([]);

  const handleAddGenre = () => {
    if (genreInput.trim() && !genres.includes(genreInput.trim())) {
      setGenres([...genres, genreInput.trim()]);
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (item) => {
    setGenres(genres.filter((g) => g !== item));
  };

  const handleAddCast = () => {
    if (castInput.trim() && !cast.includes(castInput.trim())) {
      setCast([...cast, castInput.trim()]);
      setCastInput("");
    }
  };

  const handleRemoveCast = (item) => {
    setCast(cast.filter((c) => c !== item));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !releaseYear || genres.length === 0 || cast.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("releaseYear", releaseYear);
      formData.append("synopsis", synopsis);
      genres.forEach((g) => formData.append("genre", g));
      cast.forEach((c) => formData.append("cast", c));
      formData.append("poster", poster);

      const response = await apiClient.post(ADD_MOVIES, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Movie added successfully!");
      setTitle("");
      setReleaseYear("");
      setSynopsis("");
      setGenres([]);
      setCast([]);
      setPoster(null);
      setPosterPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add movie");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-screen p-6 space-y-6 bg-white overflow-auto"
    >
      <h2 className="text-3xl font-bold">Add Movie</h2>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Genre Section */}
      <div>
        <div className="flex gap-2">
          <Input
            placeholder="Add Genre"
            value={genreInput}
            onChange={(e) => setGenreInput(e.target.value)}
          />
          <Button
            className="cursor-pointer"
            type="button"
            onClick={handleAddGenre}
          >
            +
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {genres.map((g, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
            >
              {g}
              <button
                type="button"
                onClick={() => handleRemoveGenre(g)}
                className="font-bold"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cast Section */}
      <div>
        <div className="flex gap-2">
          <Input
            placeholder="Add Cast"
            value={castInput}
            onChange={(e) => setCastInput(e.target.value)}
          />
          <Button
            className="cursor-pointer"
            type="button"
            onClick={handleAddCast}
          >
            +
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {cast.map((c, idx) => (
            <div
              key={idx}
              className="bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1"
            >
              {c}
              <button
                type="button"
                onClick={() => handleRemoveCast(c)}
                className="font-bold cursor-pointer"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <Input
        placeholder="Release Year"
        type="number"
        value={releaseYear}
        onChange={(e) => setReleaseYear(e.target.value)}
        required
      />

      <Textarea
        placeholder="Synopsis"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
      />

      <div>
        <input
          type="file"
          accept="image/*"
          className="cursor-pointer"
          onChange={handlePosterChange}
        />
        {posterPreview && (
          <img
            src={posterPreview}
            alt="Poster Preview"
            className="mt-2 w-full h-64 object-cover rounded"
          />
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 text-white cursor-pointer"
      >
        Add Movie
      </Button>
    </form>
  );
};

export default AddMovieForm;
