import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieCast } from "../../services/apiService";
import styles from "./MovieCast.module.css";

const MovieCast = () => {
  const { movieId } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMovieCast = async () => {
      try {
        const data = await fetchMovieCast(movieId);
        setCast(data);
      } catch (error) {
        setError("Failed to fetch cast");
      } finally {
        setLoading(false);
      }
    };
    getMovieCast();
  }, [movieId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className={styles.heading}>Cast</h2>
      <ul className={styles.list}>
        {cast.map((member) => (
          <li key={member.id} className={styles.item}>
            {member.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200/${member.profile_path}`}
                alt={member.name}
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.noImage}>No Image</div>
            )}
            <p>{member.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieCast;
