import React from "react";
import { Routes, Route, Link, useLocation, Outlet } from "react-router-dom";
import IncomeExpenseDashboard from "./IncomeExpenseDashboard";
import AddIncomeExpense from "./AddIncomeExpense";
import Category from "./Category";
import AddCategory from "./AddCategory";
import AddUser from "./AddUser";

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

const IncomeExpenseManagerLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Sub-navbar for the IncomeExpenseManager */}
      <div style={subNavBarStyle}>
        <Link to="/layout/income-expense-manager" style={isActive("/layout/income-expense-manager") ? activeNavItemStyle : navItemStyle}>
          Dashboard
        </Link>
        <Link to="/layout/income-expense-manager/add-income-expense" style={isActive("/layout/income-expense-manager/add-income-expense") ? activeNavItemStyle : navItemStyle}>
          Add Income/Expense
        </Link>
        <Link to="/layout/income-expense-manager/add-category" style={isActive("/layout/income-expense-manager/add-category") ? activeNavItemStyle : navItemStyle}>
          Add Category
        </Link>
        <Link to="/layout/income-expense-manager/add-user" style={isActive("/layout/income-expense-manager/add-user") ? activeNavItemStyle : navItemStyle}>
          Add User
        </Link>
        <Link to="/layout/income-expense-manager/category" style={isActive("/layout/income-expense-manager/category") ? activeNavItemStyle : navItemStyle}>
          List
        </Link>
      </div>

      {/* This is where the content of each route will be displayed */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default IncomeExpenseManagerLayout;