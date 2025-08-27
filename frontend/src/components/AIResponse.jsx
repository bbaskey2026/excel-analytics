import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AIResponse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result || "";
  const data = location.state?.data || [];

  if (!result) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>No AI analysis found. Go back and analyze data first.</h2>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", marginTop: "20px" }}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px" }}>
      <h2>AI Analysis Result</h2>
      <p style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: "15px", borderRadius: "8px", border: "1px solid #ccc" }}>
        {result}
      </p>
      <button onClick={() => navigate("/dashboard", { state: { data } })} style={{ marginTop: "20px", padding: "10px 20px", background: "#667eea", color: "white", border: "none", borderRadius: "8px" }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default AIResponse;
