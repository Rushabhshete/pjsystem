// import React, { useState } from "react";
// import IncomeExpenseDashboard from "./IncomeExpenseDashboard";
// import AddIncomeExpense from "./AddIncomeExpense";
// import Category from "./Category";
// import AddCategory from "./AddCategory";
// import AddUser from "./AddUser";

// // Styles for each navbar item
// const navItemStyle = {
//   padding: "10px 20px",
//   cursor: "pointer",
//   fontSize: "16px",
//   fontWeight: "bold",
//   color: "#333",
//   textAlign: "center",
//   flex: 1,
//   transition: "background-color 0.3s ease, color 0.3s ease",
// };

// // Styles for active item
// const activeNavItemStyle = {
//   ...navItemStyle,
//   backgroundColor: "#f0f0f0",
//   //color: "white",
//   borderRadius: "35px",
//   transform: "scale(1.05)", // Slight increase for active state
//   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for active
// };

// // Styles for the subnavbar container
// const subNavBarStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   marginBottom: "20px",
//   backgroundColor: "#b0b0b0",
//   padding: "10px",
//   borderRadius: "35px",
//   boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Slight shadow for navbar
// };

// const IncomeExpenseManager = () => {
//   const [activeComponent, setActiveComponent] = useState("IncomeExpenseDashboard");

//   const components = {
//     IncomeExpenseDashboard: <IncomeExpenseDashboard />,
//     AddIncomeExpense: <AddIncomeExpense />,
//     Category: <Category />,
//     AddCategory: <AddCategory />,
//     AddUser: <AddUser />,
//   };

//   return (
//     <div>
//       {/* Mini navbar (subnavbar) */}
//       <div style={subNavBarStyle}>
//         <div
//           style={
//             activeComponent === "IncomeExpenseDashboard"
//               ? activeNavItemStyle
//               : navItemStyle
//           }
//           onClick={() => setActiveComponent("IncomeExpenseDashboard")}
//         >
//           Dashboard
//         </div>
//         <div
//           style={
//             activeComponent === "AddIncomeExpense"
//               ? activeNavItemStyle
//               : navItemStyle
//           }
//           onClick={() => setActiveComponent("AddIncomeExpense")}
//         >
//           Add Income/Expense
//         </div>
//         <div
//           style={
//             activeComponent === "AddCategory" ? activeNavItemStyle : navItemStyle
//           }
//           onClick={() => setActiveComponent("AddCategory")}
//         >
//           Add Category
//         </div>
//         <div
//           style={activeComponent === "AddUser" ? activeNavItemStyle : navItemStyle}
//           onClick={() => setActiveComponent("AddUser")}
//         >
//           Add User
//         </div>
//         <div
//           style={
//             activeComponent === "Category" ? activeNavItemStyle : navItemStyle
//           }
//           onClick={() => setActiveComponent("Category")}
//         >
//           List
//         </div>
//       </div>

//       {/* Render the selected component */}
//       <div>{components[activeComponent]}</div>
//     </div>
//   );
// };

// export default IncomeExpenseManager;





import React from "react";
import { Routes, Route } from "react-router-dom";
import IncomeExpenseDashboard from "./IncomeExpenseDashboard";
import AddIncomeExpense from "./AddIncomeExpense";
import AddCategory from "./AddCategory";
import AddUser from "./AddUser";
import Category from "./Category";
import IncomeExpenseManagerLayout from './IncomeExpenseManagerLayout'



const IncomeExpenseManager = () => {
  return (
    <Routes>
      {/* Main route that renders the layout with the sidebar */}
      <Route path="/" element={<IncomeExpenseManagerLayout />}>
        {/* Nested routes inside IncomeExpenseManagerLayout */}
        <Route index element={<IncomeExpenseDashboard />} />
        <Route path="add-income-expense" element={<AddIncomeExpense />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="category" element={<Category />} />
      </Route>
    </Routes>
  );
};

export default IncomeExpenseManager;