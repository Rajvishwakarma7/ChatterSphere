import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function login(cb) {
    setIsAuthenticated(true);
    cb();
  }
  function logout(cb) {
    setIsAuthenticated(false);
    cb();
  }

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const parsedInfo = userInfo ? JSON.parse(userInfo) : null;
    if (parsedInfo && parsedInfo?.tokenInfo) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Get user token
export function getToken() {
  try {
    const userInfo = localStorage.getItem("userInfo");
    const parsedInfo = userInfo ? JSON.parse(userInfo) : null;
    return parsedInfo?.tokenInfo || null; // Return token if present, otherwise null
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    return null;
  }
}
// Get user info
export function getUserInfo() {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
    return null;
  }
}
