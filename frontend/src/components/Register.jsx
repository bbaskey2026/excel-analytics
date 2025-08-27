import React, { useState } from "react";
import axios from "axios";
import "./Register.css"; // import the CSS file
import { Navigate, useNavigate } from "react-router-dom";
const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      
      
      setForm({ name: "", email: "", password: "" });
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Error registering user");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-card">
        <h2 className="register-title">Register</h2>

        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="register-input"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="register-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="register-input"
        />

        <button type="submit" className="register-button">
          Register
        </button>
 <p className="auth-footer">
        All ready have an account? <span onClick={() => navigate("/login")} className="link">Login</span>
      </p>
        {message && <p className="register-message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
