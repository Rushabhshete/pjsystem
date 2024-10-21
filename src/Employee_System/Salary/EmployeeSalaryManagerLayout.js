import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";


const navItemStyle = {
  padding: "3px 8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  flex: 1,
  transition: "background-color 0.3s ease, color 0.3s ease",
  textDecoration: "none", // Remove underline
};

// Styles for active item
const activeNavItemStyle = {
  ...navItemStyle,
  backgroundColor: "#3498DB",
  color: "white",
  borderRadius: "30px",
  transform: "scale(1.05)", // Slight increase for active state
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for active
};

// Styles for the subnavbar container
const subNavBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
  backgroundColor: "#f0f0f0",
  padding: "8px",
  borderRadius: "30px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Slight shadow for navbar
};


const EmployeeSalaryManagerLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Sub-navbar for the EmployeeSalaryManager */}
      <div style={subNavBarStyle}>
        <Link to="/layout/employee-salary-manager" style={isActive("/layout/employee-salary-manager") ? activeNavItemStyle : navItemStyle}>
          Dashboard
        </Link>
        <Link to="/layout/employee-salary-manager/add-detail" style={isActive("/layout/employee-salary-manager/add-detail") ? activeNavItemStyle : navItemStyle}>
          Add Salary
        </Link>
        <Link to="/layout/employee-salary-manager/salary-list" style={isActive("/layout/employee-salary-manager/salary-list") ? activeNavItemStyle : navItemStyle}>
          Salary List
        </Link>
      </div>

      {/* This is where the content of each route will be displayed */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeSalaryManagerLayout;
