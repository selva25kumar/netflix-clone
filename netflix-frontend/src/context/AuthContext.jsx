// Keeps track of logged-in user across the whole app using Context + useState
import React, { createContext, useState, useContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // load saved user from localStorage on first load (so refresh doesn't log out)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("netflixUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data);
    localStorage.setItem("netflixUser", JSON.stringify(res.data));
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data);
    localStorage.setItem("netflixUser", JSON.stringify(res.data));
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("netflixUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to use auth context easily in any component
export const useAuth = () => useContext(AuthContext);
