// Dedicated page for one movie/show - shows details and recommended titles
// Uses OMDB API - imdbID is the URL param (e.g. tt1234567)
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Row from "../components/Row";
import { getDetails, getTrailer, getRecommendations } from "../api/omdb";
import "./TitleDetails.css";

const TitleDetails = () => {
  // URL looks like /title/movie/tt1234567 or /title/tv/tt1234567
  const { mediaType, id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setShowPlayer(false); // reset player when navigating to a new title

      // Step 1: Get movie details from OMDB
      const detailsData = await getDetails(id, mediaType);
      setDetails(detailsData);
      setLoading(false);
      window.scrollTo(0, 0);

      // Step 2: Fetch trailer using title (backend → MongoDB cache → YouTube API)
      // Done separately so the page renders fast and trailer loads async
      if (detailsData) {
        const videoId = await getTrailer(id, detailsData.title || "");
        setTrailerKey(videoId);
      }
    };
    loadData();
  }, [id, mediaType]);

  // fetch function passed to the "More Like This" row
  const fetchRecommendations = useCallback(
    () => getRecommendations(id, mediaType),
    [id, mediaType]
  );

  // when a recommended poster is clicked, go to THAT title's details page
  const goToTitle = (movie) => {
    const nextType = movie.media_type || mediaType;
    navigate(`/title/${nextType}/${movie.id}`);
  };

  if (loading || !details) {
    return (
      <div className="details-page">
        <Navbar />
        <p className="details-loading">Loading...</p>
      </div>
    );
  }

  const title = details.title || details.name;

  return (
    <div className="details-page">
      <Navbar />
      <button className="details-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Hero section - show poster as backdrop */}
      {showPlayer && trailerKey ? (
        <div className="details-video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            title="trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className="details-hero"
          style={{
            backgroundImage: details.poster ? `url(${details.poster})` : "none",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center top",
          }}
        >
          {trailerKey && (
            <div className="details-play-overlay">
              <button
                className="details-play-button"
                onClick={() => setShowPlayer(true)}
              >
                ▶
              </button>
            </div>
          )}
          <div className="details-hero-fade" />
        </div>
      )}

      <div className="details-info">
        <h1 className="details-title">{title}</h1>
        <div className="details-meta">
          {details.year && <span>{details.year}</span>}
          {details.rating && (
            <span className="rating">⭐ {details.rating} / 10</span>
          )}
          {details.runtime && <span>{details.runtime}</span>}
          {details.language && <span>{details.language}</span>}
        </div>
        {details.overview && (
          <p className="details-overview">{details.overview}</p>
        )}
        {details.genres && (
          <p className="details-genres">Genres: {details.genres}</p>
        )}
        {details.director && (
          <p className="details-genres">Director: {details.director}</p>
        )}
        {details.actors && (
          <p className="details-genres">Cast: {details.actors}</p>
        )}
        {details.awards && (
          <p className="details-genres">🏆 {details.awards}</p>
        )}
      </div>

      <Row
        title="More Like This"
        fetchMovies={fetchRecommendations}
        onPosterClick={goToTitle}
      />
    </div>
  );
};

export default TitleDetails;
