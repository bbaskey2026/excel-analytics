import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBarChart2, FiFileText, FiGrid, FiShare2 } from "react-icons/fi";
import "./Home.css"; 

import Testimonials from "./Testimonials";
import heroImage from "../assets/excel.jpg";

import Visualizations from "./Visualizations";

const Home = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role"); 

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  

  return (
    <div className="home-container">
      

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Excel Analytics Made Simple</h1>
          <p>
            Transform raw data into meaningful insights. Analyze, visualize, and
            share your Excel data effortlessly.
          </p>

          <div className="hero-buttons">
           
              {!user ? (
  // Not logged in
  <>
    <button
      onClick={() => navigate("/login")}
      className="btn btn-primary"
    >
      Login
    </button>
    <button
      onClick={() => navigate("/register")}
      className="btn btn-secondary"
    >
      Get Started
    </button>
  </>
) : role === "admin" ? (
  // Admin logged in
  <>
    <button
      onClick={() => navigate("/admin/dashboard")}
      className="btn btn-primary"
    >
      Manage System
    </button>
    <button
      onClick={handleLogout}
      className="btn btn-danger"
    >
      Logout
    </button>
  </>
) : (
  // Normal user logged in
  <>
    <button
      onClick={() =>
        navigate(
          `/uploads?user=${encodeURIComponent(user?.name || "guest")}&role=${encodeURIComponent(role)}`
        )
      }
      className="btn btn-primary"
    >
      My Uploads
    </button>
    <button
      onClick={() =>
        navigate(
          `/uploads-new-files?mode=${encodeURIComponent("new")}&user=${encodeURIComponent(user?.name || "guest")}`
        )
      }
      className="btn btn-secondary"
    >
      Upload New File
    </button>
    
  </>
)}

          
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImage} alt="Excel Analytics Hero" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FiBarChart2 size={50} color="#031dc5ff" />
            <h3>Interactive Charts</h3>
            <p>Create dynamic charts to visualize your Excel data instantly.</p>
          </div>
          <div className="feature-card">
            <FiFileText size={50} color="#031dc5ff" />
            <h3>Advanced Reports</h3>
            <p>Generate detailed reports and summaries from large datasets.</p>
          </div>
          <div className="feature-card">
            <FiGrid size={50} color="#031dc5ff" />
            <h3>Custom Dashboards</h3>
            <p>Build personalized dashboards to track KPIs and analytics metrics.</p>
          </div>
          <div className="feature-card">
            <FiShare2 size={50} color="#031dc5ff" />
            <h3>Export & Share</h3>
            <p>Export results and dashboards to Excel or PDF formats easily.</p>
          </div>
        </div>
      </section>

      <Visualizations />
      <Testimonials />

      
    </div>
  );
};

export default Home;
