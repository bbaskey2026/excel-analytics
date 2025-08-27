import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found, please login first");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${apiUrl}/api/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFiles(res.data);
      } catch (err) {
        console.error("Error fetching files:", err);
        alert("Failed to fetch files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading)
    return (
      <p style={{ textAlign: "center", fontSize: "1.2rem", marginTop: "2rem" }}>
        Loading files...
      </p>
    );

  return (
    <div className="no-uploads"
    style={{background:"blue",color:"white"}}
    >
    <div 
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#ffffffff",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2rem",
          color: "#ffffffff",
        }}
      >
        Uploaded Files
      </h2>

      {files.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1rem" }}>
          No files uploaded yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {files.map((file) => (
            <div
              key={file.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0px)")
              }
            >
              <h3 style={{ marginBottom: "0.8rem", color: "#050aff" }}>
                {file.fileName}
              </h3>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong style={{ color: "#4facfe" }}>Type:</strong>{" "}
                {file.fileType}
              </p>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong style={{ color: "#4facfe" }}>Uploaded:</strong>{" "}
                {file.uploadDate
                  ? new Date(file.uploadDate).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

    </div>
  );
};

export default FileList;
