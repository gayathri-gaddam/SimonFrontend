/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";

import "../../global.css";
import { UserDataContext } from "../../context/UserDataContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const { setUserData, setToken } = useContext(UserDataContext);
  const url = import.meta.env.VITE_API_URL + "/login";
  const [loginSuccess, setLoginSuccess] = useState(null);
  const navigate = useNavigate();
  const form = useFormik({
    initialValues: { userId: "", password: "" },
    onSubmit: (values, action) => {
      action.setSubmitting(true);
      axios
        .post(url, values)
        .then((res) => {
          if (res.status === 200) {
            const token = res.data;
            setToken(token);
            setUserData(jwtDecode(token).user);
            setLoginSuccess(true);
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        })
        .catch((err) => {
          setLoginSuccess(false);
          window.setTimeout(() => {
            form.resetForm();
            setLoginSuccess((ls) => undefined);
          }, 2000);
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
      <h2>Login</h2>
      <form onSubmit={form.handleSubmit}>
        <div className="txt-field">
          <input
            type="text"
            name="userId"
            id="userId"
            className="form-field"
            onChange={form.handleChange}
            value={form.values.userId}
            disabled={form.isSubmitting}
            required
          />
          <span></span>
          <label htmlFor="userId">Username</label>
        </div>
        <div className="txt-field" style={{ position: "relative" }}>
          <input
            type="password"
            name="password"
            id="password"
            required
            className="form-field"
            onChange={form.handleChange}
            value={form.values.password}
            disabled={form.isSubmitting}
          />
          <span></span>
          <span
            id="toggle-password"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            <i className="fa-sharp fa-solid fa-eye"></i>
          </span>
          <label htmlFor="password">Password</label>
        </div>
        <div className="pass">Forgot Password?</div>
        <span
          onClick={form.handleSubmit}
          className="btn"
          disabled={form.isSubmitting}
        >
          Login
        </span>
        <div className="signup-link">
          Not a member? <Link to="/signup">Signup</Link>
        </div>
      </form>
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
