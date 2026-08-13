const mongoose = require("mongoose");

// Caches the YouTube trailer ID for each movie (keyed by imdbID)
// This means we only call YouTube API ONCE per movie — ever.
// Every future request for the same movie reuses the stored videoId.
const trailerSchema = new mongoose.Schema(
  {
    imdbID: {
      type: String,
      required: true,
      unique: true, // one record per movie
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    youtubeTrailerId: {
      type: String,
      default: null, // null means "no trailer found"
    },
    cachedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trailer", trailerSchema);
