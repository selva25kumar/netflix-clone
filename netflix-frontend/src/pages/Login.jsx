import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/"); // go to home page after login
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-navbar">
        <span className="auth-logo">NETFLIX</span>
      </div>

      <div className="auth-wrapper">
        <div className="auth-box">
          <h2>Sign In</h2>
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <input
                className="auth-input"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="auth-label">Email</label>
            </div>

            <div className="auth-field">
              <input
                className="auth-input"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="auth-label">Password</label>
            </div>

            <button className="auth-button" type="submit">
              Sign In
            </button>

            <div className="auth-options-row">
              <label className="auth-remember">
                <input type="checkbox" />
                Remember me
              </label>
              <span className="auth-help">Need help?</span>
            </div>
          </form>

          <p className="auth-switch">
            New to Netflix? <Link to="/signup"><span>Sign up now</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
