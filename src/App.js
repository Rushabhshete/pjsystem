import React, { useState, useEffect,useContext  } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { CssBaseline } from "@mui/material";

// Import the UserContext
import { UserProvider, UserContext } from "./layouts/UserContext";

// Import components
import ForgotPassword from "./layouts/ForgotPassword";
import Login from "./layouts/Login";
import Layout from "./layouts/layout";
import ProtectedRoute from "./layouts/ProtectedRoute";

import Source from "./Enquiry/ConductBy/Sources/Source";

import Exam from "./Enquiry/ExamPages/Exam";

import Conduct from "./Enquiry/ConductBy/Conduct";

import Report from "./Enquiry/Report";
import UpdateEnquiry from "./Enquiry/pages/UpdateInquiry";
import AddEnquiry from "./Enquiry/pages/AddInquiry";
import DashBoard from "./Enquiry/DashBoard";
import AddmissionDashboard from "./Addmission/AdmissionDashboard";
import AddmissionSource from "./Addmission/AddmissionSource";
import AdmissionForm from "./Addmission/AdmissionForm";
import StudentList from "./Addmission/StudentList";
import UpdateForm from "./Addmission/AdmissionUpdateForm";
import StudentFormDataDisplay from "./Addmission/StudentFormDataDisplay";
import AddCourse from "./Addmission/AdmissionAddCourse";
import AddGuide from "./Addmission/AddGuide";
import IncomeExpenseDashboard from "./Income Expense/IncomeExpenseDashboard";
import AddIncomeExpense from "./Income Expense/AddIncomeExpense";
import Category from "./Income Expense/Category";
import AddCategory from "./Income Expense/AddCategory";
import AddUser from "./Income Expense/AddUser";
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
import EmployeeDashboard from "./Employee_System/Employee/EmployeeDashboard";
import AddEmployee from "./Employee_System/Employee/AddEmployee";
import EmployeeList from "./Employee_System/Employee/EmployeeList";
import CreateAccount from "./layouts/CreateAccount";
import EmpReport from "./Employee_System/Employee/EmpReport";
import AddEmpcategory from "./Employee_System/Employee/AddEmpcategory";
import AddDepartment from "./Employee_System/Employee/AddDepartment";
import ManageHoliday from "./Employee_System/Employee/ManageHoliday";
import SalaryDashboard from "./Employee_System/Salary/SalaryDashboard";
import EmpDetails from "./Employee_System/Salary/EmpDetails";
import SalaryTable from "./Employee_System/Salary/SalaryTable";
import AddSalary from "./Employee_System/Salary/AddSalary";
import ManageAttendance from "./Employee_System/Attendance/ManageAttendance";
import ViewAttendance from "./Employee_System/Attendance/ViewAttendance";
import ManageLeave from "./Employee_System/Leave/ManageLeave";
import TodaysAttendance from "./Employee_System/Attendance/TodaysAttendance";
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
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="add" element={<AddEnquiry />} />
          <Route path="manage/:id" element={<UpdateEnquiry />} />
          <Route path="report" element={<Report />} />
          <Route path="conduct" element={<Conduct />} />
          <Route path="exam" element={<Exam />} />
          <Route path="source" element={<Source />} />

          {/* Admission Routes */}
          <Route path="admission-dashboard" element={<AddmissionDashboard />} />
          <Route path="admission-form" element={<AdmissionForm />} />
          <Route path="students" element={<StudentList />} />
          <Route path="update-admission/:sid" element={<UpdateForm />} />
          <Route
            path="student-form-data-display"
            element={<StudentFormDataDisplay />}
          />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="admission-source" element={<AddmissionSource />} />
          <Route path="add-guide" element={<AddGuide />} />

          {/* Income Expense */}

          <Route
            path="Income-Expense-dashboard"
            element={<IncomeExpenseDashboard />}
          />
          <Route path="AddIncomeExpense" element={<AddIncomeExpense />} />
          <Route path="incomeExpenseList" element={<Category />} />
          <Route path="AddCategory" element={<AddCategory />} />
          <Route path="AddUser" element={<AddUser />} />

          {/* Employee */}
          <Route path="empDashboard" element={<EmployeeDashboard />} />
          <Route path="empAdd" element={<AddEmployee />} />
          <Route path="empList" element={<EmployeeList />} />
          <Route path="EmpReport" element={<EmpReport />} />
          <Route path="AddEmpcategory" element={<AddEmpcategory />} />
          <Route path="AddDepartment" element={<AddDepartment />} />
          <Route path="ManageHoliday" element={<ManageHoliday />} />

          <Route path="EmpDash" element={<EmpDash />} />
          <Route path="AttenDash" element={<AttenDash />} />

          <Route path="SalaryDashboard" element={<SalaryDashboard />} />
          <Route path="AddSalary/:empID" element={<AddSalary />} />
          <Route path="SalaryTable" element={<SalaryTable />} />
          <Route path="EmpDetails" element={<EmpDetails />} />

          <Route path="ManageAttendance" element={<ManageAttendance />} />
          <Route path="TodaysAttendance" element={<TodaysAttendance />} />
          <Route path="ViewAttendance/:empID" element={<ViewAttendance />} />

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
