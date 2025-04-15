import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import "./movie_app.css";

function MovieApp() {
  const API_KEY = "e5cecf2fd48975bae988f82a26526b73";

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch genres once
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        );
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError("Failed to load genres.");
      }
    };

    fetchGenres();
  }, []);

  // Handle search submit
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          query
        )}&sort_by=${sortBy}&with_genres=${genre}`
      );
      const data = await res.json();
      setMovies(data.results || []);
      if (data.results.length === 0) setError("No results found.");
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">🎬 Movie Explorer</h1>

      <form onSubmit={handleSearchSubmit}>
        <div className="row mb-4">
          <div className="col-md-4">
            <select
              className="form-control"
              onChange={(e) => setGenre(e.target.value)}
              value={genre}
            >
              <option value="">Select Genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <select
              className="form-control"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="popularity.desc">Popularity</option>
              <option value="release_date.desc">Release Date</option>
              <option value="vote_average.desc">Rating</option>
            </select>
          </div>

          <div className="col-md-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="input-group-append">
                <button type="submit" className="btn btn-primary">
                  <AiOutlineSearch />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-4">
              <div className="card h-100">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/150"
                  }
                  className="card-img-top"
                  alt={movie.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  <p className="card-text">📅 {movie.release_date || "N/A"}</p>
                  <p className="card-text">⭐ {movie.vote_average || "N/A"}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center w-100">No movies to show.</p>
        )}
      </div>
    </div>
  );
}

export default MovieApp;
