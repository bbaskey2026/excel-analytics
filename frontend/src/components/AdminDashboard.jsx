import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiFile,
  FiDatabase,
  FiUser,
  FiClock,
  FiTrash2,
  FiSlash,
} from "react-icons/fi";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // -------- Styles --------
  const containerStyle = {
    padding: "20px",
    backgroundColor:"blue"
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "40px",
    color: "#ffffffff",
  };

  const loadingStyle = {
    fontSize: "20px",
    color:"black",
    textAlign: "center",
  };

  const errorStyle = {
    color: "red",
    textAlign: "center",
    fontSize: "16px",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  };

  const cardStyle = {
    backgroundColor: "#071eb3ff",
    borderRadius: "1px",
    padding: "20px",
    border:"1px solid #180ae5ff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const cardTitleStyle = {
    color: "#ffffffff",
    margin: "0 0 10px 0",
  };

  const cardTextStyle = {
    margin: "5px 0",
    display: "flex",
    alignItems: "center",
    color:"white",
  };

  const iconStyle = {
    marginRight: "5px",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  };

  const deleteButtonStyle = {
    flex: 1,
    backgroundColor: "#f30202ff",
    color: "#ffffffff",
    border: "none",
    padding: "8px",
    borderRadius: "1px",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  };

  const blockButtonStyle = {
    flex: 1,
    backgroundColor: "#000000ff",
    color: "#ffffffff",
    border: "none",
    padding: "8px",
    borderRadius: "1px",
    cursor: "pointer",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  };

  const getBlockButtonStyle = (isBlocked) => ({
    ...blockButtonStyle,
    backgroundColor: isBlocked ? "#facc15" : "#000000ff",
  });

  const sectionStyle = {
    marginTop: "20px",
  };

  const sectionTitleStyle = {
    color: "#0369a1",
    marginBottom: "15px",
  };

  const listContainerStyle = {
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const listHeaderStyle = {
    backgroundColor: "#0284c7",
    color: "#fff",
    fontWeight: "600",
    padding: "15px 20px",
    display: "grid",
    gap: "15px",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const usersHeaderStyle = {
    ...listHeaderStyle,
    gridTemplateColumns: "1fr 2fr 1fr",
  };

  const filesHeaderStyle = {
    ...listHeaderStyle,
    gridTemplateColumns: "1fr 2fr 2fr 1fr 1.5fr",
  };

  const listItemStyle = {
    padding: "15px 20px",
    borderBottom: "1px solid #e5e7eb",
    display: "grid",
    gap: "15px",
    alignItems: "center",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  };

  const userItemStyle = {
    ...listItemStyle,
    gridTemplateColumns: "1fr 2fr 1fr",
  };

  const fileItemStyle = {
    ...listItemStyle,
    gridTemplateColumns: "1fr 2fr 2fr 1fr 1.5fr",
  };

  const listItemHoverStyle = {
    backgroundColor: "#f9fafb",
  };

  const itemFieldStyle = {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const noDataStyle = {
    padding: "40px 20px",
    textAlign: "center",
    color: "#0909e2ff",
    fontStyle: "italic",
  };

  const accessDeniedStyle = {
    textAlign: "center",
    fontSize: "18px",
    color: "#dc2626",
    padding: "40px",
  };

  useEffect(() => {
    if (!token || role !== "admin") return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, filesRes, analyticsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/files", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/analytics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setFiles(filesRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, role]);

  // -------- Handlers --------
  const handleDelete = async (userId, userRole) => {
    if (userRole === "admin") {
      alert("Admin users cannot be deleted");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(analytics.filter((u) => u.id !== userId));
      setUsers(users.filter((u) => u._id !== userId));
      setFiles(files.filter((f) => f.userId !== userId));
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const handleBlock = async (userId, currentStatus, userRole) => {
    if (userRole === "admin") {
      alert("Admin users cannot be blocked");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/user/block/${userId}`,
        { block: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalytics(
        analytics.map((u) =>
          u.id === userId ? { ...u, blocked: !currentStatus } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating block status");
    }
  };

  // -------- Helpers --------
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
  };

  // -------- Render --------
  if (!token || role !== "admin") {
    return <p style={accessDeniedStyle}>Please login as admin to access dashboard.</p>;
  }

  return (
    <div style={containerStyle}>
      
      <h2 style={titleStyle}>Admin Dashboard</h2>

      {loading && <p style={loadingStyle}>Loading data...</p>}
      {error && <p style={errorStyle}>{error}</p>}

      {/* --- Total Uploads Summary --- */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center", marginBottom: "40px", flexWrap: "wrap" }}>
        <div style={{ 
          backgroundColor: "#02071bff", 
          color: "#fff", 
          padding: "20px", 
          borderRadius: "2px", 
          minWidth: "150px", 
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}>
          <h3>
            <FiFile style={iconStyle} />
            Total Files
          </h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>{files.length}</p>
        </div>
        <div style={{ 
          backgroundColor: "#ff0000ff", 
          color: "#fff", 
          padding: "20px", 
          borderRadius: "1px", 
          minWidth: "150px", 
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}>
          <h3>
            <FiDatabase style={iconStyle} />
            Total Size
          </h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "600" }}>
            {files.reduce((acc, f) => acc + (f.size || 0), 0) / 1024 > 1024
              ? `${(files.reduce((acc, f) => acc + (f.size || 0), 0) / 1024 / 1024).toFixed(2)} MB`
              : `${(files.reduce((acc, f) => acc + (f.size || 0), 0) / 1024).toFixed(2)} KB`}
          </p>
        </div>
      </div>

      {/* --- Analytics Cards --- */}
      <div style={gridStyle}>
        {analytics.map((user) => (
          <div key={user.id} style={cardStyle}>
            <h3 style={cardTitleStyle}>{user.name}</h3>
            <p style={cardTextStyle}>
              <FiUser style={iconStyle} /> {user.email}
            </p>
            <p style={cardTextStyle}>
              <strong>Role:</strong> {user?.role}
            </p>
            <p style={cardTextStyle}>
              <FiFile style={iconStyle} /> Files Uploaded: {user.fileCount}
            </p>
            <p style={cardTextStyle}>
  <FiDatabase style={iconStyle} /> Total Size: {user.totalFileSize}
</p>


            <p style={cardTextStyle}>
              <FiClock style={iconStyle} /> Created At:{" "}
              {new Date(user.createdAt).toLocaleString()}
            </p>
            <p style={cardTextStyle}>
              <FiClock style={iconStyle} /> Last Login:{" "}
              {user.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : "N/A"}
            </p>
            <div style={buttonContainerStyle}>
              <button
                style={deleteButtonStyle}
                onClick={() => handleDelete(user.id, user.role)}
              >
                <FiTrash2 /> Delete
              </button>

              <button
                style={getBlockButtonStyle(user.blocked)}
                onClick={() => handleBlock(user.id, user.blocked, user.role)}
              >
                <FiSlash /> {user.blocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Users List --- */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>All Users</h3>
        <div style={listContainerStyle}>
          <div style={usersHeaderStyle}>
            <div>ID</div>
            <div>Email</div>
            <div>Role</div>
          </div>
          {users.length === 0 ? (
            <div style={noDataStyle}>No users found</div>
          ) : (
            users.map((u) => (
              <div 
                key={u._id} 
                style={userItemStyle}
                onMouseEnter={(e) => {
                  const currentTarget = e.currentTarget;
                  currentTarget.style.backgroundColor = listItemHoverStyle.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  const currentTarget = e.currentTarget;
                  currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={itemFieldStyle} title={u._id}>{u._id}</div>
                <div style={itemFieldStyle} title={u.email}>{u.email}</div>
                <div style={itemFieldStyle}>{u.role}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Files List --- */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>All Uploaded Files</h3>
        <div style={listContainerStyle}>
          <div style={filesHeaderStyle}>
            <div>ID</div>
            <div>File Name</div>
            <div>User Email</div>
            <div>Size</div>
            <div>Upload Date</div>
          </div>
          {files.length === 0 ? (
            <div style={noDataStyle}>No files found</div>
          ) : (
            files.map((f) => (
              <div 
                key={f._id} 
                style={fileItemStyle}
                onMouseEnter={(e) => {
                  const currentTarget = e.currentTarget;
                  currentTarget.style.backgroundColor = listItemHoverStyle.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  const currentTarget = e.currentTarget;
                  currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={itemFieldStyle} title={f._id}>{f._id}</div>
                <div style={itemFieldStyle} title={f.fileName}>{f.fileName}</div>
                <div style={itemFieldStyle} title={f.user?.email}>{f.user?.email || 'N/A'}</div>
                <div style={itemFieldStyle}>{formatSize(f.size)}</div>
                <div style={itemFieldStyle}>{new Date(f.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;