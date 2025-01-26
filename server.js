require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Connect to MongoDB
const dbUrl = process.env.DATABASE_URL;
mongoose
    .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Use API_KEY
const apiKey = process.env.API_KEY;
console.log("API Key:", apiKey); // For debugging (avoid in production)

// Add test route
app.get("/", (req, res) => {
    res.send("Server is running and connected to MongoDB!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
