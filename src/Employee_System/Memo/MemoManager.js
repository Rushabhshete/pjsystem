import React, { useState } from "react";
import AddMemo from "./AddMemo";
import ManageEmpMemo from "./ManageEmpMemo";
// import AddMemo from "./AddMemo";



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

const MemoManager = () => {
  const [activeComponent, setActiveComponent] = useState("AddMemo");

  const components = {
    AddMemo: <AddMemo />,
    ManageEmpMemo: <ManageEmpMemo />,
 
 
  };

  return (
    <div>
      {/* Mini navbar (subnavbar) */}
      <div style={subNavBarStyle}>
        <div
          style={
            activeComponent === "AddMemo"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("AddMemo")}
        >
          Add Memo
        </div>
        <div
          style={
            activeComponent === "ManageEmpMemo"
              ? activeNavItemStyle
              : navItemStyle
          }
          onClick={() => setActiveComponent("ManageEmpMemo")}
        >
          Memo List
        </div>
      
      </div>

      {/* Render the selected component */}
      <div>{components[activeComponent]}</div>
    </div>
  );
};

export default MemoManager;
