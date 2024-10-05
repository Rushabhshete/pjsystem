import React, { useState } from "react";
import IncomeExpenseDashboard from "./IncomeExpenseDashboard";
import AddIncomeExpense from "./AddIncomeExpense";
import Category from "./Category";
import AddCategory from "./AddCategory";
import AddUser from "./AddUser";



const baseButtonStyle = {
  backgroundColor: "#FF6969",
  color:"#333",
  border: "none",
  borderRadius: "35px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s ease, transform 0.2s ease",
  width: "180px",
  flexGrow: 1,
  margin: "0 10px",
  textAlign: "center",
};

const activeButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#624E88", 
  transform: "scale(1.15)", // Slightly larger to indicate it is active
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow for emphasis
  color:"white",
};

const IncomeExpenseManager = () => {
  const [activeComponent, setActiveComponent] = useState("IncomeExpenseDashboard");

  const components = {
    IncomeExpenseDashboard: <IncomeExpenseDashboard />,
    AddIncomeExpense: <AddIncomeExpense />,
    Category: <Category />,
    AddCategory: <AddCategory />,
    AddUser: <AddUser />,
  };

  return (
    <div>
      {/* Horizontal buttons for navigation */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        <button 
          style={activeComponent === "IncomeExpenseDashboard" ? activeButtonStyle : baseButtonStyle} 
          onClick={() => setActiveComponent("IncomeExpenseDashboard")}
        >
          Dashboard
        </button>
        <button 
          style={activeComponent === "AddIncomeExpense" ? activeButtonStyle : baseButtonStyle} 
          onClick={() => setActiveComponent("AddIncomeExpense")}
        >
          Add Income/Expense
        </button>
        <button 
          style={activeComponent === "Category" ? activeButtonStyle : baseButtonStyle} 
          onClick={() => setActiveComponent("Category")}
        >
          Category
        </button>
        <button 
          style={activeComponent === "AddCategory" ? activeButtonStyle : baseButtonStyle} 
          onClick={() => setActiveComponent("AddCategory")}
        >
          Add Category
        </button>
        <button 
          style={activeComponent === "AddUser" ? activeButtonStyle : baseButtonStyle} 
          onClick={() => setActiveComponent("AddUser")}
        >
          Add User
        </button>
      </div>

      {/* Render the selected component */}
      <div>{components[activeComponent]}</div>
    </div>
  );
};

export default IncomeExpenseManager;
