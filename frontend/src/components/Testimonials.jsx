import React from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import "./Testimonials.css";

const testimonialsData = [
  {
    name: "Ayushi Sharma",
    role: "Data Analyst",
    text: "Excel Analytics made my data analysis tasks effortless. The charts and dashboards are simply amazing!",
    avatar: "https://i.pravatar.cc/100?img=1",
  },


  {
    name: "Bhima Patel",
    role: "Data Analyst",
    text: "Excel Analytics made my data analysis tasks effortless. The charts and dashboards are simply amazing!",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Aditya",
    role: "Data Analyst",
    text: "Excel Analytics made my data analysis tasks effortless. The charts and dashboards are simply amazing!",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "RamChandra",
    role: "Finance Manager",
    text: "I can now generate reports in minutes instead of hours. Highly recommend it for any Excel user.",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Sita Devi",
    role: "Project Lead",
    text: "The export and sharing features are fantastic. Collaborating with my team has never been easier.",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <h2>What Our Users Say</h2>
      <div className="testimonials-grid">
        {testimonialsData.map((t, index) => (
          <div key={index} className="testimonial-card">
            <FaQuoteLeft className="quote-icon left" />
            <p className="testimonial-text">{t.text}</p>
            <FaQuoteRight className="quote-icon right" />
            <div className="testimonial-user">
              <img src={t.avatar} alt={t.name} className="testimonial-avatar" />
              <div>
                <h4>{t.name}</h4>
                <span>{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
