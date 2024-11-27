import { useNavigate } from "react-router-dom";
import "./Gamemode.css";

export default function GameMode() {
  const navigate = useNavigate();

  // Function to handle mode selection
  const handleModeSelection = (mode) => {
    if (mode === "gesture") {
      navigate("/gesture");
    } else if (mode === "click") {
      // Navigate to Game.jsx for click-based control
      navigate("/game");
    } else if (mode === "voice") {
      // Navigate to Voice.jsx for voice-based control
      navigate("/voice");
    }
  };

  return (
    <div className="game-mode-selection">
      <h1>Select Your Game Mode</h1>
      <div className="mode-buttons">
        <button onClick={() => handleModeSelection("click")}>Click-Based Control</button>
        <button onClick={() => handleModeSelection("voice")}>Voice Control</button>
        <button onClick={() => handleModeSelection("gesture")}>Gesture Control</button>
      </div>
      <div className="selection-message">
        <p>Choose your preferred way to play the game.</p>
      </div>
    </div>
  );
}
