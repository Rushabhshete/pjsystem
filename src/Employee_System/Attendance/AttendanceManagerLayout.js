import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

// Base styles for the navbar items
const navItemStyle = {
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  flex: 1,
  transition: "background-color 0.3s ease, color 0.3s ease",
};

// Active item styles
const activeNavItemStyle = {
  ...navItemStyle,
      backgroundColor: "#3498DB",
  color: "white",
  borderRadius: "35px",
  transform: "scale(1.05)", // Slight increase for active state
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for active
};

// Subnavbar container style
const subNavBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "20px",
  backgroundColor: "#f0f0f0",
  padding: "10px",
  borderRadius: "35px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Slight shadow for navbar
};

const AttendanceManagerLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Sub-navbar for Attendance Manager */}
      <div style={subNavBarStyle}>
        <Link to="/layout/attendance-manager" style={isActive("/layout/attendance-manager") ? activeNavItemStyle : navItemStyle}>
          Dashboard
        </Link>
        <Link to="/layout/attendance-manager/manage-attendance" style={isActive("/layout/attendance-manager/manage-attendance") ? activeNavItemStyle : navItemStyle}>
          Attendance Report
        </Link>
      </div>

      {/* Render the selected component based on the route */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AttendanceManagerLayout;
