import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup(name, email, password);
      navigate("/"); // go to home page after signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-navbar">
        <span className="auth-logo">NETFLIX</span>
      </div>

      <div className="auth-wrapper">
        <div className="auth-box">
          <h2>Sign Up</h2>
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <input
                className="auth-input"
                type="text"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label className="auth-label">Full Name</label>
            </div>

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
              Sign Up
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login"><span>Sign in</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
