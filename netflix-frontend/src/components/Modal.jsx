import React, { useState, useEffect } from "react";
import { getTrailer } from "../api/tmdb";
import "./Modal.css";

// Shows movie trailer inside a popup using YouTube embed
const Modal = ({ movie, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrailer = async () => {
      setLoading(true);
      // decide if it's a movie or tv show based on data returned by TMDB
      const mediaType = movie.media_type || (movie.title ? "movie" : "tv");
      const trailer = await getTrailer(movie.id, mediaType);
      setTrailerKey(trailer ? trailer.key : null);
      setLoading(false);
    };
    loadTrailer();
  }, [movie]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{movie.title || movie.name}</span>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {loading ? (
          <p className="modal-no-trailer">Loading trailer...</p>
        ) : trailerKey ? (
          <div className="modal-video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="modal-no-trailer">No trailer available for this title.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
