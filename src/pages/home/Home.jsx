import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "./Home.css";
import logo from "../../assets/logo.svg";
import { UserDataContext } from "../../context/UserDataContext";
import "../../global.css";

export default function Home() {
  const [showPopUp, setShowPopUp] = useState(false);

  const { getUserData, setUserData, setToken } = useContext(UserDataContext);
  const userData = getUserData();
  return (
    <div>
      <div className="logo">
        <img src={logo} alt="Logo" height="165px" width="1000px" />
      </div>
      <div className="home-container">
        {userData && (
          <>
            <div className="name-section">
              <h1 id="welcome">Welcome {userData.userId}</h1>
            </div>
            <div className="home-score-section">
              <h2>
                <span id="username">Highest Score {userData.highestScore}</span>
              </h2>
              <p>Beat your own record!</p>
            </div>
          </>
        )}
        <div className="items-section">
          <ul>
            <li>
              <Link to="/gameMode" style={{ textDecoration: "none" }}>
                <span>Start</span>
              </Link>
            </li>
            <li>
              <Link to="/rules" style={{ textDecoration: "none" }}>
                <span>How to Play</span>
              </Link>
            </li>
            <li>
              <Link to="/userdetails" style={{ textDecoration: "none" }}>
                <span>User Details</span>
              </Link>
            </li>
            <li id="exit">
              <span onClick={() => setShowPopUp((prev) => !prev)}>Exit</span>
            </li>
          </ul>
        </div>
        {showPopUp && (
          <div id="popup" className="popup">
            <div className="popup-content">
              <p>Are you sure you want to exit?</p>
              <div className="popup-msg">
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <span
                    className="popup-btn"
                    id="confirm-exit"
                    onClick={() => {
                      setUserData(null);
                      setToken(null);
                    }}
                  >
                    Yes
                  </span>
                </Link>
                <span
                  id="cancel-exit"
                  className="popup-btn"
                  onClick={() => setShowPopUp((prev) => !prev)}
                >
                  Cancel
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
