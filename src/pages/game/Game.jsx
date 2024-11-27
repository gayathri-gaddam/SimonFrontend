import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "./Game.css";
import "../../global.css";
import { UserDataContext } from "../../context/UserDataContext";

const buttonColours = ["red", "blue", "green", "yellow"];
const highScoreMsg =
  "Oops, did you just break the game? Nope, just your own high score! Keep it up, record-smasher!";
const lowScoreMsg =
  "Uh-oh, a dip in the score! It's okay, even gaming legends have their off days. Shake it off, level up, and show that leaderboard who's boss!";

export default function Game() {
  const navigate = useNavigate();
  const gameBody = useRef(null);
  const colors = useRef(null);
  const gamePattern = useRef([]);
  let userClickedPattern = [];
  const started = useRef(false);
  const { getUserData, setUserData, getToken } = useContext(UserDataContext);
  const userData = getUserData();
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const url = import.meta.env.VITE_API_URL + "/users";

  const getColors = () => {
    if (!colors.current) {
      colors.current = new Map();
    }
    return colors.current;
  };

  function checkAnswer(curLevel) {
    if (
      gamePattern.current[curLevel - 1] === userClickedPattern[curLevel - 1]
    ) {
      if (gamePattern.current.length === userClickedPattern.length) {
        setTimeout(function () {
          nextSequence();
        }, 1000);
      }
    } else {
      setGameOver(true);
      playSound("wrong");
      gameBody.current.classList.add("game-over");
      if (level - 1 > userData.highestScore) {
        axios
          .patch(
            url + `/${userData.userId}`,
            {
              highestScore: level - 1,
            },
            {
              headers: {
                Authorization: `bearer ${getToken()}`,
              },
            }
          )
          .then((res) => {
            setUserData({ ...userData, highestScore: level - 1 });
          })
          .catch((err) => console.log(err.message));
      }
      setTimeout(function () {
        gameBody.current.classList.remove("game-over");
      }, 200);
    }
  }

  const nextSequence = useCallback(() => {
    userClickedPattern = [];
    setLevel((level) => level + 1);
    const randomNumber = getRandomIntInclusive(0, 3);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.current.push(randomChosenColour);
    let allColors = getColors();
    allColors.get(randomChosenColour).classList.add("fadeOut");
    setTimeout(() => {
      allColors.get(randomChosenColour).classList.remove("fadeOut");
      allColors.get(randomChosenColour).classList.add("fadeIn");
    }, 200);
    setTimeout(() => {
      allColors.get(randomChosenColour).classList.remove("fadeIn");
      allColors.get(randomChosenColour).classList.add("fadeOut");
    }, 200);
    setTimeout(() => {
      allColors.get(randomChosenColour).classList.remove("fadeOut");
      allColors.get(randomChosenColour).classList.add("fadeIn");
    }, 200);
    setTimeout(() => {
      allColors.get(randomChosenColour).classList.remove("fadeIn");
    }, 200);
    playSound(randomChosenColour);
  }, []);

  const getRandomIntInclusive = () => {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    let randomNumber = randomBuffer[0] / (0xffffffff + 1);
    return Math.floor(randomNumber * 4);
  };

  const playSound = (name) => {
    var ad = new Audio(`/sounds/${name}.mp3`);
    ad.addEventListener("error", (event) => {
      console.error(`Error loading audio file: ${event.target.src}`);
    });
    ad.play();
  };

  const animatePress = (curColour) => {
    const allColors = getColors();
    allColors.get(curColour).classList.add("game-pressed");
    setTimeout(function () {
      allColors.get(curColour).classList.remove("game-pressed");
    }, 100);
  };

  const startOver = () => {
    gamePattern.current = [];
    setLevel(0);
    started.current = false;
    setGameOver(false);
  };

  const clickHandler = (e) => {
    var userChosenColour = e.target.id;
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length);
  };

  useEffect(() => {
    document.addEventListener("keypress", function () {
      if (!started.current) {
        started.current = true;
        nextSequence();
      }
    });
  }, [nextSequence]);

  return (
    <div className="game-body" ref={gameBody}>
      <div className="game-header">
        <h1 id="level-title">
          {gameOver
            ? "Game Over"
            : level === 0
            ? "Press Any Key to Start"
            : `Level ${level}`}
        </h1>
      </div>
      {!gameOver ? (
        <div className="game-container">
          <div className="game-row">
            <div
              type="button"
              id="green"
              className="game-btn game-green"
              ref={(node) => {
                const map = getColors();
                if (node) {
                  map.set("green", node);
                }
              }}
              onClick={clickHandler}
            ></div>
            <div
              type="button"
              id="red"
              className="game-btn game-red"
              ref={(node) => {
                const map = getColors();
                if (node) {
                  map.set("red", node);
                }
              }}
              onClick={clickHandler}
            ></div>
          </div>

          <div className="game-row">
            <div
              type="button"
              id="yellow"
              className="game-btn game-yellow"
              ref={(node) => {
                const map = getColors();
                if (node) {
                  map.set("yellow", node);
                }
              }}
              onClick={clickHandler}
            ></div>
            <div
              type="button"
              id="blue"
              className="game-btn game-blue"
              ref={(node) => {
                const map = getColors();
                if (node) {
                  map.set("blue", node);
                }
              }}
              onClick={clickHandler}
            ></div>
          </div>
        </div>
      ) : (
        <div className="game-container">
          <div className="game-score-section">
            <h2>
              Current Score:
              <span id="current-score">{level == 1 ? 0 : level - 1}</span>
            </h2>
            <h2>Highest Score:{userData.highestScore}</h2>
          </div>
          <div className="game-message-section">
            {level <= userData.highestScore ? lowScoreMsg : highScoreMsg}
            <h3 id="game-message"></h3>
          </div>
          <div className="game-items-section">
            <ul>
              <li>
                <span onClick={() => startOver()} id="navigate-btn">
                  Restart Game
                </span>
              </li>
              <li>
                <span onClick={() => navigate("/")} id="navigate-btn">
                  Exit to main menu
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}



