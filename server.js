const express = require("express");
const cors = require("cors");
const axios = require("axios"); // To fetch data from the external URL

const app = express();
const port = 5000;

// Enable CORS to allow cross-origin requests
app.use(cors());
app.use(express.json()); // To parse incoming JSON payloads

// Endpoint to fetch questions from the external API
app.get("/api/questions", async (req, res) => {
  try {
    // External API URL
    const externalApiUrl = "https://api.jsonserve.com/Uw5CrX";

    // Fetch data from the external API
    const response = await axios.get(externalApiUrl);

    // Assuming the response contains the questions in a 'questions' field
    const questions = response.data.questions;

    // Send the questions data to the frontend
    res.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

// Endpoint to save the score
app.post("/api/score", async (req, res) => {
  try {
    // Get the score from the request body
    const { score } = req.body;

    // For now, we just log the score, but you can save it to a database if needed
    console.log("Received score:", score);

    // Respond with a success message
    res.status(200).json({ message: "Score saved successfully", score });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: "Failed to save score" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
