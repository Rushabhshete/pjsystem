import React, { useState } from "react";
import EmployeeDashboard from "./EmployeeDashboard";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import EmpReport from "./EmpReport";
import AddEmpcategory from "./AddEmpcategory";
import AddDepartment from "./AddDepartment";
import ManageHoliday from "./ManageHoliday";

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

const AdmissionManager = () => {
  const [activeComponent, setActiveComponent] = useState("EmployeeDashboard");

  const components = {
    EmployeeDashboard: <EmployeeDashboard />,
    AddEmployee: <AddEmployee />,
    EmployeeList: <EmployeeList />,
    EmpReport: <EmpReport />,
    AddEmpcategory: <AddEmpcategory />,
    AddDepartment: <AddDepartment />,
    ManageHoliday: <ManageHoliday />,
  };

  return (
    <div>
      {/* Mini navbar (subnavbar) */}
      <div style={subNavBarStyle}>
        <div
          style={
            activeComponent === "EmployeeDashboard"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("EmployeeDashboard")}
        >
          Dashboard
        </div>
        <div
          style={
            activeComponent === "AddEmployee"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("AddEmployee")}
        >
          Add Employee
        </div>
        <div
          style={
            activeComponent === "EmployeeList"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("EmployeeList")}
        >
          Employee List
        </div>
        <div
          style={
            activeComponent === "EmpReport"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("EmpReport")}
        >
          Employee Report
        </div>
        <div
          style={
            activeComponent === "AddEmpcategory"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("AddEmpcategory")}
        >
          Add Category
        </div>
        <div
          style={
            activeComponent === "AddDepartment"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("AddDepartment")}
        >
          Add Department
        </div>
        <div
          style={
            activeComponent === "ManageHoliday"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("ManageHoliday")}
        >
          Add Holiday
        </div>
      </div>

      {/* Render the selected component */}
      <div>{components[activeComponent]}</div>
    </div>
  );
};

export default AdmissionManager;
