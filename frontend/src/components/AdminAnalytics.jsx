import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiFile, FiDatabase, FiUser, FiClock, FiTrash2, FiSlash } from "react-icons/fi";
const apiUrl = import.meta.env.VITE_API_URL;
const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  // Handle Delete User
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${apiUrl}/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(analytics.filter((u) => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  // Handle Block/Unblock User
  const handleBlock = async (userId, currentStatus) => {
    try {
      await axios.patch(
        `${apiUrl}/api/admin/user/block/${userId}`,
        { block: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(
        analytics.map((u) => (u.id === userId ? { ...u, blocked: !currentStatus } : u))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating block status");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#0284c7" }}>
        Admin User Analytics
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {analytics.map((user) => (
          <div
            key={user.id}
            style={{
              backgroundColor: "#f0f9ff",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h3 style={{ color: "#0369a1" }}>{user.name}</h3>
            <p>
              <FiUser style={{ marginRight: "5px" }} /> {user.email}
            </p>
            <p><strong>Role:</strong> {user.role}</p>
            <p>
              <FiFile style={{ marginRight: "5px" }} /> Files Uploaded: {user.fileCount}
            </p>
            <p>
              <FiDatabase style={{ marginRight: "5px" }} /> Total Size: {formatSize(user.totalFileSize)}
            </p>
            <p>
              <FiClock style={{ marginRight: "5px" }} /> Created At: {new Date(user.createdAt).toLocaleString()}
            </p>
            <p>
              <FiClock style={{ marginRight: "5px" }} /> Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={() => handleDelete(user.id)}
              >
                <FiTrash2 /> Delete
              </button>

              <button
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  backgroundColor: user.blocked ? "#facc15" : "#0284c7",
                  color: "#fff",
                  border: "none",
                  padding: "8px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={() => handleBlock(user.id, user.blocked)}
              >
                <FiSlash /> {user.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
