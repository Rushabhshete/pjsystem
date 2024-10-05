import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { Box } from "@mui/system";
import { useReactToPrint } from "react-to-print";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../Salary/logo.jpg";
import { Modal } from "reactstrap";
import { ModalHeader } from "react-bootstrap";
import { Print } from "@mui/icons-material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import InfoIcon from "@mui/icons-material/Info";
import { styled } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

const styles = {
  dialogPaper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
};

const SalaryTable = ({ id, initialStatus }) => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );
  const [selectedSalary, setSelectedSalary] = useState({
    id: "",
    empID: "",
    fullName: "",
    employeecategory: "",
    department: "",
    basicSalary: "",
    hraAllowance: "",
    taAllowance: "",
    incentive: "",
    spi: "",
    medicalAllowance: "",
    pf: "",
    esf: "",
    professionalTax: "",
    incomeTax: "",
    deductions: "",
    netSalaryBeforeTaxes: "",
    workingDays: "",
    finalNetSalary: "",
    transactionId: "",
    paymentDate: "",
    status: "",
  });

  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoPopupData, setInfoPopupData] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [employeeCategories, setEmployeeCategories] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [searchTerm, setSearchTerm] = useState(""); // Step 1: State for search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [employeeDetails, setEmployeeDetails] = useState("");
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!institutecode) {
          console.error("No institutecode found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [institutecode]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`
        );
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Failed to fetch departments");
      }
    };

    const fetchEmployeeCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/categories/all?institutecode=${institutecode}`
        );
        setEmployeeCategories(response.data);
      } catch (error) {
        console.error("Error fetching employee categories:", error);
        toast.error("Failed to fetch employee categories");
      }
    };

    fetchDepartments();
    fetchEmployeeCategories();
  }, [institutecode]);

  const handleInfoClick = (salary) => {
    setInfoPopupData(salary);
    setShowInfoPopup(true);
  };

  const handleCloseInfoPopup = () => {
    setShowInfoPopup(false);
    setInfoPopupData(null);
  };

  const handleOpenConfirmDeleteDialog = () => {
    setShowInfoPopup(false); // Close info dialog
    setRowToDelete(infoPopupData.id); // Set the row to delete
    setShowConfirmDeleteDialog(true); // Open confirmation dialog
  };

  const handleCloseConfirmDeleteDialog = () => {
    setShowConfirmDeleteDialog(false);
    setRowToDelete(null);
  };

  const handleDelete = async () => {
    if (rowToDelete) {
      try {
        await axios.delete(
          `http://localhost:8082/salaries/softDeleteSalaryById/${rowToDelete}`
        );
        setSalaries(salaries.filter((salary) => salary.id !== rowToDelete));
        toast.success("Row deleted successfully");
      } catch (error) {
        console.error("Error deleting row:", error);
        toast.error("Failed to delete row");
      } finally {
        setRowToDelete(null);
        handleCloseConfirmDeleteDialog();
      }
    }
  };

  // Function to convert numeric value to words
  const numberToWords = (num) => {
    const units = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Lakh", "Million", "Billion"];

    if (num === 0) return "Zero";

    let [integerPart, decimalPart] = num.toString().split(".");
    let word = "";

    const getWords = (n) => {
      let str = "";

      if (n >= 100) {
        str += units[Math.floor(n / 100)] + " Hundred ";
        n %= 100;
      }

      if (n >= 11 && n <= 19) {
        str += teens[n - 11] + " ";
      } else {
        if (n >= 10) {
          str += tens[Math.floor(n / 10)] + " ";
          n %= 10;
        }

        if (n > 0) {
          str += units[n] + " ";
        }
      }

      return str;
    };

    let scaleCounter = 0;
    integerPart = parseInt(integerPart, 10); // Ensure integerPart is an integer

    while (integerPart > 0) {
      const chunk = integerPart % 1000;
      if (chunk > 0) {
        word =
          getWords(chunk) +
          (scales[scaleCounter] ? scales[scaleCounter] + " " : "") +
          word;
      }
      integerPart = Math.floor(integerPart / 1000);
      scaleCounter++;
    }

    if (decimalPart) {
      decimalPart = parseInt(decimalPart, 10); // Ensure decimalPart is an integer
      word += "Point ";
      for (let digit of decimalPart.toString()) {
        word += units[parseInt(digit)] + " ";
      }
    }

    return word;
  };

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [selectedSalaryIdForUpdate, setSelectedSalaryIdForUpdate] =
    useState(null);
  const [showPaidMessage, setShowPaidMessage] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [earnings, setEarnings] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [transactionIdInputs, setTransactionIdInputs] = useState({});

  const [open, setOpen] = React.useState(false);

  const componentRef = useRef();

  const handleClickOpen = (salary) => {
    if (salary.status === "Pending") {
      setShowPaidMessage(true);
    } else {
      setSelectedSalary(salary);
      extractEarningsAndDeductions(salary);
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const extractEarningsAndDeductions = (data) => {
    const earningsData = [
      { label: "Salary", amount: data.basicSalary },
      { label: "HRA ", amount: data.hraAllowance },
      { label: "TA ", amount: data.taAllowance },
      { label: "Incentives", amount: data.incentive },
      { label: "SPI", amount: data.spi },
      { label: "Medical A", amount: data.medicalAllowance },
    ];

    const deductionsData = [
      { label: "PF", amount: data.pf },
      { label: "ESF", amount: data.esf },
      { label: "Professional Tax", amount: data.professionalTax },
      { label: "Income Tax", amount: data.incomeTax },
      { label: "Total Deductions", amount: data.deductions },
    ];

    setEarnings(earningsData);
    setDeductions(deductionsData);
  };

  useEffect(() => {
    if (selectedEmpId && selectedMonth && selectedYear) {
      fetchSalariesByEmpIdMonthYear(selectedEmpId, selectedMonth, selectedYear);
    }
  }, [selectedEmpId, selectedMonth, selectedYear, institutecode]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchSalaryByMonthYear(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, institutecode]);

  React.useEffect(() => {
    if (showPaidMessage) {
      toast.error("Status is still pending. Please wait for it to get paid.");
    }
  }, [showPaidMessage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // Debounce time, e.g., 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchData = async (paymentDate = "") => {
    setLoading(true);
    setError(null);
    try {
      // Build URL based on payment date or all data
      let url = `http://localhost:8082/salaries/all?institutecode=${institutecode}`;
      if (paymentDate) {
        url = `http://localhost:8082/salaries/paymentdate?paymentDate=${paymentDate}&institutecode=${institutecode}`;
      }

      const response = await axios.get(url);
      const salariesData = response.data;

      // Filtering logic (could be moved to a separate function for clarity)
      const filteredSalaries = salariesData.filter((salary) => {
        const matchesDepartment =
          selectedDepartment === "" || salary.department === selectedDepartment;
        const matchesCategory =
          selectedCategory === "" ||
          salary.employeecategory === selectedCategory;
        const matchesStatus =
          selectedStatus === "" || salary.status === selectedStatus;
        // const matchesSearchTerm =
        //     salary.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearchTerm =
          salary.fullName &&
          salary.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        return (
          matchesDepartment &&
          matchesCategory &&
          matchesStatus &&
          matchesSearchTerm
        );
      });

      // Set filtered salaries to state
      setSalaries(filteredSalaries);
    } catch (error) {
      console.error("Error fetching salaries:", error);
      setError("Failed to fetch salaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchData();
    };
    fetch();
  }, [
    institutecode,
    selectedDepartment,
    selectedCategory,
    selectedStatus,
    debouncedSearchTerm,
  ]);

  // Function to handle the search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchSalariesByEmpIdMonthYear = async (empID, month, year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8082/salaries/byEmployeeIdAndMonthAndYear?empID=${empID}&month=${month}&year=${year}&institutecode=${institutecode}`
      );
      setSalaries(response.data);
    } catch (error) {
      console.error(
        "Error fetching salaries by employee ID, month, and year:",
        error
      );
      setError("Failed to fetch salaries by employee ID, month, and year");
    } finally {
      setLoading(false);
    }
  };

  const fetchSalaryByMonthYear = async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8082/salaries/all?institutecode=${institutecode}`
      );
      const filteredSalaries = response.data.filter(
        (salary) => salary.month === month && salary.year === year
      );
      setSalaries(filteredSalaries);
    } catch (error) {
      console.error("Error fetching salaries by month and year:", error);
      setError("Failed to fetch salaries by month and year");
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // for payslip

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const handleTransactionIdChange = (id, event) => {
    const { value } = event.target;
    setTransactionIdInputs((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSaveTransactionId = async (id) => {
    const updatedTransactionId = transactionIdInputs[id];
    try {
      await axios.put(
        `http://localhost:8082/salaries/${id}/transaction?transactionID=${updatedTransactionId}`
      );
      fetchData();
      toast.success("Transaction ID updated successfully");
      setTransactionIdInputs((prevState) => ({
        ...prevState,
        [id]: "",
      }));
    } catch (error) {
      console.error("Error updating transaction ID:", error);
      toast.error("Failed to update transaction ID");
    }
  };

  // const fetchData = async (paymentDate = "") => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     let url = `http://localhost:8082/salaries/all?institutecode=${institutecode}`;
  //     if (paymentDate) {
  //       url = `http://localhost:8082/salaries/paymentdate?paymentDate=${paymentDate}&institutecode=${institutecode}`;
  //     }
  //     const response = await axios.get(url);
  //     setSalaries(response.data);
  //   } catch (error) {
  //     console.error("Error fetching salaries:", error);
  //     setError("Failed to fetch salaries");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const selectedMonthName = monthNames[selectedSalary.month - 1];

  const PopTypography = styled(Typography)`
    @keyframes pop {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const updateStatus = async (id) => {
    const salaryToUpdate = salaries.find((salary) => salary.id === id);

    if (salaryToUpdate.status === "Paid") {
      toast.error("This salary has already been marked as Paid.");
      return; // Exit the function early to prevent further execution.
    }
    try {
      const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
      const response = await axios.put(
        `http://localhost:8082/salaries/${id}/updatePaymentDate?status=Paid&paymentDate=${today}`
      );

      if (response.status === 200) {
        setSalaries(
          salaries.map((salary) =>
            salary.id === id
              ? { ...salary, status: "Paid", paymentDate: today }
              : salary
          )
        );
        setShowConfirmationDialog(false);

        toast.success("Payment processed successfully!");
      } else {
        console.error("Failed to update payment status:", response);
        setError("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Failed to update payment status");
    }
  };

  // const handleStatusChange = async (e) => {
  //   const status = e.target.value;
  //   setSelectedStatus(status);

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8082/salaries/all?institutecode=${institutecode}`
  //     );
  //     const filteredSalaries = response.data.filter(
  //       (salary) => salary.status === status
  //     );
  //     setSalaries(filteredSalaries);
  //   } catch (error) {
  //     console.error(`Error fetching salaries with status ${status}:`, error);
  //     setError(`Failed to fetch salaries with status ${status}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <ToastContainer />
      <PopTypography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "#24A0ED",
          borderRadius: "150px",
          padding: "10px",
          marginBottom: "-2px",
        }}
      >
        Salary Report
      </PopTypography>

      <Grid container spacing={2} alignItems="center" mt={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search by Employee Name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
          />
        </Grid>

        {/* UI components for filtering */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Select Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.department}>
                {department.department}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Category Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Select Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {employeeCategories.map((category) => (
              <MenuItem key={category.id} value={category.categoryName}>
                {category.categoryName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Select Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="Paid">
              <strong>Paid</strong>
            </MenuItem>
            <MenuItem value="Pending">
              <strong>Pending</strong>
            </MenuItem>
          </TextField>
        </Grid>

        {/* Month Selector */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Select Month"
            value={selectedMonth}
            onChange={handleMonthChange}
            fullWidth
            size="small"
            variant="outlined"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {monthNames[i]}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Year Selector */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Select Year"
            value={selectedYear}
            onChange={handleYearChange}
            fullWidth
            size="small"
            variant="outlined"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i + 2020} value={i + 2020}>
                {i + 2020}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Total salaries display */}
        <Grid item xs={12} sm={6} md={3} container>
          <Typography variant="h6" align="right" padding={"5px"} fullWidth>
            Total salaries: {salaries.length}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={4} width={"100%"}>
        <TableContainer overFlowX={"auto"}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
              <TableRow sx={{ align: "center" }}>
                <TableCell sx={{ align: "center" }}>
                  <strong>Salary Id</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Emp Id</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Emp Name</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Category</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Department</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Basic Salary</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Working Days</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>HRA </strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>TA</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Incentive</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>SPI</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Medi Allowance</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Salary Before Taxes</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>PF</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>ESIC</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Prof Tax</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Income Tax</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Deducts</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Net Salary</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Month</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Year</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Payment Date</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Status</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Transaction ID</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Action</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Payslip</strong>
                </TableCell>
                <TableCell sx={{ align: "center" }}>
                  <strong>Info</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ align: "center" }} padding={"10px"}>
              {salaries.map((salary) => (
                <TableRow align={"center"} key={salary.id}>
                  <TableCell align={"center"}>{salary.id}</TableCell>
                  <TableCell align={"center"}>{salary.empID}</TableCell>
                  <TableCell align={"center"}>{salary.fullName}</TableCell>
                  <TableCell align={"center"}>
                    {salary.employeecategory}
                  </TableCell>
                  <TableCell align={"center"}>{salary.department}</TableCell>
                  <TableCell align={"center"}>{salary.basicSalary}</TableCell>
                  <TableCell align={"center"}>{salary.workingDays}</TableCell>
                  <TableCell align={"center"}>{salary.hraAllowance}</TableCell>
                  <TableCell align={"center"}>{salary.taAllowance}</TableCell>
                  <TableCell align={"center"}>{salary.incentive}</TableCell>
                  <TableCell align={"center"}>{salary.spi}</TableCell>
                  <TableCell align={"center"}>
                    {salary.medicalAllowance}
                  </TableCell>
                  <TableCell align={"center"}>
                    {salary.netSalaryBeforeTaxes}
                  </TableCell>
                  <TableCell align={"center"}>{salary.pf}</TableCell>
                  <TableCell align={"center"}>{salary.esic}</TableCell>
                  <TableCell align={"center"}>
                    {salary.professionalTax}
                  </TableCell>
                  <TableCell align={"center"}>{salary.incomeTax}</TableCell>
                  <TableCell align={"center"}>{salary.deductions}</TableCell>
                  <TableCell align={"center"}>
                    {salary.finalNetSalary}
                  </TableCell>
                  <TableCell align={"center"}>
                    {monthNames[salary.month - 1]}
                  </TableCell>
                  <TableCell align={"center"}>{salary.year}</TableCell>
                  <TableCell align={"center"}>{salary.paymentDate}</TableCell>
                  <TableCell
                    align={"center"}
                    style={{
                      color: salary.status === "Pending" ? "red" : "green",
                    }}
                  >
                    <strong>{salary.status}</strong>
                  </TableCell>
                  <TableCell align="center">
                    {transactionIdInputs[salary.id] !== undefined ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          fullWidth
                          label="Enter"
                          variant="outlined"
                          value={transactionIdInputs[salary.id]}
                          onChange={(e) =>
                            handleTransactionIdChange(salary.id, e)
                          }
                          sx={{ mb: "5px", flexGrow: 1 }}
                        />
                        <Button
                          color="warning"
                          size="small"
                          onClick={() => {
                            handleSaveTransactionId(salary.id);
                            // Clear the transactionIdInputs after saving
                            setTransactionIdInputs((prevState) => ({
                              ...prevState,
                              [salary.id]: undefined,
                            }));
                          }}
                          startIcon={<SaveIcon />}
                        />
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ flexGrow: 1 }}>
                          {salary.transactionId}
                        </span>
                        <Button
                          color="warning"
                          size="small"
                          onClick={() =>
                            setTransactionIdInputs((prevState) => ({
                              ...prevState,
                              [salary.id]: salary.transactionId,
                            }))
                          }
                          startIcon={<EditIcon />}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell align={"center"}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => updateStatus(salary.id)}
                    >
                      Pay
                    </Button>
                  </TableCell>
                  <TableCell align={"center"}>
                    <Button
                      open={showConfirmationDialog}
                      onClick={() => handleClickOpen(salary)}
                      variant="contained"
                      size="small"
                      color="success"
                    >
                      Open
                    </Button>
                  </TableCell>
                  <TableCell align={"center"}>
                    <Button
                      startIcon={<InfoIcon />}
                      onClick={() => handleInfoClick(salary)}
                      variant="outlined"
                      color="primary"
                    >
                      Info
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Info Dialog */}
      <Dialog open={showInfoPopup} onClose={handleCloseInfoPopup}>
        <DialogTitle>Salary Details</DialogTitle>
        <DialogContent>
          {infoPopupData && (
            <>
              <Typography variant="h6">
                {" "}
                Emp ID.: {infoPopupData.empID}
              </Typography>
              <Typography variant="h7">
                Salary ID.: {infoPopupData.id}
              </Typography>
              <Typography variant="body1">
                Employee: {infoPopupData.fullName}
              </Typography>
              <Typography variant="body1">
                Category: {infoPopupData.employeecategory}
              </Typography>
              <Typography variant="body1">
                Department: {infoPopupData.department}
              </Typography>
              <Typography variant="body1">
                Salary: {infoPopupData.basicSalary}
              </Typography>
              <Typography variant="body1">
                Final Net Salary: {infoPopupData.finalNetSalary}
              </Typography>
              <Typography variant="body1">
                Payment Date: {infoPopupData.paymentDate}
              </Typography>
              <Typography variant="body1">
                Status: <b>{infoPopupData.status}</b>
              </Typography>
              {/* Add other details as needed */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {infoPopupData && infoPopupData.status === "Pending" && (
            <Button color="error" onClick={handleOpenConfirmDeleteDialog}>
              Delete
            </Button>
          )}
          <Button onClick={handleCloseInfoPopup}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={showConfirmDeleteDialog}
        onClose={handleCloseConfirmDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this salary record?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showConfirmationDialog}
        onClose={() => setShowConfirmationDialog(false)}
      >
        <DialogTitle>Confirm Status Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update the status to "Paid"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmationDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateStatus(selectedSalaryIdForUpdate);
            }}
            color="primary"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* salary slip design starts  */}

      <Dialog
        open={open}
        onClose={handleClose}
        alignItems={"right"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: styles.dialogPaper,
        }}
      >
        {selectedSalary && (
          <Container
            ref={componentRef}
            maxWidth={"100%"}
            border={"0.5px solid lightgray"}
            sx={{ fontFamily: "Arial, sans-serif" }}
          >
            {/* <Grid
              container
              alignItems="center"
              display={"inline-flex"}
              justifyContent="center"
              padding={"15px"}
            >
              <Grid item xs={12} align="left" position={"relative"}>
                <img
                  src={logo}
                  alt="Logo"
                  className="logo mb-6"
                  style={{ width: "60px", marginBottom: "20px" }}
                />
                <Typography
                  color="black"
                  variant="subtitle1"
                  marginTop={"-20px"}
                >
                  <strong>PJSoftTech</strong>
                </Typography>
              </Grid>
              <Grid>
                <Typography
                  align="center"
                  sx={{ marginTop: "-80px", fontSize: "10px", color: "gray" }}
                >
                  <Typography color="black" variant="subtitle1">
                    <strong>PJSoftTech</strong>
                  </Typography>
                  203, 2ND FLOOR, Mangalmurti Complex, behind ABIL Tower,
                  hirabagh chowk, Tilak Road,
                  <br />
                  Shrukravar Peth, Pune-411002
                  <br />
                  Email: contact@pjsofttech.com
                </Typography>
              </Grid>
            </Grid> */}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              {/* Left side content (Institute Name, Address, Phone) */}
              <Box>
                <Typography variant="h6" align="left">
                  <Typography
                    variant="h6"
                    align="left"
                    sx={{ fontSize: "30px", color: "purple" }}
                  >
                    {employeeDetails.institutename || "Guest"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5, // Reduced margin-bottom for less space between the two addresses
                    }}
                  >
                    <Typography variant="body2">
                      {employeeDetails.address}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 0, // Reduced margin-top to bring the addresses closer
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Mobile : </strong>
                      {employeeDetails.phonenumber}
                    </Typography>
                  </Box>
                </Typography>
              </Box>

              {/* Right side content (Institute Image) */}
              {employeeDetails.instituteimage && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <img
                    src={employeeDetails.instituteimage}
                    alt="Institute Logo"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      borderRadius: "50%",
                    }} // Adjust size as needed
                  />
                </Box>
              )}
            </Box>

            <Typography
              variant="h6"
              align="center"
              mt={2}
              sx={{ fontWeight: "bold" }}
            >
              Salary Slip of Month {selectedMonthName} {selectedSalary.year}
            </Typography>

            <Table
              size="small"
              style={{
                marginBottom: "20px",
                border: "1px solid black",
                borderCollapse: "collapse",
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell style={{ border: "1px solid black" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Employee Name
                    </Typography>
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {selectedSalary.fullName}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Department
                    </Typography>
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {selectedSalary.department}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "1px solid black" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Category
                    </Typography>
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {selectedSalary.employeecategory}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Payment Date
                    </Typography>
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {selectedSalary.paymentDate}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ border: "1px solid black" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Working Days
                    </Typography>
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {selectedSalary.workingDays}
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      Transaction ID
                    </Typography>
                  </TableCell>
                  <TableCell style={{ border: "1px solid black" }}>
                    {selectedSalary.transactionId}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Table
                  size="small"
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ border: "1px solid black" }}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          Earnings
                        </Typography>
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          Amount
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earnings.map((earning, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ border: "1px solid black" }}>
                          {earning.label}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {earning.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell style={{ border: "1px solid black" }}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          Total Earnings
                        </Typography>
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {earnings.reduce(
                          (acc, earning) => acc + earning.amount,
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>

              <Grid item xs={6}>
                <Table
                  size="small"
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ border: "1px solid black" }}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          Deductions
                        </Typography>
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          Amount
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deductions.map((deduction, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ border: "1px solid black" }}>
                          {deduction.label}
                        </TableCell>
                        <TableCell style={{ border: "1px solid black" }}>
                          {deduction.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell style={{ border: "1px solid black" }}>
                        <Typography
                          variant="body1"
                          style={{ fontWeight: "bold" }}
                        >
                          Net Salary
                        </Typography>
                      </TableCell>
                      <TableCell style={{ border: "1px solid black" }}>
                        {selectedSalary.finalNetSalary}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
            </Grid>

            <Typography
              variant="body1"
              style={{ marginTop: "15px", textAlign: "center" }}
            >
              <strong>Amount in Words:</strong>{" "}
              {numberToWords(selectedSalary.finalNetSalary)} Only
            </Typography>

            <Grid container spacing={2} mt={10}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  <strong>Employer Sign</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ textAlign: "center" }}>
                  <strong>Employee Sign</strong>
                </Typography>
              </Grid>
            </Grid>
          </Container>
        )}

        <Box mt={2} align="center" padding={"20px"}>
          <Button
            onClick={handlePrint}
            variant="contained"
            color="primary"
            startIcon={<Print />}
          >
            Print
          </Button>
        </Box>
      </Dialog>

      {/* salary slip design ends  */}
    </div>
  );
};

export default SalaryTable;
