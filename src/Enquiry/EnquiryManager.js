import React, { useState } from "react";
import DashBoard from "./DashBoard";
import AddInquiry from "./pages/AddInquiry";
import Report from "./Report";
import Exam from "./ExamPages/Exam";
import Source from "./ConductBy/Sources/Source";
import Conduct from "./ConductBy/Conduct";

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

const EnquiryManager = () => {
  const [activeComponent, setActiveComponent] = useState("DashBoard");

  const components = {
    DashBoard: <DashBoard />,
    AddInquiry: <AddInquiry />,
    Exam: <Exam />,
    Source: <Source />,
    Conduct: <Conduct />,
    Report: <Report />,
  };

  return (
    <div>
      {/* Mini navbar (subnavbar) */}
      <div style={subNavBarStyle}>
        <div
          style={
            activeComponent === "DashBoard" ? activeNavItemStyle : navItemStyle
          }
          onClick={() => setActiveComponent("DashBoard")}
        >
          Dashboard
        </div>
        <div
          style={
            activeComponent === "AddInquiry"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("AddInquiry")}
        >
          Add Enquiry
        </div>
        <div
          style={activeComponent === "Exam" ? activeNavItemStyle : navItemStyle}
          onClick={() => setActiveComponent("Exam")}
        >
          Add Exam/Course
        </div>
        <div
          style={activeComponent === "Source" ? activeNavItemStyle : navItemStyle}
          onClick={() => setActiveComponent("Source")}
        >
          Add Source
        </div>
        <div
          style={
            activeComponent === "Conduct" ? activeNavItemStyle : navItemStyle
          }
          onClick={() => setActiveComponent("Conduct")}
        >
          Add Conduct
        </div>
        <div
          style={activeComponent === "Report" ? activeNavItemStyle : navItemStyle}
          onClick={() => setActiveComponent("Report")}
        >
          Enquiry List
        </div>
      </div>

      {/* Render the selected component */}
      <div>{components[activeComponent]}</div>
    </div>
  );
};

export default EnquiryManager;
