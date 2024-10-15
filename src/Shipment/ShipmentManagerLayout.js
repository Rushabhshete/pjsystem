import React, { useLayoutEffect, useState } from "react";
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

const ShipmentManagerLayout = () => {
  const location = useLocation();
  const isActive = (path) =>location.pathname === path;
  const [activeComponent, setActiveComponent] = useState("ShipmentDashboard");

  const handleNavClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      {/* Mini navbar (subnavbar) */}
      <div style={subNavBarStyle}>
        <Link to="/layout/shipment-manager" style={isActive("/layout/shipment-manager") ? activeNavItemStyle : navItemStyle}>
        ShipmentDashboard
        </Link>
        <Link to="/layout/shipment-manager/shipment-form" style={isActive("/layout/shipment-manager/shipment-form")  ? activeNavItemStyle : navItemStyle}>
          Shipment Form
        </Link>
        <Link to="/layout/shipment-manager/shipment-report" style={isActive("/layout/shipment-manager/shipment-report") ? activeNavItemStyle : navItemStyle} >
          Shipment Report
        </Link>
        <Link to="/layout/shipment-manager/shipment-type" style={isActive("/layout/shipment-manager/shipment-type") ? activeNavItemStyle : navItemStyle} >
          Add Type
        </Link>
        <Link to="/layout/shipment-manager/status" style={isActive("/layout/shipment-manager/status") ? activeNavItemStyle : navItemStyle}>
          Add Status
        </Link>
        <Link to="/layout/shipment-manager/bookname" style={isActive("/layout/shipment-manager/bookname") ? activeNavItemStyle : navItemStyle}>
          Add Book
        </Link>
        <Link to="/layout/shipment-manager/vendorname" style={isActive("/layout/shipment-manager/vendorname") ? activeNavItemStyle : navItemStyle}>
          Add Vendor
        </Link>
      </div>

      {/* Render the selected component */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ShipmentManagerLayout;
