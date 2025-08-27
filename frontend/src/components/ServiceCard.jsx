import React from "react";

const ServiceCard = ({ title, description, icon }) => {
  return (
    <div
      style={{
        
        borderRadius: "1px",
        padding: "20px",
        margin: "15px",
        width: "280px",
        backgroundColor: "#02096fff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        transition: "0.3s",
      }}
    >
      {icon && (
        <div style={{ fontSize: "40px", marginBottom: "12px", color: "#4CAF50" }}>
          {icon}
        </div>
      )}
      <h3 style={{ marginBottom: "10px", color: "#ffffffff" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: "#ffffffff", marginBottom: "15px" }}>
        {description}
      </p>
     
    </div>
  );
};

const Services = () => {
  const serviceList = [
    {
      title: "Data Cleaning",
      description: "Automatically clean and format raw Excel data into structured reports.",
      icon: "🧹",
    },
    {
      title: "Visualization Dashboard",
      description: "Turn Excel sheets into interactive charts and visual dashboards.",
      icon: "📊",
    },
    {
      title: "Automated Reports",
      description: "Generate recurring Excel reports with a single click.",
      icon: "⚡",
    },
    {
      title: "Data Insights",
      description: "Apply analytics on your Excel data to extract hidden trends.",
      icon: "🔍",
    },
    {
      title: "Export & Sharing",
      description: "Export Excel reports to PDF or share dashboards securely online.",
      icon: "📤",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {serviceList.map((service, index) => (
        <ServiceCard
          key={index}
          title={service.title}
          description={service.description}
          icon={service.icon}
        />
      ))}
    </div>
  );
};

export default Services;
