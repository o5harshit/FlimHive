import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  DELETE_MOVIES,
  GET_ALL_MOVIES,
  UPDATE_MOVIES,
} from "@/utils/constants";

const MoviesTable = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [open, setOpen] = useState(false);

  const [newGenre, setNewGenre] = useState("");
  const [newCast, setNewCast] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(GET_ALL_MOVIES);
      setMovies(res.data.Movies);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiClient.patch(`${DELETE_MOVIES}/${id}`);
      toast.success("Movie deleted");
      setMovies((prev) => prev.filter((movie) => movie._id !== id));
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete movie");
    }
  };

  const handleUpdateClick = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
    setNewGenre("");
    setNewCast("");
  };

  const handleSaveUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", selectedMovie.title);
      formData.append("releaseYear", selectedMovie.releaseYear);
      formData.append("synopsis", selectedMovie.synopsis);
      selectedMovie.genre.forEach((g) => formData.append("genre", g));
      selectedMovie.cast.forEach((c) => formData.append("cast", c));
      if (selectedMovie.posterFile) {
        formData.append("poster", selectedMovie.posterFile);
      }

      const res = await apiClient.patch(
        `${UPDATE_MOVIES}/${selectedMovie._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Movie updated successfully");

      setMovies((prev) =>
        prev.map((m) => (m._id === selectedMovie._id ? res.data.movie : m))
      );

      setOpen(false);
      setSelectedMovie(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to update movie");
    }
  };

  // Pagination Logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-6 mx-auto bg-white w-full">
      <h2 className="text-xl font-bold mb-4">Movies List</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Poster</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Release Year</TableHead>
                  <TableHead>Genres</TableHead>
                  <TableHead>Cast</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMovies.length > 0 ? (
                  currentMovies.map((movie) => (
                    <TableRow key={movie._id}>
                      <TableCell>
                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-16 h-20 object-cover rounded"
                          />
                        ) : (
                          "No Poster"
                        )}
                      </TableCell>
                      <TableCell>{movie.title}</TableCell>
                      <TableCell>{movie.releaseYear}</TableCell>
                      <TableCell>{movie.genre?.join(", ")}</TableCell>
                      <TableCell>{movie.cast?.join(", ")}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateClick(movie)}
                          className="cursor-pointer"
                        >
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(movie._id)}
                          className="cursor-pointer"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No movies found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  className={`px-3 py-1 border rounded cursor-pointer ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </>
      )}

      {/* Update Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Movie</DialogTitle>
          </DialogHeader>
          {selectedMovie && (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={selectedMovie.title}
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter movie title"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input
                  id="releaseYear"
                  value={selectedMovie.releaseYear}
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      releaseYear: e.target.value,
                    })
                  }
                  type="number"
                  placeholder="Enter release year"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="synopsis">Synopsis</Label>
                <Textarea
                  id="synopsis"
                  value={selectedMovie.synopsis}
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      synopsis: e.target.value,
                    })
                  }
                  placeholder="Enter synopsis"
                />
              </div>

              <div className="space-y-2">
                <Label>Genres</Label>
                <div className="flex gap-2">
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="Enter genre"
                  />
                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      if (newGenre.trim()) {
                        setSelectedMovie((prev) => ({
                          ...prev,
                          genre: [...prev.genre, newGenre.trim()],
                        }));
                        setNewGenre("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMovie.genre.map((g, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                    >
                      <span>{g}</span>
                      <button
                        type="button"
                        className="text-red-500 cursor-pointer"
                        onClick={() =>
                          setSelectedMovie((prev) => ({
                            ...prev,
                            genre: prev.genre.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cast</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCast}
                    onChange={(e) => setNewCast(e.target.value)}
                    placeholder="Enter cast member"
                  />
                  <Button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      if (newCast.trim()) {
                        setSelectedMovie((prev) => ({
                          ...prev,
                          cast: [...prev.cast, newCast.trim()],
                        }));
                        setNewCast("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMovie.cast.map((c, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        className="text-red-500 cursor-pointer"
                        onClick={() =>
                          setSelectedMovie((prev) => ({
                            ...prev,
                            cast: prev.cast.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="poster">Poster</Label>
                {selectedMovie.poster && !selectedMovie.posterFile && (
                  <img
                    src={selectedMovie.poster}
                    alt="Current Poster"
                    className="w-24 h-32 object-cover rounded mb-2"
                  />
                )}
                <Input
                  id="poster"
                  className="cursor-pointer"
                  type="file"
                  onChange={(e) =>
                    setSelectedMovie({
                      ...selectedMovie,
                      posterFile: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button className="cursor-pointer" onClick={handleSaveUpdate}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoviesTable;
