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
        <div className="txt-field">
          <input
            type="text"
            required
            name="username"
            id="username"
            className="htmlForm-field"
            onChange={form.handleChange}
            value={form.values.username}
            disabled={form.isSubmitting}
          />
          <span></span>
          <label htmlFor="username">Name</label>
        </div>
        <div className="txt-field">
          <input
            type="text"
            required
            name="userId"
            id="userId"
            className="htmlForm-field"
            onChange={form.handleChange}
            value={form.values.userId}
            disabled={form.isSubmitting}
          />
          <span></span>
          <span id="id-status">
            <i
              className="fa-solid fa-check fa-lg"
              style={{ color: "green" }}
              id="true"
            ></i>
            <i
              className="fa-solid fa-xmark fa-lg"
              style={{ color: "red" }}
              id="false"
            ></i>
          </span>
          <label htmlFor="userId">Username</label>
        </div>
        <div className="txt-field">
          <input
            type="password"
            required
            name="password"
            id="password"
            className="htmlForm-field"
            onChange={form.handleChange}
            value={form.values.password}
            disabled={form.isSubmitting}
          />
          <span></span>
          <span
            id="toggle-password"
            className="toggle-password"
            onClick={togglePasswordVisibility}
            disabled={form.isSubmitting}
          >
            <i className="fa-sharp fa-solid fa-eye"></i>
          </span>
          <label htmlFor="password">Password</label>
        </div>
        <span className="btn" onClick={form.handleSubmit}>
          Sign Up
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
