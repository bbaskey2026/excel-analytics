import React, { useState } from "react";

const ContactCard = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    setMessage("Thanks for contacting us!");
    setTimeout(() => setMessage(""), 3000); // Hide after 3 seconds
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "1px",
    padding: "20px",
    margin: "15px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    background: "#f9f9f9",
    width: "300px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  };

  const headingStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#2c3e50"
  };

  const infoStyle = {
    margin: "8px 0",
    fontSize: "16px",
    color: "#555"
  };

  const btnStyle = {
    marginTop: "15px",
    padding: "10px 20px",
    background: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "1px",
    cursor: "pointer",
    fontSize: "14px"
  };

  const messageStyle = {
    marginTop: "12px",
    color: "green",
    fontWeight: "bold",
    fontSize: "14px"
  };

  return (
    <div style={cardStyle}>
      <h3 style={headingStyle}>📞 Contact Us</h3>
      <p style={infoStyle}><b>Email:</b> support@excelanalytics.com</p>
      <p style={infoStyle}><b>Phone:</b> +91 1234567890</p>
      <p style={infoStyle}><b>Address:</b> 123 Tech Park, Bhubaneswar, India</p>
      <button onClick={handleSend} style={btnStyle}>Send Message</button>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default ContactCard;
