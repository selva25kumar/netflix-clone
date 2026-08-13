import React, { useState, useEffect } from "react";
import { getTrending } from "../api/omdb";
import "./Banner.css";

// Big featured banner at top of home page - shows a random trending title
const Banner = ({ onPlayTrailer }) => {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const loadBanner = async () => {
      const trending = await getTrending();
      if (trending.length > 0) {
        const randomIndex = Math.floor(Math.random() * trending.length);
        setMovie(trending[randomIndex]);
      }
    };
    loadBanner();
  }, []);

  // truncate long description text
  const truncate = (text, n) => {
    if (!text) return "";
    return text.length > n ? text.substring(0, n) + "..." : text;
  };

  if (!movie) return <div className="banner" />;

  return (
    <div
      className="banner"
      style={{
        backgroundImage: movie.poster ? `url(${movie.poster})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <h1 className="banner-title">{movie.title || movie.name}</h1>
      <p className="banner-description">{truncate(movie.overview, 180)}</p>
      <div className="banner-buttons">
        <button
          className="banner-button play"
          onClick={() => onPlayTrailer(movie)}
        >
          ▶ Play
        </button>
        <button className="banner-button info">ⓘ More Info</button>
      </div>
      <div className="banner-fade-bottom" />
    </div>
  );
};

export default Banner;
