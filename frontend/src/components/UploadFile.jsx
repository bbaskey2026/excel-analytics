import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiFileText, FiTrendingUp, FiTrash2 } from "react-icons/fi";
import "./UploadFile.css";


const UploadFile = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzingId, setAnalyzingId] = useState(null);
  
  const dropRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch uploaded files
  useEffect(() => {
    if (!token) return;
    const fetchFiles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedFiles(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFiles();
  }, [token]);

  // Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    dropRef.current.classList.add("drag-active");
  };

  const handleDragLeave = () => {
    dropRef.current.classList.remove("drag-active");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("drag-active");
    handleFileChange(e);
  };

  // File selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.dataTransfer?.files || e.target.files);
    const validFiles = selectedFiles.filter((file) => /\.(xlsx|csv)$/i.test(file.name));
    if (validFiles.length !== selectedFiles.length) {
      setError("Only .xlsx and .csv files are allowed");
    } else {
      setError("");
    }
    setFiles(validFiles);
  };

  // Upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select files to upload");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTimeout(() => setIsModalOpen(true), 10000);

      const res = await axios.get("http://localhost:5000/api/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUploadedFiles(res.data);
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete file
  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/delete/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedFiles(uploadedFiles.filter((file) => file._id !== fileId));
      alert("File deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete file");
    }
  };

  // Analyze
  const handleAnalyze = async (file) => {
    setAnalyzingId(file._id || "selected");
    setError("");

    try {
      const formData = new FormData();

      if (file.raw) {
        formData.append("file", new Blob([file.raw]), file.fileName);
      } else if (file.data && file.data.length > 0) {
        const csvContent = [
          Object.keys(file.data[0]).join(","),
          ...file.data.map((row) => Object.values(row).join(",")),
        ].join("\n");
        formData.append("file", new Blob([csvContent]), file.fileName);
      } else {
        formData.append("file", file);
      }

      const endpoint = file._id
        ? `http://localhost:5000/api/analyze/${file._id}`
        : `http://localhost:5000/api/analyze`;

      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/excel-dashboard", { state: { data: res.data.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="upload-container">
     

      {/* Hero Section */}
      <section className="hero">
        
<div
  className="file-drop-area"
  ref={dropRef}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={(e) => {
    if (e.target === dropRef.current) {
      document.getElementById("file-input").click();
    }
  }}

>
        

          <FiUpload size={50} />
          <p>Drag & Drop files here or click to select</p>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".xlsx,.csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <button className="btn primary" onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload Files"}
          </button>

          {files.length > 0 && (
            <button
              className="btn success"
              onClick={() => files.forEach((file) => handleAnalyze(file))}
              disabled={analyzingId !== null}
            >
              {analyzingId === "selected" ? "Analyzing..." : "Analyze Selected Files"}
            </button>
          )}
          {error && <p className="error">{error}</p>}
        </div>

<div className="instructions">
          <h3>How to Upload Your Files</h3>
          <p>Drag & drop your Excel (.xlsx) or CSV (.csv) files below, or click to select from your computer.</p>
          <p>After uploading, files appear in "My Uploads". Click "Analyze" to process data and get insights.</p>
          <p>Ensure files are properly formatted with headers in the first row for accurate analysis.</p>
        </div>




      </section>




     
      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <section className="uploads">
          <h3>My Uploads</h3>
          <div className="uploads-grid">
            {uploadedFiles.map((file) => (
              <div className="file-card" key={file._id}>
                <div className="file-info">
                  <FiFileText size={24}  color="yellow"/>
                  <span>{file.fileName}</span>
                </div>
                <div className="file-actions">
                  <button
                    className="btn success"
                    onClick={() => handleAnalyze(file)}
                    disabled={analyzingId === file._id}
                  >
                    {analyzingId === file._id ? "Analyzing..." : <><FiTrendingUp /> Analyze</>}
                  </button>
                  <button className="btn danger" onClick={() => handleDelete(file._id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default UploadFile;
