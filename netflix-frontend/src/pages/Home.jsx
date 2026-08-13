import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import {
  getNetflixOriginals,
  getTrending,
  getTopRated,
  getActionMovies,
  getComedyMovies,
  getHorrorMovies,
  getRomanceMovies,
  getDocumentaries,
} from "../api/omdb";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // clicking any poster or the banner's Play button goes to that title's own details page
  // OMDB uses imdbID as the id (e.g. tt1234567)
  const goToTitle = (movie) => {
    const mediaType = movie.media_type || "movie";
    navigate(`/title/${mediaType}/${movie.id}`);
  };

  // useCallback so Row's useEffect doesn't refetch on every render
  const fetchTrending = useCallback(getTrending, []);
  const fetchOriginals = useCallback(getNetflixOriginals, []);
  const fetchTopRated = useCallback(getTopRated, []);
  const fetchAction = useCallback(getActionMovies, []);
  const fetchComedy = useCallback(getComedyMovies, []);
  const fetchHorror = useCallback(getHorrorMovies, []);
  const fetchRomance = useCallback(getRomanceMovies, []);
  const fetchDocumentaries = useCallback(getDocumentaries, []);

  return (
    <div className="home-page">
      <Navbar />
      <Banner onPlayTrailer={goToTitle} />

      <Row title="Netflix Originals" fetchMovies={fetchOriginals} onPosterClick={goToTitle} />
      <Row title="Trending Now" fetchMovies={fetchTrending} onPosterClick={goToTitle} />
      <Row title="Top Rated" fetchMovies={fetchTopRated} onPosterClick={goToTitle} />
      <Row title="Action Movies" fetchMovies={fetchAction} onPosterClick={goToTitle} />
      <Row title="Comedies" fetchMovies={fetchComedy} onPosterClick={goToTitle} />
      <Row title="Horror Movies" fetchMovies={fetchHorror} onPosterClick={goToTitle} />
      <Row title="Romance Movies" fetchMovies={fetchRomance} onPosterClick={goToTitle} />
      <Row title="Documentaries" fetchMovies={fetchDocumentaries} onPosterClick={goToTitle} />
    </div>
  );
};

export default Home;
