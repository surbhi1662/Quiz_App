import React, { useState, useEffect, useCallback } from "react";
import { Howl } from "howler";
import correctSound from "../assets/correct.mp3";
import wrongSound from "../assets/wrong.mp3";
import Question from "./Question";
import "../styles/styles.css";

const correctAudio = new Howl({ src: [correctSound] });
const wrongAudio = new Howl({ src: [wrongSound] });

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [streak, setStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Move to next question
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(10); // Reset timer
    } else {
      setQuizCompleted(true);
      saveScore(score);
    }
  }, [currentIndex, questions.length, score]);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/questions");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        
        if (data && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          setLoading(false);
        } else {
          setError("No valid questions found.");
          setLoading(false);
        }
      } catch (err) {
        setError("Failed to load questions.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Timer logic
  useEffect(() => {
    if (quizCompleted || questions.length === 0) return;

    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer); // Cleanup timer
  }, [timeLeft, quizCompleted, questions.length, handleNextQuestion]);

  // Handle user's answer
  const handleAnswer = (selectedAnswer) => {
    if (!questions[currentIndex]) return;
  
    const currentQuestion = questions[currentIndex];
  
    // Check if options are available
    const correctAnswer = currentQuestion.options && Array.isArray(currentQuestion.options) 
      ? currentQuestion.options.find(option => option.is_correct)
      : null;
  
    // Proceed if the correct answer exists
    if (correctAnswer && selectedAnswer === correctAnswer.description) {
      setScore(score + 1);
      setStreak(streak + 1);
      correctAudio.play();
    } else {
      setStreak(0);
      wrongAudio.play();
    }
  
    // Proceed to next question after a delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setTimeLeft(15);
      } else {
        alert("Quiz over!");
        setQuizCompleted(true);
        saveScore(score);
      }
    }, 1000);
  };
  
  // Save score to backend
  const saveScore = async (finalScore) => {
    try {
      const res = await fetch("http://localhost:5000/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ score: finalScore }),
      });

      if (!res.ok) {
        throw new Error("Failed to save score.");
      }

      const data = await res.json();
      console.log("Score saved successfully:", data);
    } catch (err) {
      console.error("Error saving score:", err);
    }
  };

  // Get badge based on score
  const getBadge = (finalScore) => {
    if (finalScore >= 800) return "🏅 Quiz Master";
    if (finalScore >= 500) return "🔥 Pro Player";
    if (finalScore >= 200) return "💡 Smart Learner";
    return "👶 Beginner";
  };

  // Handle Play Again button click
  const handlePlayAgain = () => {
    setCurrentIndex(0); // Reset to first question
    setScore(0); // Reset score
    setStreak(0); // Reset streak
    setTimeLeft(10); // Reset timer
    setQuizCompleted(false); // Set quizCompleted to false to start a new quiz
  };

  // Loading and error handling
  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="quiz-container">
      {!quizCompleted ? (
        questions[currentIndex] && (
          <Question
            question={questions[currentIndex]}
            handleAnswer={handleAnswer}
            timeLeft={timeLeft}
            score={score}
            streak={streak}
            currentIndex={currentIndex}  // Pass currentIndex to Question component
          />
        )
      ) : (
        <div className="result">
          <h1>Quiz Completed!</h1>
          <p>Your Score: {score}</p>
          <h2>You earned: {getBadge(score)}</h2>
          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
