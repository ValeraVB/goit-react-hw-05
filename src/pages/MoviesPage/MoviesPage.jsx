import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieList from "../../components/MovieList/MovieList";
import { searchMovies } from "../../services/apiService";
import styles from "./MoviesPage.module.css";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const fetchMovies = async (query) => {
    setLoading(true);
    setError(null);
    setNoResults(false);
    try {
      const data = await searchMovies(query);
      if (data.length === 0) {
        setNoResults(true);
      } else {
        setMovies(data);
      }
    } catch (error) {
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchMovies(query);
    } else {
      setMovies([]);
      setNoResults(false);
    }
  }, [query]);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setFormError("Please enter a search term.");
      return;
    }
    setFormError(null);
    setSearchParams({ query });
  };

  return (
    <div className={styles.container}>
      <h1>Search Movies</h1>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          value={query}
          onChange={(e) => setSearchParams({ query: e.target.value })}
          placeholder="Search for movies..."
        />
        <button type="submit">Search</button>
      </form>
      {formError && <div className={styles.formError}>{formError}</div>}
      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {noResults && <div className={styles.noResults}>No movies found.</div>}
      {movies.length > 0 && <MovieList movies={movies} />}
    </div>
  );
};

export default MoviesPage;
