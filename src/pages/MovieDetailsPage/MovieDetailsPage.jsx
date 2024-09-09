// src/pages/MovieDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, Outlet, useLocation } from "react-router-dom";
import { fetchMovieDetails } from "../../services/apiService";
import MovieCast from "../../components/MovieCast/MovieCast";
import MovieReviews from "../../components/MovieReviews/MovieReviews";
import styles from "./MovieDetailsPage.module.css";

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backLinkHref = location.state?.from ?? "/movies";

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        setError("Failed to fetch movie details");
      } finally {
        setLoading(false);
      }
    };
    getMovieDetails();
  }, [movieId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Link to={backLinkHref}>Go back</Link>
      {movie && (
        <>
          <div className={styles.movieInfo}>
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className={styles.poster}
            />
            <div className={styles.details}>
              <h1>{movie.title}</h1>
              <p>User Score: {movie.vote_average}</p>
              <p>{movie.overview}</p>
              <p>
                Genres: {movie.genres.map((genre) => genre.name).join(", ")}
              </p>
            </div>
          </div>
          <nav className={styles.nav}>
            <Link to="cast">Cast</Link>
            <Link to="reviews">Reviews</Link>
          </nav>
          <Outlet context={{ movieId }} />
        </>
      )}
    </div>
  );
};

export default MovieDetailsPage;
