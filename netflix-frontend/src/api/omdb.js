// OMDB API integration - https://www.omdbapi.com/
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com";

// ── Normalize OMDB search result to a common shape ──────────────────────────
// OMDB search returns: { Title, Year, imdbID, Type, Poster }
// We normalize to: { id, title, name, poster, media_type }
// so all components work with consistent field names
const normalize = (item) => ({
  id: item.imdbID,
  imdbID: item.imdbID,
  title: item.Title,
  name: item.Title,
  poster: item.Poster !== "N/A" ? item.Poster : null,
  media_type: item.Type === "series" ? "tv" : "movie",
  year: item.Year,
});

// ── Normalize OMDB detail result ─────────────────────────────────────────────
// OMDB detail returns: { Title, Year, Rated, Plot, Genre, Runtime, imdbRating, Poster, ... }
const normalizeDetail = (item) => ({
  id: item.imdbID,
  imdbID: item.imdbID,
  title: item.Title,
  name: item.Title,
  poster: item.Poster !== "N/A" ? item.Poster : null,
  overview: item.Plot !== "N/A" ? item.Plot : "",
  media_type: item.Type === "series" ? "tv" : "movie",
  year: item.Year,
  runtime: item.Runtime !== "N/A" ? item.Runtime : "",
  genres: item.Genre !== "N/A" ? item.Genre : "",
  rating: item.imdbRating !== "N/A" ? item.imdbRating : null,
  director: item.Director !== "N/A" ? item.Director : "",
  actors: item.Actors !== "N/A" ? item.Actors : "",
  language: item.Language !== "N/A" ? item.Language : "",
  country: item.Country !== "N/A" ? item.Country : "",
  awards: item.Awards !== "N/A" ? item.Awards : "",
});

// ── Generic search helper ─────────────────────────────────────────────────────
const searchOMDB = async (query, type = "") => {
  try {
    const typeParam = type ? `&type=${type}` : "";
    const res = await fetch(
      `${BASE_URL}/?s=${encodeURIComponent(query)}${typeParam}&apikey=${API_KEY}`
    );
    const data = await res.json();
    if (data.Response === "False" || !data.Search) return [];
    return data.Search.map(normalize);
  } catch (err) {
    console.error("OMDB fetch error:", err);
    return [];
  }
};

// ── Category fetchers (equivalent to TMDB rows) ───────────────────────────────
// OMDB is search-based — we use popular, well-known titles per genre
// so OMDB reliably returns results with valid poster images

export const getNetflixOriginals = () => searchOMDB("avengers", "movie");
export const getTrending = () => searchOMDB("spider man", "movie");
export const getTopRated = () => searchOMDB("batman", "movie");
export const getActionMovies = () => searchOMDB("mission impossible", "movie");
export const getComedyMovies = () => searchOMDB("home alone", "movie");
export const getHorrorMovies = () => searchOMDB("conjuring", "movie");
export const getRomanceMovies = () => searchOMDB("titanic", "movie");
export const getDocumentaries = () => searchOMDB("planet earth", "series");

// ── Get full details for one title by imdbID ─────────────────────────────────
export const getDetails = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/?i=${id}&plot=full&apikey=${API_KEY}`);
    const data = await res.json();
    if (data.Response === "False") return null;
    return normalizeDetail(data);
  } catch (err) {
    console.error("OMDB details error:", err);
    return null;
  }
};

// ── Search for recommendations by genre/keyword of the current title ──────────
export const getRecommendations = async (id) => {
  try {
    // First fetch the current title to get its genre/year
    const res = await fetch(`${BASE_URL}/?i=${id}&apikey=${API_KEY}`);
    const data = await res.json();
    if (data.Response === "False") return [];
    const genre = data.Genre?.split(",")[0]?.trim() || "drama";
    return searchOMDB(genre, data.Type === "series" ? "series" : "movie");
  } catch (err) {
    console.error("OMDB recommendations error:", err);
    return [];
  }
};

// ── Get trailer via backend (MongoDB cache + YouTube Data API v3) ─────────────
// Flow: Frontend → Backend → MongoDB (cache hit?) → YouTube API → save → return videoId
// This means YouTube API is only called ONCE per movie, ever.
export const getTrailer = async (imdbID, title = "") => {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
    const params = title ? `?title=${encodeURIComponent(title)}` : "";
    const res = await fetch(`${backendUrl}/api/trailer/${imdbID}${params}`);
    const data = await res.json();
    // Returns { youtubeTrailerId: "abc123" } or { youtubeTrailerId: null }
    return data.youtubeTrailerId || null;
  } catch (err) {
    console.error("Trailer fetch error:", err);
    return null;
  }
};
