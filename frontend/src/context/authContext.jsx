// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin");
    setIsAdmin(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("admin", token);
    setIsAdmin(true);
  };


  return (
    <AuthContext.Provider value={{ isAdmin, login }}>
      {children}
    </AuthContext.Provider>
  );
};
