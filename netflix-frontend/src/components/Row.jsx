import React, { useState, useEffect } from "react";
import "./Row.css";

// A horizontal scrollable row of movie posters (like Netflix rows)
// OMDB gives us a full poster URL directly (no base URL needed)
const Row = ({ title, fetchMovies, onPosterClick }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchMovies();
      setMovies(data);
    };
    loadMovies();
  }, [fetchMovies]);

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      <div className="row-posters">
        {movies.map((movie) => {
          if (!movie.poster) return null; // skip movies with no image

          return (
            <img
              key={movie.id}
              className="row-poster"
              src={movie.poster}
              alt={movie.title || movie.name}
              onClick={() => onPosterClick(movie)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Row;
