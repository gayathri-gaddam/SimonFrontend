import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Game.css";
import "../../global.css";
import { UserDataContext } from "../../context/UserDataContext";

const buttonColours = ["red", "blue", "green", "yellow"];
const highScoreMsg = "Great job! You set a new high score!";
const lowScoreMsg = "Uh-oh, a dip in the score! It's okay, even gaming legends have their off days.";

export default function VoiceGame() {
  const navigate = useNavigate();
  const gameBody = useRef(null);
  const gamePattern = useRef([]);
  const userClickedPattern = useRef([]);
  const recognition = useRef(null);
  const started = useRef(false);
  const isRecognitionRunning = useRef(false); // New flag to track recognition state
  const { getUserData, setUserData, getToken } = useContext(UserDataContext);
  const userData = getUserData();
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const url = import.meta.env.VITE_API_URL + "/users";

  // Initialize voice recognition
  const initializeVoiceControl = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.lang = "en-US";
    recognition.current.continuous = true;
    recognition.current.interimResults = false;
    recognition.current.maxAlternatives = 1;

    recognition.current.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      handleVoiceInput(command);
    };

    recognition.current.onerror = (event) => {
      if (event.error === "no-speech") {
        console.log("No speech detected. Restarting recognition.");
        stopVoiceRecognition();
        setTimeout(startVoiceRecognition, 1000);
      }
    };

    recognition.current.onend = () => {
      console.log("Recognition ended.");
      isRecognitionRunning.current = false;
    };
  };

  // Start voice recognition with check
  const startVoiceRecognition = () => {
    if (isRecognitionRunning.current || !recognition.current) {
      console.log("Recognition is already running or not initialized.");
      return;
    }

    try {
      recognition.current.start();
      isRecognitionRunning.current = true;
      console.log("Voice recognition started.");
    } catch (error) {
      console.error("Failed to start recognition:", error.message);
    }
  };

  // Stop voice recognition
  const stopVoiceRecognition = () => {
    if (recognition.current && isRecognitionRunning.current) {
      recognition.current.stop();
      isRecognitionRunning.current = false;
      console.log("Voice recognition stopped.");
    }
  };

  // Handle the voice input
  const handleVoiceInput = (command) => {
    const color = buttonColours.find((c) => command.includes(c));
    if (color) {
      userClickedPattern.current.push(color);
      playSound(color);
      animatePress(color);

      const currentIndex = userClickedPattern.current.length - 1;
      if (userClickedPattern.current[currentIndex] !== gamePattern.current[currentIndex]) {
        gameOverSequence();
        return;
      }

      if (userClickedPattern.current.length === gamePattern.current.length) {
        stopVoiceRecognition();
        setTimeout(nextSequence, 1000);
      }
    }
  };

  // Generate the next sequence
  const nextSequence = useCallback(() => {
    userClickedPattern.current = [];
    setLevel((prevLevel) => prevLevel + 1);
    const randomChosenColour = buttonColours[Math.floor(Math.random() * 4)];
    gamePattern.current.push(randomChosenColour);

    const latestColor = gamePattern.current[gamePattern.current.length - 1];
    setTimeout(() => {
      blinkColor(latestColor);
      playSound(latestColor);
    }, 1000);

    setTimeout(() => {
      startVoiceRecognition();
    }, 2000);
  }, []);

  // Blink the specified color
  const blinkColor = (color) => {
    const colorButton = document.getElementById(color);
    if (colorButton) {
      const originalColor = colorButton.style.backgroundColor;
      colorButton.style.backgroundColor = "white";
      setTimeout(() => {
        colorButton.style.backgroundColor = originalColor;
      }, 500);
    }
  };

  // Play sound for the specified color
  const playSound = (name) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play();
  };

  // Animate the button press
  const animatePress = (color) => {
    const colorButton = document.getElementById(color);
    if (colorButton) {
      colorButton.classList.add("game-pressed");
      setTimeout(() => colorButton.classList.remove("game-pressed"), 100);
    }
  };

 // Game over sequence
const gameOverSequence = () => {
  setGameOver(true);
  playSound("wrong");
  stopVoiceRecognition();

  if (gameBody.current) {
    gameBody.current.classList.add("game-over");
  }

  if (level - 1 > userData.highestScore) {
    axios
      .patch(
        `${url}/${userData.userId}`,
        { highestScore: level - 1 },
        { headers: { Authorization: `bearer ${getToken()}` } }
      )
      .then(() => setUserData({ ...userData, highestScore: level - 1 }))
      .catch((err) => console.error(err.message));
  }

  // Do not call startOver automatically; let the user choose to restart
  setTimeout(() => {
    if (gameBody.current) {
      gameBody.current.classList.remove("game-over");
    }
  }, 2000);
};


  // Start a new game
  const startOver = () => {
    gamePattern.current = [];
    userClickedPattern.current = [];
    setLevel(0);
    started.current = false;
    setGameOver(false);
  };

 // Restart the game only when the user clicks the restart button
const restartGame = () => {
  startOver();
  nextSequence();
};


  const exitToMainMenu = () => {
    navigate("/");
  };

  useEffect(() => {
    initializeVoiceControl();
    document.addEventListener("keypress", () => {
      if (!started.current) {
        started.current = true;
        nextSequence();
      }
    });
  }, [nextSequence]);

  return (
    <div className="game-body">
      {gameOver ? (
        <div className="game-container">
          <h1>Game Over</h1>
          <div className="game-score-section">
            <h2>Current Score: {level === 1 ? 0 : level - 1}</h2>
            <h2>Highest Score: {userData.highestScore}</h2>
          </div>
          <div className="game-message-section">
            {level <= userData.highestScore ? lowScoreMsg : highScoreMsg}
          </div>
          <div className="game-items-section">
            <button id="navigate-btn" onClick={restartGame}>Restart Game</button>
            <button id="navigate-btn" onClick={exitToMainMenu}>Exit to main menu</button>
          </div>
        </div>
      ) : (
        <div>
          <h1>{level === 0 ? "Press Any Key to Start" : `Level ${level}`}</h1>
          <div className="game-container">
            <div id="green" className="game-btn game-green"></div>
            <div id="red" className="game-btn game-red"></div>
            <div id="yellow" className="game-btn game-yellow"></div>
            <div id="blue" className="game-btn game-blue"></div>
          </div>
        </div>
      )}
    </div>
  );
}
