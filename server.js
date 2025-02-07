const express = require("express");
const cors = require("cors");
const axios = require("axios"); 

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json()); 

//  fetch questions from the external API
app.get("/api/questions", async (req, res) => {
  try {
    // External API URL
    const externalApiUrl = "https://api.jsonserve.com/Uw5CrX";

    // Fetch data from the external API
    const response = await axios.get(externalApiUrl);

    
    const questions = response.data.questions;

    // Send the questions data to the quizapp
    res.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
});

//  score
app.post("/api/score", async (req, res) => {
  try {
    
    const { score } = req.body;

    
    console.log("Received score:", score);

    
    res.status(200).json({ message: "Score saved successfully", score });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: "Failed to save score" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
