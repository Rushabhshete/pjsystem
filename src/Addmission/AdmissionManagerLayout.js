import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

// Styles for each navbar item
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
  
  // Styles for active item
  const activeNavItemStyle = {
    ...navItemStyle,
    backgroundColor: "#624E88",
    color: "white",
    borderRadius: "35px",
    transform: "scale(1.05)", // Slight increase for active state
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for active
  };
  
  // Styles for the subnavbar container
  const subNavBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    backgroundColor: "#f0f0f0",
    padding: "10px",
    borderRadius: "35px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Slight shadow for navbar
  };

const AdmissionManagerLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Sub-navbar for the AdmissionManager */}
      <div style={subNavBarStyle}>
        <Link to="/layout/Admission-manager" style={isActive("/layout/Admission-manager") ? activeNavItemStyle : navItemStyle}>
          Dashboard
        </Link>
        <Link to="/layout/Admission-manager/admission-form" style={isActive("/layout/Admission-manager/admission-form") ? activeNavItemStyle : navItemStyle}>
          Admission Form
        </Link>
        <Link to="/layout/Admission-manager/add-course" style={isActive("/layout/Admission-manager/add-course") ? activeNavItemStyle : navItemStyle}>
          Add Course
        </Link>
        <Link to="/layout/Admission-manager/add-source" style={isActive("/layout/Admission-manager/add-source") ? activeNavItemStyle : navItemStyle}>
          Add Source
        </Link>
        <Link to="/layout/Admission-manager/add-guide" style={isActive("/layout/Admission-manager/add-guide") ? activeNavItemStyle : navItemStyle}>
          Add Guide
        </Link>
        <Link to="/layout/Admission-manager/student-list" style={isActive("/layout/Admission-manager/student-list") ? activeNavItemStyle : navItemStyle}>
          Student List
        </Link>
      </div>

      {/* This is where the content of each route will be displayed */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdmissionManagerLayout;
