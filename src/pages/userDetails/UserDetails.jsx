import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { UserDataContext } from "../../context/UserDataContext";
import "./UserDetails.css";
import "../../global.css";

//TODO send api call to api to save user edited data
export default function UserDetails() {
  const { getUserData, setUserData } = useContext(UserDataContext);
  const userData = getUserData();
  const [isEditable, setIsEditable] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(undefined);

  const togglePasswordVisibility = () => {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("toggle-password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      toggleButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
    } else {
      passwordInput.type = "password";
      toggleButton.innerHTML = '<i class="fa-sharp fa-solid fa-eye"></i>';
    }
  };

  const cancelButtonHandler = (e) => {
    const type = e.target.innerText;
    if (type === "Cancel") {
      setIsEditable(!isEditable);
    }
  };

  useEffect(() => {}, []);
  return (
    <div className="user-details-container">
      <h2>User Details</h2>
      <form id="edit-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="userId"
            value={userData.userId}
            disabled
            className="user-details-input form-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="full-name">Full Name:</label>
          <input
            type="text"
            id="full-name"
            name="username"
            className="user-details-input form-field"
            disabled={!isEditable}
            value={userData.username}
          />
        </div>
        {isEditable && (
          <>
            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="password">Current Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="user-details-input form-field"
                disabled={!isEditable}
                value={userData.password}
              />
              <span
                id="toggle-password"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                style={{ top: "35px" }}
              >
                <i className="fa-sharp fa-solid fa-eye"></i>
              </span>
            </div>
            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="password">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="user-details-input form-field"
                disabled={!isEditable}
                value={userData.password}
              />
              <span
                id="toggle-password"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                style={{ top: "35px" }}
              >
                <i className="fa-sharp fa-solid fa-eye"></i>
              </span>
            </div>
          </>
        )}
        <div className="btn-container">
          <span
            className="btn"
            onClick={() => setIsEditable(true)}
            style={{ width: "150px", fontSize: "12px" }}
          >
            {isEditable ? "Save" : "Edit Details"}
          </span>
          {isEditable ? (
            <span
              className="btn"
              onClick={(e) => cancelButtonHandler(e)}
              style={{ width: "150px", fontSize: "12px" }}
            >
              Cancel
            </span>
          ) : (
            <Link to="/" style={{ textDecoration: "none" }}>
              <span
                className="btn"
                style={{
                  width: "150px",
                  fontSize: "12px",
                  color: "rgb(212, 74, 212)",
                }}
              >
                Back
              </span>
            </Link>
          )}
        </div>
        {isUpdateSuccessful != null && (
          <div>
            {isUpdateSuccessful ? (
              <p id="success-message">
                Your changes have been saved successfully.
              </p>
            ) : (
              <p id="error-message">
                Sorry, we couldn&apos;t update your data. Please try again
                later.
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
