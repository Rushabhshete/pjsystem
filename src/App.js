import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { CssBaseline } from "@mui/material";
import "./App.css"; // Import the global styles
// Import the UserContext
import { UserProvider, UserContext } from "./layouts/UserContext";

// Import components
import ForgotPassword from "./layouts/ForgotPassword";
import Login from "./layouts/Login";
import Layout from "./layouts/layout";

import AdminProfile from "./layouts/AdminProfile"; // Ensure this path is correct
import Memo from "./layouts/Memo";
import ManageMemo from "./layouts/ManageMemo";
import ManageNotification from "./layouts/ManageNotification";
import CombineDashboard from "./layouts/CombineDashboard";
import FloatingHelpDeskButton from "./layouts/FloatingHelpDeskButton";
import HelpDesk from "./layouts/HelpDesk";
//import bill from "./layouts/bill";
import AddSubAdmin from "./layouts/AddSubAdmin";
import Settings from "./layouts/Settings";

import CreateAccount from "./layouts/CreateAccount";
import ManageLeave from "./Employee_System/Leave/ManageLeave";
import AddMemo from "./Employee_System/Memo/AddMemo";
import ManageEmpMemo from "./Employee_System/Memo/ManageEmpMemo";
import AddNotice from "./Employee_System/Memo/AddNotice";
import Login1 from "./layouts/Login1";
import Bill from "./layouts/bill";
import EmpDash from "./layouts/EmpDash";
import StudentDashboard from "./Student/StudentDashboard";
import StudentForm from "./Student/StudentForm";
import StudentLists from "./Student/StudentLists";
import StudentReport from "./Student/StudentReport";
import StudentRequest from "./Student/StudentRequest";
import AddField from "./Student/AddField";
import AttenDash from "./layouts/AttenDash";
import FeesDashboard from "./Student/Fees/FeesDashboard";
import FeeInvoice from "./Student/Fees/FeeInvoice";
import InvoiceList from "./Student/Fees/InvoiceList";
import AddFee from "./Student/Fees/AddFee";
import FeeTable from "./Student/Fees/FeeTable";
import AddMedium from "./Student/Fees/AddMedium";
import FeeReport from "./Student/Fees/FeeReport";
import IncomeExpenseManager from "./Income Expense/IncomeExpenseManager";
import AdmissionManager from "./Addmission/AdmissionManager";
import EnquiryManager from "./Enquiry/EnquiryManager";
import EmployeeManager from "./Employee_System/Employee/EmployeeManager";
import AttendanceManager from "./Employee_System/Attendance/AttendanceManager";
import EmployeeSalaryManager from "./Employee_System/Salary/EmployeeSalaryManager";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const location = useLocation();
  const showHelpDeskButton =
    location.pathname !== "/" &&
    location.pathname !== "/create-account" &&
    location.pathname !== "/systems";

  const { user } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/loginPage" element={<Login1 />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}> */}

        <Route path="/layout/*" element={<Layout />}>
          <Route path="admin-profile" element={<AdminProfile />} />

          <Route path="combineDash" element={<CombineDashboard />} />

          <Route path="memo" element={<Memo />} />
          <Route path="manage-memo" element={<ManageMemo />} />
          <Route path="manage-notifications" element={<ManageNotification />} />
          {/* Enquiry Routes */}

          <Route path="Enquiry-manager" element={<EnquiryManager />} />

          {/* Admission Routes */}

          <Route path="Admission-manager" element={<AdmissionManager />} />

          {/* Income Expense */}

          <Route
            path="income-expense-manager"
            element={<IncomeExpenseManager />}
          />

          {/* Employee */}

          <Route path="Employee-manager" element={<EmployeeManager />} />

          <Route path="EmpDash" element={<EmpDash />} />
          <Route path="AttenDash" element={<AttenDash />} />

          <Route path="Attendance-manager" element={<AttendanceManager />} />

          <Route
            path="EmployeeSalaryManager"
            element={<EmployeeSalaryManager />}
          />

          <Route path="ManageLeave" element={<ManageLeave />} />

          <Route path="manageLeave" element={<ManageLeave />} />
          <Route path="helpDesk" element={<HelpDesk />} />
          <Route path="bill" element={<Bill />} />
          <Route path="subadmin" element={<AddSubAdmin />} />
          <Route path="Settings" element={<Settings />} />

          <Route path="addmemo" element={<AddMemo />} />
          <Route path="manageEmpmemo" element={<ManageEmpMemo />} />
          <Route path="addnotice" element={<AddNotice />} />

          {/* Student */}
          <Route path="StudentDashboard" element={<StudentDashboard />} />
          <Route path="StudentForm" element={<StudentForm />} />
          <Route path="StudentLists" element={<StudentLists />} />
          <Route path="StudentReport" element={<StudentReport />} />
          <Route path="StudentRequest" element={<StudentRequest />} />
          <Route path="AddField" element={<AddField />} />

          {/*Fees */}

          <Route path="FeesDashboard" element={<FeesDashboard />} />
          <Route path="FeeInvoice" element={<FeeInvoice />} />
          <Route path="InvoiceList" element={<InvoiceList />} />
          <Route path="AddFee" element={<AddFee />} />
          <Route path="FeeTable" element={<FeeTable />} />
          <Route path="AddMedium" element={<AddMedium />} />
          <Route path="FeeReport" element={<FeeReport />} />

          {/* <Route path="account" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Account /></ProtectedRoute>} /> */}
        </Route>
        {/* </Route> */}
        {/* <Route path="/systems/" element={<Navigate to="/layout" />} /> */}

        {/* <Route path="/" element={<Navigate to="/layout" />} /> */}
        {/* Catch-all route to redirect all other paths to login */}
        {/* <Route path="*" element={<Navigate to="/systems/" />} /> */}
      </Routes>
      {showHelpDeskButton && <FloatingHelpDeskButton />}
    </>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <CssBaseline />
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
