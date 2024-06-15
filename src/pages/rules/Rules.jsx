import { Link } from "react-router-dom";

import "./Rules.css";

export default function Rules() {
  return (
    <div className="rules-container">
      <div className="rules">
        <h2>Simon Game Rules</h2>
        <p>Welcome to the Simon game! The rules are simple:</p>
        <ol>
          <li>
            Watch the sequence of colors and sounds as they light up and play.
          </li>
          <li>
            Repeat the sequence by clicking or tapping the buttons in the same
            order.
          </li>
          <li>
            If you repeat the sequence correctly, the system will add another
            step to the sequence.
          </li>
          <li>
            If you make a mistake, you&apos;ll be given a choice to either exit
            to the main menu or restart the game.
          </li>
          <li>
            Choose to restart the game to try again and see how far you can get!
          </li>
        </ol>
      </div>
      <div className="link">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span id="back-to-mainmenu">Back to Main Menu</span>
        </Link>
      </div>
    </div>
  );
}
