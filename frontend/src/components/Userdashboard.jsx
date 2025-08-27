import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiFileText,
  FiTrendingUp,
  FiDownload,
  FiTrash2,
  FiUser,
  FiMail,
  FiLogOut,
} from "react-icons/fi";

import {
  Settings,       
 
  File,            
         
     
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploads(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, [token]);

  const handleAnalyze = async (file) => {
    setAnalyzingId(file._id);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/analyze/${file._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate("/excel-dashboard", { state: { data: res.data.data } });
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploads(uploads.filter((file) => file._id !== fileId));
      alert("File deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete file");
    }
  };

  const handleLogout = () => {
    ["token", "role", "user"].forEach((key) => localStorage.removeItem(key));
    navigate("/");
  };

  const totalFiles = uploads.length;
  const totalSize = uploads.reduce((acc, file) => acc + (file.size || 0), 0);

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-profile">
          <FiUser size={40} />
          <h3>{storedUser?.name || "User"}</h3>
          <p>
            <FiMail size={16} /> {storedUser?.email || "user@example.com"}
          </p>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/userdashboard")}><File></File> My Files</button>
          <button onClick={() => navigate("/account-settings")}><Settings></Settings>Settings</button>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <div className="dashboard-container">
        <h2>My Uploads</h2>
        <div className="summary-section">
          <div className="summary-card">
            <h3>Total Files</h3>
            <p>{totalFiles}</p>
          </div>
          <div className="summary-card">
            <h3>Total Size</h3>
            <p>{(totalSize / 1024).toFixed(2)} KB</p>
          </div>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : uploads.length === 0 ? (
          <p className="no-uploads">No uploads found.</p>
        ) : (
          <div className="uploads-grid">
            {uploads.map((file) => (
              <div className="upload-card" key={file._id}>
                <div className="upload-icon">
                  <FiFileText size={40} color="#ffffffff" />
                </div>
                <div className="upload-details">
                  <p className="file-name">{file.fileName}</p>
                  <p className="upload-info">
                    <strong>Uploaded At:</strong>{" "}
                    {new Date(file.createdAt).toLocaleString()}
                  </p>
                  {file.size && (
                    <p className="upload-info">
                      <strong>File Size:</strong>{" "}
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  )}
                  {file.type && (
                    <p className="upload-info">
                      <strong>File Type:</strong> {file.type}
                    </p>
                  )}
                </div>
                <div className="upload-actions">
                  <a href={file.filePath} target="_blank" rel="noreferrer">
                    <button className="btn btn-primary">
                      <FiDownload size={20} color="white" /> Download
                    </button>
                  </a>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleAnalyze(file)}
                    disabled={analyzingId === file._id}
                  >
                    {analyzingId === file._id ? (
                      "Analyzing..."
                    ) : (
                      <>
                        <FiTrendingUp size={20} color="black" /> Analyze
                      </>
                    )}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(file._id)}
                  >
                    <FiTrash2 size={20} color="white" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
