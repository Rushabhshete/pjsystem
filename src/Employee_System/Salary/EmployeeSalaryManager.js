import React, { useState } from "react";
import SalaryDashBoard from "./SalaryDashboard";
import EmpDetails from "./EmpDetails";
import SalaryTable from "./SalaryTable";



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
  backgroundColor: "#624E88",
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

const EmployeeSalaryManager = () => {
  const [activeComponent, setActiveComponent] = useState("SalaryDashBoard");

  const components = {
    SalaryDashBoard: <SalaryDashBoard />,
    EmpDetails: <EmpDetails />,
    SalaryTable: <SalaryTable />,
 
  };

  return (
    <div>
      {/* Mini navbar (subnavbar) */}
      <div style={subNavBarStyle}>
        <div
          style={
            activeComponent === "SalaryDashBoard"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("SalaryDashBoard")}
        >
          Dashboard
        </div>
        <div
          style={
            activeComponent === "EmpDetails"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("EmpDetails")}
        >
          Add Employee
        </div>
        <div
          style={
            activeComponent === "SalaryTable"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("SalaryTable")}
        >
          Employee List
        </div>
   
      </div>

      {/* Render the selected component */}
      <div>{components[activeComponent]}</div>
    </div>
  );
};

export default EmployeeSalaryManager;