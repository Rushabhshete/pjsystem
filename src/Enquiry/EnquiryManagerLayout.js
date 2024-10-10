import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

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
  textDecoration: "none", // Remove underline
};

// Styles for active item
const activeNavItemStyle = {
  ...navItemStyle,
  backgroundColor: "#3498DB",
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

const EnquiryManagerLayout = () => {
  const [activeComponent, setActiveComponent] = useState("DashBoard");

  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      {/* Mini navbar (subnavbar) */}
      <div style={subNavBarStyle}>
        <Link to="/layout/enquiry-manager" style={activeComponent === "DashBoard" ? activeNavItemStyle : navItemStyle} onClick={() => handleNavClick("DashBoard")}>
          Dashboard
        </Link>
        <Link to="add-inquiry" style={activeComponent === "AddInquiry" ? activeNavItemStyle : navItemStyle} onClick={() => handleNavClick("AddInquiry")}>
          Add Enquiry
        </Link>
        <Link to="report" style={activeComponent === "Report" ? activeNavItemStyle : navItemStyle} onClick={() => handleNavClick("Report")}>
          Enquiry List
        </Link>
        <Link to="exam" style={activeComponent === "Exam" ? activeNavItemStyle : navItemStyle} onClick={() => handleNavClick("Exam")}>
          Add Exam/Course
        </Link>
        <Link to="source" style={activeComponent === "Source" ? activeNavItemStyle : navItemStyle} onClick={() => handleNavClick("Source")}>
          Add Source
        </Link>
        <Link to="conduct" style={activeComponent === "Conduct" ? activeNavItemStyle : navItemStyle} onClick={() => handleNavClick("Conduct")}>
          Add Conduct
        </Link>
      </div>

      {/* Render the selected component */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default EnquiryManagerLayout;
