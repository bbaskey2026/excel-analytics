import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import axios from "axios";
import "./Footer.css";
const apiUrl = import.meta.env.VITE_API_URL;
const Footer = () => {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
const messages = [
  " Thanks for subscribing!",
  "You're all set! Enjoy your subscription.",
  "Subscription successful!",
  "Welcome aboard! Subscription activated.",
  "Tip: Check out your dashboard for insights."
];
  const handleSubscribe = async (e) => {
     const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    e.preventDefault();
    if (!email) {
      setMessage("Please enter a valid email.");
      setShowModal(true);
      return;
    }

    try {
      // Call backend API to save subscription
      await axios.post(`${apiUrl}/api/subscriber`, { email });

      setMessage(randomMessage);
      setShowModal(true);
      setEmail("");
    } catch (err) {
      console.error(err);
      setMessage("Subscription failed. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <>
      <footer className="home-footer">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-about">
            <h3>Excel Analytics</h3>
            <p>
              Transform your Excel data into actionable insights. Analyze,
              visualize, and share with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-of-service">Terms of Service</a></li>
              <li><a href="/support">Support</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-socials">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>Newsletter</h4>
            <p>Subscribe to get the latest updates and features.</p>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Excel Analytics. All rights reserved.</p>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{message}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
