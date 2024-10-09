import React from "react";
import { Routes, Route } from "react-router-dom";
import SalaryDashBoard from "./SalaryDashboard";
import EmpDetails from "./EmpDetails";
import SalaryTable from "./SalaryTable";
import EmployeeSalaryManagerLayout from "./EmployeeSalaryManagerLayout";
import AddSalary from "./AddSalary";

const EmployeeSalaryManager = () => {
  return (
    <Routes>
      {/* Main route that renders the layout with the sidebar */}
      <Route path="/" element={<EmployeeSalaryManagerLayout />}>
        {/* Nested routes inside EmployeeSalaryManagerLayout */}
        <Route index element={<SalaryDashBoard />} />
        <Route path="add-detail" element={<EmpDetails />} />
        <Route path="add-salary" element={<AddSalary />} />
        <Route path="salary-list" element={<SalaryTable />} />
      </Route>
    </Routes>
  );
};

export default EmployeeSalaryManager;
