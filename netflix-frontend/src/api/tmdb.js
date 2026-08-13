// Functions to fetch movie data from TMDB (The Movie Database) API
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// generic fetch helper - tags each result with media_type (movie/tv) if not already present,
// so we always know which detail page to navigate to when a poster is clicked
const fetchFromTMDB = async (endpoint, forceMediaType) => {
  const separator = endpoint.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  const results = data.results || [];

  if (forceMediaType) {
    // discover/movie, discover/tv etc don't include media_type in each item, so we add it
    return results.map((item) => ({ ...item, media_type: forceMediaType }));
  }
  return results;
};

// different categories shown as Netflix-style rows
// (trending already includes media_type per item, so no forceMediaType needed there)
export const getTrending = () => fetchFromTMDB("/trending/all/week");
export const getNetflixOriginals = () =>
  fetchFromTMDB("/discover/tv?with_networks=213", "tv");
export const getTopRated = () => fetchFromTMDB("/movie/top_rated", "movie");
export const getActionMovies = () => fetchFromTMDB("/discover/movie?with_genres=28", "movie");
export const getComedyMovies = () => fetchFromTMDB("/discover/movie?with_genres=35", "movie");
export const getHorrorMovies = () => fetchFromTMDB("/discover/movie?with_genres=27", "movie");
export const getRomanceMovies = () => fetchFromTMDB("/discover/movie?with_genres=10749", "movie");
export const getDocumentaries = () => fetchFromTMDB("/discover/movie?with_genres=99", "movie");

// get trailer video (YouTube key) for a movie/show
export const getTrailer = async (id, mediaType = "movie") => {
  const res = await fetch(
    `${BASE_URL}/${mediaType}/${id}/videos?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();
  // find a YouTube trailer, fallback to first video available
  const trailer = data.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
  return trailer || data.results?.[0] || null;
};

// get full details for one title (used on the movie/show details page)
export const getDetails = async (id, mediaType = "movie") => {
  const res = await fetch(
    `${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`
  );
  const data = await res.json();
  return { ...data, media_type: mediaType };
};

// get "More Like This" recommended titles based on a movie/show
export const getRecommendations = (id, mediaType = "movie") =>
  fetchFromTMDB(`/${mediaType}/${id}/recommendations`, mediaType);

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
