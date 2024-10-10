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
  textDecoration: "none", // Remove underline
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

const EmployeeManagerLayout = () => {
  const location = useLocation();

  // Function to check if the current route matches
  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Sub-navbar for Employee Manager */}
      <div style={subNavBarStyle}>
        <Link to="/layout/employee-manager" style={isActive("/layout/employee-manager") ? activeNavItemStyle : navItemStyle}>
          Dashboard
        </Link>
        <Link to="/layout/employee-manager/add-employee" style={isActive("/layout/employee-manager/add-employee") ? activeNavItemStyle : navItemStyle}>
          Add Employee
        </Link>
        <Link to="/layout/employee-manager/add-category" style={isActive("/layout/employee-manager/add-category") ? activeNavItemStyle : navItemStyle}>
          Add Category
        </Link>
        <Link to="/layout/employee-manager/add-department" style={isActive("/layout/employee-manager/add-department") ? activeNavItemStyle : navItemStyle}>
          Add Department
        </Link>
        <Link to="/layout/employee-manager/manage-holiday" style={isActive("/layout/employee-manager/manage-holiday") ? activeNavItemStyle : navItemStyle}>
          Manage Holiday
        </Link>
        <Link to="/layout/employee-manager/employee-list" style={isActive("/layout/employee-manager/employee-list") ? activeNavItemStyle : navItemStyle}>
          Employee List
        </Link>
        <Link to="/layout/employee-manager/emp-report" style={isActive("/layout/employee-manager/emp-report") ? activeNavItemStyle : navItemStyle}>
          Employee Report
        </Link>
      </div>

      {/* This is where the content of each route will be displayed */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeManagerLayout;
