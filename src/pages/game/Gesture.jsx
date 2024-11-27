import { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import "./Game.css";
import "../../global.css";
import { UserDataContext } from "../../context/UserDataContext";

const buttonColours = ["red", "blue", "green", "yellow"];

export default function Gesture() {
  const navigate = useNavigate();
  const gameBody = useRef(null);
  const colors = useRef(new Map());
  const gamePattern = useRef([]);
  const userPattern = useRef([]);
  const started = useRef(false);
  const { getUserData, setUserData, getToken } = useContext(UserDataContext);
  const userData = getUserData();
  const [level, setLevel] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gesture, setGesture] = useState("No Gesture");
  const webcamRef = useRef(null);

  const defineGestures = () => {
    const oneFinger = new fp.GestureDescription("one_finger");
    oneFinger.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl);
    oneFinger.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl);

    const twoFingers = new fp.GestureDescription("two_fingers");
    twoFingers.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl);
    twoFingers.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl);

    const threeFingers = new fp.GestureDescription("three_fingers");
    threeFingers.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl);
    threeFingers.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl);
    threeFingers.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl);

    const fourFingers = new fp.GestureDescription("four_fingers");
    fourFingers.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl);
    fourFingers.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl);
    fourFingers.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl);
    fourFingers.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl);

    return [oneFinger, twoFingers, threeFingers, fourFingers];
  };

  const runHandpose = async () => {
    const net = await handpose.load();
    console.log("Handpose model loaded.");
    setInterval(() => detect(net), 1000); // Slower interval to give time for gesture switching
  };

  const detect = async (net) => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      const hand = await net.estimateHands(video);
      if (hand.length > 0) {
        const gestureEstimator = new fp.GestureEstimator(defineGestures());
        const gestureEstimation = gestureEstimator.estimate(hand[0].landmarks, 8);
        if (gestureEstimation.gestures.length > 0) {
          const recognizedGesture = gestureEstimation.gestures.reduce((prev, current) =>
            prev.score > current.score ? prev : current
          );
          const detectedGesture = recognizedGesture.name;
          setGesture(detectedGesture);
          handleGestureInput(detectedGesture);
        }
      }
    }
  };

  const handleGestureInput = (gestureName) => {
    const gestureMap = {
      one_finger: "green",
      two_fingers: "red",
      three_fingers: "yellow",
      four_fingers: "blue",
    };

    const userChosenColour = gestureMap[gestureName];
    console.log("User guessed:", userChosenColour);
    if (userChosenColour) {
      userPattern.current.push(userChosenColour);
      playSound(userChosenColour);
      animatePress(userChosenColour);
      checkUserInput();
    }
  };

  const playSound = (name) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play();
  };

  const animatePress = (curColour) => {
    const chosenButton = colors.current.get(curColour);
    if (chosenButton) {
      chosenButton.classList.add("game-pressed");
      setTimeout(() => {
        chosenButton.classList.remove("game-pressed");
      }, 100);
    }
  };

  const checkUserInput = () => {
    const currentGuessIndex = userPattern.current.length - 1;

    // Check if the current gesture matches the sequence
    if (userPattern.current[currentGuessIndex] === gamePattern.current[currentGuessIndex]) {
      console.log("User input is correct.");

      // If the user completed the sequence
      if (userPattern.current.length === gamePattern.current.length) {
        console.log("Sequence completed! Moving to next level.");
        setTimeout(() => {
          nextSequence();
        }, 1000);
      }
    } else {
      console.error("User input is incorrect. Game Over!");
      playSound("wrong");
      setGameOver(true);
    }
  };

  const nextSequence = useCallback(() => {
    userPattern.current = [];
    setLevel((prevLevel) => prevLevel + 1);
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.current.push(randomChosenColour);
    console.log("Next color added to sequence:", randomChosenColour);
    playSound(randomChosenColour);
    animatePress(randomChosenColour);
  }, []);

  useEffect(() => {
    runHandpose();
    document.addEventListener("keypress", () => {
      if (!started.current) {
        console.log("Game started.");
        started.current = true;
        nextSequence();
      }
    });
  }, [nextSequence]);

  return (
    <div className="game-body" ref={gameBody}>
      <h1>{gameOver ? "Game Over" : `Level ${level}`}</h1>
      <h2>Gesture: {gesture}</h2>
      <Webcam ref={webcamRef} style={{ width: 300, height: 200 }} />
      <div className="game-container">
        <div className="game-row">
          <div id="green" className="game-btn game-green" ref={(node) => colors.current.set("green", node)}></div>
          <div id="red" className="game-btn game-red" ref={(node) => colors.current.set("red", node)}></div>
        </div>
        <div className="game-row">
          <div id="yellow" className="game-btn game-yellow" ref={(node) => colors.current.set("yellow", node)}></div>
          <div id="blue" className="game-btn game-blue" ref={(node) => colors.current.set("blue", node)}></div>
        </div>
      </div>
    </div>
  );
}


