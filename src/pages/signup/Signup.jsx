import { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import "../../global.css";
import "./Signup.css";

export default function Signup() {
  const url = import.meta.env.VITE_API_URL + "/signup";
  const [loginSuccess, setLoginSuccess] = useState(null);
  const navigate = useNavigate();

  const form = useFormik({
    initialValues: {
      username: "",
      userId: "",
      password: "",
    },
    onSubmit: (values, action) => {
      action.setSubmitting(true);
      axios
        .post(url, {
          ...values,
        })
        .then((res) => {
          if (res.status === 201) {
            setLoginSuccess(true);
            setTimeout(() => {
              navigate("/login");
            }, 2000);
          }
        })
        .catch(({ response }) => {
          setLoginSuccess((ls) => false);
          window.setTimeout(() => {
            form.resetForm();
            setLoginSuccess(null);
          }, 3000);
        })
        .finally(() => {
          action.setSubmitting(false);
        });
    },
  });

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

  return (
    <div className="center">
      <h2>Sign up</h2>
      <form onSubmit={form.handleSubmit}>
        <span className="btn" onClick={form.handleSubmit}>
          Sign Up With Google
        </span>
        <div className="signup-link">
          Already a member? <Link to="/login">Login</Link>
        </div>
      </form>
      {loginSuccess != null && (
        <div className="message-container">
          {!loginSuccess ? (
            <p id="error-message">
              Username already exists.
              <br />
              Please try again with different Username.
            </p>
          ) : (
            <p id="success-message">
              Welcome aboard! Your account has been successfully created.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
