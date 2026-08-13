const Trailer = require("../models/Trailer");

// ── Search YouTube for a trailer and return its videoId ──────────────────────
const searchYouTube = async (query) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY not set in .env");

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query
  )}&type=video&maxResults=1&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    throw new Error(`YouTube API error: ${data.error.message}`);
  }

  return data.items?.[0]?.id?.videoId || null;
};

// ── GET /api/trailer/:imdbID?title=Movie+Name ─────────────────────────────────
// 1. Check MongoDB cache first
// 2. If not cached → call YouTube API → save to MongoDB
// 3. Return { imdbID, title, youtubeTrailerId }
const getTrailer = async (req, res) => {
  const { imdbID } = req.params;
  const { title } = req.query;

  if (!imdbID) {
    return res.status(400).json({ message: "imdbID is required" });
  }

  try {
    // ── Check cache ────────────────────────────────────────────────────────
    const cached = await Trailer.findOne({ imdbID });

    if (cached) {
      console.log(`[Trailer Cache HIT] ${imdbID} → ${cached.youtubeTrailerId}`);
      return res.json({
        imdbID: cached.imdbID,
        title: cached.title,
        youtubeTrailerId: cached.youtubeTrailerId,
        cached: true,
      });
    }

    // ── Cache miss: search YouTube ─────────────────────────────────────────
    const searchQuery = `${title || imdbID} official trailer`;
    console.log(`[Trailer Cache MISS] Searching YouTube: "${searchQuery}"`);

    const youtubeTrailerId = await searchYouTube(searchQuery);

    // ── Save to MongoDB (even if null, so we don't search again) ───────────
    const newTrailer = await Trailer.create({
      imdbID,
      title: title || imdbID,
      youtubeTrailerId,
    });

    console.log(`[Trailer Cached] ${imdbID} → ${youtubeTrailerId}`);

    return res.json({
      imdbID: newTrailer.imdbID,
      title: newTrailer.title,
      youtubeTrailerId: newTrailer.youtubeTrailerId,
      cached: false,
    });
  } catch (error) {
    console.error("[Trailer Error]", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ── GET /api/trailer/cached — list all cached trailers ───────────────────────
// Useful to see what's stored in MongoDB
const getAllCached = async (req, res) => {
  try {
    const trailers = await Trailer.find({}).sort({ cachedAt: -1 }).limit(50);
    return res.json(trailers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrailer, getAllCached };
