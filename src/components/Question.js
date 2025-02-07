import React from "react";

const Question = ({ question, handleAnswer, timeLeft, score, streak, currentIndex }) => {
  if (!question) return <p>Loading question...</p>;

  // Display question number, adding 1 to the currentIndex for a 1-based index
  const questionNumber = currentIndex + 1;

  return (
    <div className="question-container">
      <h2>Question {questionNumber}</h2> {/* Display Question 1, 2, 3, etc. */}
      
      <h3>{question.description}</h3>  {/* Display the question's description */}
      
      <div className="options">
        {question.options && question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.description)}  // Pass the selected answer
            className="option-button"
          >
            {option.description}  {/* Display each option's description */}
          </button>
        ))}
      </div>

      <p>⏳ Time Left: {timeLeft}s</p>
      <p>🏆 Score: {score}</p>
      <p>🔥 Streak: {streak}</p>
    </div>
  );
};

export default Question;
