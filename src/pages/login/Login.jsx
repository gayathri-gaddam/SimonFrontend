/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

import "../../global.css";
import "./Login.css";
import { UserDataContext } from "../../context/UserDataContext";
import { auth, googleProvider, db } from "../../utils/firebase";

export default function Login() {
  const { setUserData, setToken } = useContext(UserDataContext);
  const url = import.meta.env.VITE_API_URL + "/login";
  const [loginSuccess, setLoginSuccess] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        if (!result) {
          const userRef = doc(db, "users", auth.currentUser.email);
          const userSnap = await getDoc(userRef);
          setUserData(userSnap.data());
        } else {
          const userData = result.user;
          const userRef = doc(db, "users", userData.email);
          const userSnap = await getDoc(userRef);
          let user;
          if (!userSnap.exists()) {
            user = {
              name: userData.displayName,
              highestScore: { easy: 0, hard: 0 },
              lastLogin: new Date(),
              createdAt: new Date(),
              email: userData.email,
            };
          } else {
            user = {
              ...userSnap.data(),
              lastLogin: new Date(),
            };
          }
          setUserData(user);
          try {
            await setDoc(userRef, user);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };

  return (
    <div className="center">
      <h2>Login</h2>
      <div className="login-btn-container">
        <span onClick={handleLogin} className="btn">
          Login with Google
        </span>
      </div>
      {loginSuccess != null && (
        <div>
          {!loginSuccess ? (
            <p id="error-message">
              Invalid username or password. Please try again.
            </p>
          ) : (
            <p id="success-message">You&apos;re in! Happy to see you again!</p>
          )}
        </div>
      )}
    </div>
  );
}
