// EmployeeManager.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import EmployeeDashboard from "./EmployeeDashboard";
import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import EmpReport from "./EmpReport";
import AddEmpcategory from "./AddEmpcategory";
import AddDepartment from "./AddDepartment";
import ManageHoliday from "./ManageHoliday";
import EmployeeManagerLayout from './EmployeeManagerLayout';

const EmployeeManager = () => {
  return (
    <Routes>
      {/* Main route that renders the layout with the sidebar */}
      <Route path="/" element={<EmployeeManagerLayout />}>
        {/* Nested routes inside EmployeeManagerLayout */}
        <Route index element={<EmployeeDashboard />} />
        <Route path="add-employee" element={<AddEmployee />} />
        <Route path="add-category" element={<AddEmpcategory />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="manage-holiday" element={<ManageHoliday />} />
        <Route path="employee-list" element={<EmployeeList />} />
        <Route path="emp-report" element={<EmpReport />} />
      </Route>
    </Routes>
  );
};

export default EmployeeManager;
