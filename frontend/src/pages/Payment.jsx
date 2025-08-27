// pages/Payment.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const plan = location.state?.plan;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!plan || !token) {
      navigate("/pricing");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user details");
        navigate("/pricing");
      }
    };

    fetchUser();
  }, [plan, token, navigate]);

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // Fake payment delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Call backend to save plan
      const res = await axios.post(
        `${apiUrl}/api/buy-plan`,
        {
          id: plan.id,
          name: plan.name,
          price: plan.price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Payment successful! Plan ${res.data.plan.name} activated.`);
      navigate("/uploads");
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <p
        style={{
          height: "100vh",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#1e40af",
          color: "#ffffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        Loading user info...
      </p>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1e40af",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e3a8a",
          padding: "30px",
          borderRadius: "1px",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0)",
          color: "#ffffff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#fff" }}>
          Confirm Your Subscription
        </h2>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "8px", color: "#ffffffff" }}>User Details</h3>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "8px", color: "#ffffffff" }}>Plan Details</h3>
          <p>
            <strong>Plan:</strong> {plan.name}
          </p>
          <p>
            <strong>Price:</strong>{" "}
            {plan.price === 0 ? "Contact Us" : `$${plan.price}/mo`}
          </p>
        </div>

        <button
          onClick={handleConfirmPayment}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#ff7700ff",
            color: "#fefefeff",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "1px",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          {loading ? "Processing Payment..." : "Confirm & Pay"}
        </button>

        {/* 100% Secure Payments text */}
        <p style={{ marginTop: "12px", textAlign: "center", color: "#facc15", fontWeight: "600" }}>
          100% Secure Payments
        </p>
      </div>
    </div>
  );
};

export default Payment;
