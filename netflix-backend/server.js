// Main entry point for the backend server
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const trailerRoutes = require("./routes/trailerRoutes");

const app = express();

// connect to MongoDB
connectDB();

// middleware
app.use(cors());
app.use(express.json()); // to read JSON from request body

// routes
app.use("/api/auth", authRoutes);
app.use("/api/trailer", trailerRoutes);

app.get("/", (req, res) => {
  res.send("Netflix backend is running");
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      startServer(port + 1);
      return;
    }

    throw error;
  });
};

startServer(Number(process.env.PORT) || 5000);
