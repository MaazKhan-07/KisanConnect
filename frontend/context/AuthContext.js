"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Pre-seeded dummy accounts
const DEFAULT_USERS = [
  {
    id: 1,
    name: "Ramesh Patil (Farmer)",
    email: "farmer@kisan.com",
    password: "farmer123",
    role: "farmer",
  },
  {
    id: 2,
    name: "Nashik AgroFresh (Buyer)",
    email: "buyer@kisan.com",
    password: "buyer123",
    role: "buyer",
  },
];

function getStoredUsers() {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const stored = localStorage.getItem("kisan_users");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USERS;
    }
  }
  localStorage.setItem("kisan_users", JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

function getStoredSession() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("kisan_session");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedUsers = getStoredUsers();
    setUsers(storedUsers);
    const session = getStoredSession();
    if (session) {
      setUser(session);
    }
    setLoaded(true);
  }, []);

  const selectRole = (roleType) => {
    // Select default demo account or set guest role
    const demoUser = users.find((u) => u.role === roleType) || {
      id: Date.now(),
      name: roleType === "farmer" ? "Ramesh Patil" : "Nashik Traders",
      email: `${roleType}@kisan.com`,
      role: roleType,
    };
    setUser(demoUser);
    localStorage.setItem("kisan_session", JSON.stringify(demoUser));
    return demoUser;
  };

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }
    setUser(found);
    localStorage.setItem("kisan_session", JSON.stringify(found));
    return { success: true, user: found };
  };

  const signup = (name, email, password, role) => {
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, error: "An account with this email already exists" };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("kisan_users", JSON.stringify(updated));

    setUser(newUser);
    localStorage.setItem("kisan_session", JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("kisan_session", JSON.stringify(updatedUserData));
    // Also update in users array
    const updatedUsers = users.map((u) =>
      u.id === updatedUserData.id ? { ...u, ...updatedUserData } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem("kisan_users", JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("kisan_session");
  };

  return (
    <AuthContext.Provider
      value={{ user, loaded, selectRole, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
