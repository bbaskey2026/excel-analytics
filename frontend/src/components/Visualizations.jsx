import React from "react";
import "./Visualizations.css";

const visualizations = [
  {
    title: "Interactive Donut Charts",
    description: "Visualize data distributions with colorful, interactive donut charts.",
    features: [
      "Highlight key segments dynamically",
      "Hover for detailed info",
      "Customizable colors and labels",
    ],
    img: "/src/assets/excel.jpg",
  },
  {
    title: "3D Charts & Graphs",
    description: "Analyze complex datasets using immersive 3D charts and graphs.",
    features: [
      "Rotate and zoom 3D charts",
      "Multi-axis support",
      "Smooth transitions",
    ],
    img: "/src/assets/3d.jpg",
  },
  {
    title: "Pivot Tables",
    description: "Summarize and manipulate large datasets efficiently using pivot tables.",
    features: [
      "Drag & drop fields",
      "Automatic aggregation",
      "Filter and group data easily",
    ],
    img: "/src/assets/pivot.png",
  },
  {
    title: "Heatmaps",
    description: "Quickly identify patterns, trends, and outliers in your data.",
    features: [
      "Color-coded intensity",
      "Highlight anomalies",
      "Time-based patterns",
    ],
    img: "/src/assets/excel.jpg",
  },
  {
    title: "Time Series Graphs",
    description: "Track trends over time with line and area charts.",
    features: [
      "Zoom into specific periods",
      "Overlay multiple datasets",
      "Highlight peaks and troughs",
    ],
    img: "/src/assets/timeseries.jpg",
  },
];

const Visualizations = () => {
  return (
    <section className="visualizations-section">
      <h2>Data Visualizations</h2>
      <div className="visualizations-list">
        {visualizations.map((viz, index) => (
          <div
            key={index}
            className={`viz-card ${index % 2 === 1 ? "reverse" : ""}`}
          >
            <div className="viz-image">
              <img src={viz.img} alt={viz.title} />
            </div>
            <div className="viz-text">
              <h3>{viz.title}</h3>
              <p>{viz.description}</p>
              <ul>
                {viz.features.map((feat, idx) => (
                  <li key={idx}>• {feat}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Visualizations;
