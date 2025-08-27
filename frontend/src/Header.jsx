import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Navigation from "./Navigation";
import ServiceCard from "./ServiceCard";
import UploadFile from "./UploadFile";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: 0,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)'
  };

  const uploadButtonStyle = {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setShowLogin(false);
    setLoginData({ email: "", password: "" });
  };

  const handleRegisterSuccess = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setShowRegister(false);
    setRegisterData({ name: "", email: "", password: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <>
      <header style={headerStyle}>
        <Navigation 
          onLoginClick={() => setShowLogin(true)}
          onRegisterClick={() => setShowRegister(true)}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
        />
      </header>

      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <LoginForm 
          loginData={loginData}
          setLoginData={setLoginData}
          onSubmit={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      </Modal>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <RegisterForm 
          registerData={registerData}
          setRegisterData={setRegisterData}
          onSubmit={handleRegisterSuccess}
          onClose={() => setShowRegister(false)}
        />
      </Modal>

      {isAuthenticated ? (
        <>
          <UploadFile />
          <ServiceCard />
        </>
      ) : (
        <div style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: '#f8fafc',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Welcome to MyApp
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            marginBottom: '2rem',
            maxWidth: '600px'
          }}>
            Your all-in-one platform for managing services and file uploads. 
            Sign in to get started or create a new account.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => setShowLogin(true)}
              style={{
                ...uploadButtonStyle,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff'
              }}
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowRegister(true)}
              style={{
                ...uploadButtonStyle,
                background: 'white',
                color: '#667eea',
                border: '2px solid #667eea'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
