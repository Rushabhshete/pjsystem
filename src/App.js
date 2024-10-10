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
import MemoManager from "./Employee_System/Memo/MemoManager";
import AdmissionForm from "./Addmission/AdmissionForm";
import AddmissionSource from "./Addmission/AddmissionSource";
import AddGuide from "./Addmission/AddGuide";
import StudentList from "./Addmission/StudentList";
import AdmissionAddCourse from './Addmission/AdmissionAddCourse'
import IncomeExpenseDashboard from "./Income Expense/IncomeExpenseDashboard";
import AddIncomeExpense from "./Income Expense/AddIncomeExpense";
import AddCategory from "./Income Expense/AddCategory";
import { Category } from "@mui/icons-material";
import AddUser from "./Income Expense/AddUser";
import DashBoard from "./Enquiry/DashBoard";
import Report from "./Enquiry/Report";
import Exam from "./Enquiry/ExamPages/Exam";
import Source from "./Enquiry/ConductBy/Sources/Source";
import Conduct from "./Enquiry/ConductBy/Conduct";
import AddInquiry from './Enquiry/pages/AddInquiry'
import EmployeeManagerLayout from "./Employee_System/Employee/EmployeeManagerLayout";
import EmployeeDashboard from "./Employee_System/Employee/EmployeeDashboard";
import EmployeeList from "./Employee_System/Employee/EmployeeList";
import EmpReport from "./Employee_System/Employee/EmpReport";
import ManageHoliday from "./Employee_System/Employee/ManageHoliday";
import AddEmployee from "./Employee_System/Employee/AddEmployee";
import AddEmpcategory from "./Employee_System/Employee/AddEmpcategory";
import AddDepartment from "./Employee_System/Employee/AddDepartment";
import AttendanceManagerLayout from "./Employee_System/Attendance/AttendanceManagerLayout";
import TodaysAttendance from "./Employee_System/Attendance/TodaysAttendance";
import ManageAttendance from "./Employee_System/Attendance/ManageAttendance";
import EmpDetails from "./Employee_System/Salary/EmpDetails";
import SalaryTable from "./Employee_System/Salary/SalaryTable";
import EmployeeSalaryManagerLayout from "./Employee_System/Salary/EmployeeSalaryManagerLayout";
import SalaryDashBoard from "./Employee_System/Salary/SalaryDashboard";
import AddSalary from "./Employee_System/Salary/AddSalary";
import ViewAttendance from "./Employee_System/Attendance/ViewAttendance";
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

          <Route path="Memo-manager" element={<MemoManager />} />
        
          {/* Enquiry Routes */}

            {/* Route for Enquiry Manager */}
      <Route path="enquiry-manager" element={<EnquiryManager />}>
        {/* Nested routes for Enquiry Manager */}
        <Route index element={<DashBoard />} />
        <Route path="add-inquiry" element={<AddInquiry />} />
        <Route path="report" element={<Report />} />
        <Route path="exam" element={<Exam />} />
        <Route path="source" element={<Source />} />
        <Route path="conduct" element={<Conduct />} />
      </Route>

        {/* AdmissionManager and nested routes */}
        <Route path="Admission-manager" element={<AdmissionManager />}>
            <Route index element={<AdmissionForm />} />
            
            <Route path="admission-form" element={<AdmissionForm />} />
            <Route path="add-course" element={<AdmissionAddCourse />} />
            <Route path="add-source" element={<AddmissionSource />} />
            <Route path="add-guide" element={<AddGuide />} />
            <Route path="student-list" element={<StudentList />} />
          </Route>

          {/* Income Expense */}

          <Route path="income-expense-manager" element={<IncomeExpenseManager />}>
          {/* Nested routes for IncomeExpenseManager */}
          <Route index element={<IncomeExpenseDashboard />} />
          <Route path="add-income-expense" element={<AddIncomeExpense />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="category" element={<Category />} />
          <Route path="add-user" element={<AddUser />} />
        </Route>

          {/* Employee */}

        {/* Employee Manager Route with Nested Routes */}
        <Route path="employee-manager" element={<EmployeeManager />}>
          <Route index element={<EmployeeDashboard />} />   {/* Default page */}
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="emp-report" element={<EmpReport />} />
          <Route path="add-category" element={<AddEmpcategory />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="manage-holiday" element={<ManageHoliday />} />
        </Route>

          <Route path="EmpDash" element={<EmpDash />} />
          <Route path="AttenDash" element={<AttenDash />} />

          <Route path="attendance-manager/*" element={<AttendanceManagerLayout />}>
          <Route index element={<TodaysAttendance />} />  {/* Default route */}
          <Route path="manage-attendance" element={<ManageAttendance />} />
        <Route path="View-attendance/:empID" element={<ViewAttendance />} />

        </Route>

     {/* Employee Salary Manager */}
     <Route path="employee-salary-manager/*" element={<EmployeeSalaryManagerLayout />}>
            <Route index element={<SalaryDashBoard />} />
            <Route path="salary-list" element={<SalaryTable />} />
            <Route path="add-salary/:empID" element={<AddSalary />} />
            <Route path="add-detail" element={<EmpDetails />} />
            

          </Route>

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
