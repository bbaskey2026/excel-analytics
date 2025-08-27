// components/NavLinkButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NavLinkButton = ({ name, path, className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className={`nav-link ${className}`}
    >
      {name}
    </button>
  );
};

export default NavLinkButton;
