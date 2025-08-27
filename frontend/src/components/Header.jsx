// components/Header.jsx
import React, { useState, useEffect } from "react";
import NavLinkButton from "./NavLinkButton";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "Uploads", path: "/uploads-new-files" }, // new route
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    ["token", "role", "user"].forEach(key => localStorage.removeItem(key));
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="home-header">
      {/* Logo */}
      <h1 className="logo" onClick={() => window.location.href = "/"}>
        Excel Analytics
      </h1>

      {/* Navigation */}
      <nav className="main-nav">
        {navLinks.map(link => (
          <NavLinkButton key={link.name} name={link.name} path={link.path} />
        ))}
      </nav>

      {/* Auth Section */}
      <div className="auth-section">
        {user ? (
          <div className="user-info">
            <span>
              Welcome, {user.name} ({user.role})
            </span>

            {user.role === "user" && (
              <button
                onClick={() => window.location.href = "/userdashboard"}
                className="btn btn-primary"
              >
                Dashboard
              </button>
            )}
            {user.role === "admin" && (
              <button
                onClick={() => window.location.href = "/admin/dashboard"}
                className="btn btn-primary"
              >
                Admin Panel
              </button>
            )}

            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button
              onClick={() => window.location.href = "/login"}
              className="btn btn-primary"
            >
              Login
            </button>
            <button
              onClick={() => window.location.href = "/register"}
              className="btn btn-secondary"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
