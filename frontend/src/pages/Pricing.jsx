// pages/Pricing.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Pricing.css";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["Basic analytics", "Limited uploads", "Community support"],
    buttonText: "Get Started",
    buttonClass: "btn-primary",
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    features: ["Advanced analytics", "Unlimited uploads", "Priority support", "Custom dashboards"],
    buttonText: "Upgrade",
    buttonClass: "btn-secondary",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 0, // Custom pricing handled in payment page
    features: ["Full access to all features", "Dedicated account manager", "Custom integrations", "24/7 support"],
    buttonText: "Contact Sales",
    buttonClass: "btn-primary",
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleBuyPlan = async (plan) => {
    if (!token) {
      alert("Please login first!");
      return;
    }

    setLoading(true);

    try {
      // Fake payment navigation page
      navigate("/payment", { state: { plan } });
    } catch (err) {
      console.error(err);
      alert("Error initiating plan purchase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pricing-page">
      <h2 className="pricing-title">Our Pricing Plans</h2>
      <p className="pricing-subtitle">Choose a plan that fits your needs</p>

      <div className="pricing-cards">
        {plans.map((plan) => (
          <div key={plan.name} className="pricing-card">
            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-price">{plan.price === 0 ? "Contact Us" : `$${plan.price}/mo`}</p>
            <ul className="plan-features">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button
              className={`pricing-btn ${plan.buttonClass}`}
              onClick={() => handleBuyPlan(plan)}
              disabled={loading}
            >
              {loading ? "Processing..." : plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
