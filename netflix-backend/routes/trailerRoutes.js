const express = require("express");
const router = express.Router();
const { getTrailer, getAllCached } = require("../controllers/trailerController");

// GET /api/trailer/cached        → list all cached trailers in MongoDB
router.get("/cached", getAllCached);

// GET /api/trailer/:imdbID       → get trailer for a specific movie
// Query params: ?title=Movie+Name (used as YouTube search query)
router.get("/:imdbID", getTrailer);

module.exports = router;
