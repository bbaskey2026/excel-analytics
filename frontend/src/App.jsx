import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import FileList from "./components/FileList";
import Dashboard from "./components/Dashboard";
import Userdashboard from "./components/Userdashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import UploadFile from "./components/UploadFile";
import Pricing from "./pages/Pricing";

import Payment from "./pages/Payment";
import ServiceCard from "./components/ServiceCard";
import ContactCard from "./components/ContactCard";
const App = () => { 
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAuth = !!token;

  return (
    <Router>
      <Header></Header>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/role-redirect" />} />
        <Route path="/register" element={!isAuth ? <Signup /> : <Navigate to="/role-redirect" />} />
 <Route path="/pricing" element={<Pricing />} />
<Route path="/features" element={<ServiceCard />} />
<Route path="/contact" element={<ContactCard/>} />


 
        {/* Role-based redirect route */}
        <Route
          path="/role-redirect"
          element={
            isAuth ? (
              role === "admin" ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <Navigate to="/uploads" />
              )
            ) : (
              <Navigate to="/register" />
            )
          }
        />













        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"element={isAuth && role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/uploads"element={isAuth && role === "user" ? <FileList /> : <Navigate to="/login" />}
        />
       <Route path="/excel-dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
        />
 <Route
          path="/uploads-new-files"element={isAuth && role === "user" ? <UploadFile /> : <Navigate to="/login" />}
        />
        <Route path="/userdashboard" element={<Userdashboard />} />
        <Route path="/payment" element={<Payment />} />
        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
};

export default App;
