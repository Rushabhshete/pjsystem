import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
  IconButton,
  Box,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  Divider,
} from "@mui/material";
import html2pdf from "html2pdf.js"; // Importing html2pdf.js
import numberToWords from "number-to-words";
import axios from "axios";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import "jspdf-autotable";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import autoTable plugin
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  paymentMethodOption,
  paidByOptions,
  billTypeOptions,
} from "./DropdownData";
import "./Design.css";
import UpdateIncomeExpense from "./UpdateIncomeExpense";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PrintIcon from "@mui/icons-material/Print";
const AlertDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this entry?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this entry cannot be recovered
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        color="error"
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);
// Initialize SweetAlert2
const MySwal = withReactContent(Swal);
const Category = () => {
  const [category, setCategory] = useState("Income");
  const [dateRange, setDateRange] = useState("All");
  const [amount, setAmount] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [billType, setBillType] = useState("");
  const [paidBy, setPaidUsing] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [paymentMethod, setSelectedPaymentMethod] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);

  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const handleUpdatedData = (updatedData) => {
    setData(updatedData);
  };
  const getInstituteCode = () => localStorage.getItem("institutecode");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!getInstituteCode()) {
          console.error("No institutecode found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:8081/findInstitutesby/Institutecode?institutecode=${getInstituteCode()}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [getInstituteCode()]);

  const exportToCSV = () => {
    const headers = [
      "Invoice No.",
      "Type",
      "User",
      "Amount",
      "GST(%)",
      "Total(+GST)",
      "Paid",
      "Pending",
      "Due Date",
      "Bill Type",
      "Category Type",
      "Paid Using",
      "Perticuler",
      "Transaction ID",
      "Status",
    ];
    const csvRows = [headers.join(",")];

    filteredData.forEach((row) => {
      const values = [
        row.invoiceNo,
        row.type,
        row.user,
        row.amount,
        row.gst,
        row.total,
        row.payingAmount,
        row.pendingAmount,
        row.duedate,
        row.billType,
        row.category,
        row.paidBy,
        row.particular,
        row.transactionId,
        row.paymentMethod,
      ];
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${category}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const image = employeeDetails.instituteimage; // Actual image URL or base64 string
    const imageWidth = 20; // Set the desired width of the image
    const imageHeight = 20; // Set the desired height of the image

    // Heading
    doc.setFontSize(16);
    const heading = `${employeeDetails.institutename || "Guest"}`;
    const headingWidth = doc.getTextWidth(heading);

    // Subheading
    doc.setFontSize(12);
    const subheading = `${category} Report`;
    const subheadingWidth = doc.getTextWidth(subheading);

    // Reduce top margin and spacing
    const topMargin = 10; // Smaller top margin
    const spacing = 5; // Smaller spacing between elements

    // Starting Y-coordinate for vertical positioning
    const startY = topMargin; // Start from a smaller margin

    // Add institute image
    doc.addImage(
      image,
      "JPEG",
      (pageWidth - imageWidth) / 2,
      startY,
      imageWidth,
      imageHeight
    ); // Center the image

    // Center the heading
    doc.text(
      heading,
      (pageWidth - headingWidth) / 2,
      startY + imageHeight + spacing
    ); // Position below the image

    // Center the subheading
    doc.text(
      subheading,
      (pageWidth - subheadingWidth) / 2,
      startY + imageHeight + spacing + 16
    ); // Position below the heading

    // Define table headers and rows
    const headers = [
      [
        "Invoice No.",
        "User",
        "Date",
        "Phone No.",
        "Amount",
        "GST(%)",
        "Total(+GST)",
        "Paid",
        "Pending",
        "Due Date",
        "Bill Type",
        "Category Type",
        "Paid Using",
        "Particular",
        "Transaction ID",
        "Status",
      ],
    ];

    const rows = filteredData.map((row) => [
      row.invoiceNo,
      row.user,
      row.date,
      row.phoneNumber,
      row.amount,
      row.gst,
      row.total,
      row.payingAmount,
      row.pendingAmount,
      row.duedate,
      row.billType,
      row.category,
      row.paidBy,
      row.particular,
      row.transactionId,
      row.paymentMethod,
    ]);

    // Add the first table to the PDF
    doc.autoTable({
      head: headers,
      body: rows,
      startY: startY + imageHeight + spacing + 16 + 20, // Adjust to position below the title
      theme: "grid",
      styles: { fontSize: 8, fillColor: [255, 255, 255] }, // White text color
      headStyles: { fillColor: [128, 0, 128], textColor: [255, 255, 255] }, // Purple header background, white text
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto" },
        4: { cellWidth: "auto" },
        5: { cellWidth: "auto" },
        6: { cellWidth: "auto" },
        7: { cellWidth: "auto" },
        8: { cellWidth: "auto" },
        9: { cellWidth: "auto" },
        10: { cellWidth: "auto" },
      },
      didParseCell: function (data) {
        // Apply a different color for the "Status" column
        if (data.column.index === 13) {
          const status = data.cell.raw.toLowerCase();
          if (status === "pending" || status === "partial") {
            data.cell.styles.fillColor = [255, 223, 186]; // Light orange for "Pending" or "Partial"
          } else if (status === "complete") {
            data.cell.styles.fillColor = [144, 238, 144]; // Light green for "Complete"
          }
        }
      },
    });

    // Calculate totals and summary as before...
    const totalAmount = filteredData.reduce((sum, row) => sum + row.amount, 0);
    const total = filteredData.reduce((sum, row) => sum + row.total, 0);
    const totalPaid = filteredData.reduce(
      (sum, row) => sum + row.payingAmount,
      0
    );
    const totalPending = filteredData.reduce(
      (sum, row) => sum + row.pendingAmount,
      0
    );
    const totalInWords = toTitleCase(numberToWords.toWords(total));

    const additionalFields = [
      { label: "Total Amount", value: `${totalAmount.toFixed(2)}` },
      { label: "Total (+GST)", value: `${total.toFixed(2)}` },
      { label: "Total (+GST) in Words", value: `${totalInWords} Rupees Only` },
      { label: "Total Paid", value: `${totalPaid.toFixed(2)}` },
      { label: "Total Pending", value: `${totalPending.toFixed(2)}` },
    ];

    const summaryHeaders = [["Summary", ""]];
    const summaryRows = additionalFields.map((field) => [
      field.label,
      field.value,
    ]);

    // Add the summary table to the PDF
    doc.autoTable({
      head: summaryHeaders,
      body: summaryRows,
      startY: doc.lastAutoTable.finalY + 10,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [128, 0, 128], textColor: [255, 255, 255] }, // Purple header background, white text
    });

    // Signature section
    const signatureY = doc.lastAutoTable.finalY + 40;
    const signatureX = pageWidth - 60;

    doc.setFontSize(12);
    doc.text("Authorized Signature", signatureX, signatureY);
    doc.setLineWidth(0.5);
    doc.line(signatureX, signatureY + 2, signatureX + 50, signatureY + 2); // Draw a line for the signature

    // Save the PDF
    doc.save(`Complete_${category}_List.pdf`);
  };

  // Function to convert string to title case
  const toTitleCase = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${getInstituteCode()}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchIncomeData = async (timeframe, startDate, endDate) => {
    try {
      const response = await axios.get(
        `http://localhost:8087/income/${
          timeframe === "customdaterange"
            ? `customdaterange?institutecode=${getInstituteCode()}&startDate=${startDate}&endDate=${endDate}`
            : `getIncomeBy?institutecode=${getInstituteCode()}&timeframe=${timeframe}`
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching income data: ", error);
      return [];
    }
  };

  const fetchExpenseData = async (timeframe, startDate, endDate) => {
    try {
      const response = await axios.get(
        `http://localhost:8087/expense/${
          timeframe === "customdaterange"
            ? `customdaterange?institutecode=${getInstituteCode()}&startDate=${startDate}&endDate=${endDate}`
            : `getByTimeframe?institutecode=${getInstituteCode()}&timeframe=${timeframe}`
        }`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching expense data: ", error);
      return [];
    }
  };

  const fetchData = async () => {
    let result = [];
    let timeframe = dateRange.toLowerCase();

    // Check if filters are set to "All" and fetch all data
    if (
      billType === "All" &&
      categoryType === "All" &&
      paymentMethod === "All" &&
      paidBy === "All"
    ) {
      const url =
        category === "Income"
          ? `http://localhost:8087/incomes/getAllIncomesByinstitutecode?institutecode=${getInstituteCode()}`
          : `http://localhost:8087/expenses/getAllExpensesByInstitutecode?institutecode=${getInstituteCode()}`;

      try {
        const response = await axios.get(url);
        result = response.data;
      } catch (error) {
        console.error("Error fetching all data: ", error);
      }
    } else {
      switch (dateRange) {
        case "Today":
        case "7days":
        case "30days":
        case "365days":
          result =
            category === "Income"
              ? await fetchIncomeData(timeframe)
              : await fetchExpenseData(timeframe);
          break;
        case "Custom":
          if (customDateStart && customDateEnd) {
            result =
              category === "Income"
                ? await fetchIncomeData(
                    "customdaterange",
                    customDateStart,
                    customDateEnd
                  )
                : await fetchExpenseData(
                    "customdaterange",
                    customDateStart,
                    customDateEnd
                  );
          }
          break;
        default:
          const url =
            category === "Income"
              ? `http://localhost:8087/incomes/getAllIncomesByinstitutecode?institutecode=${getInstituteCode()}`
              : `http://localhost:8087/expenses/getAllExpensesByInstitutecode?institutecode=${getInstituteCode()}`;

          try {
            const response = await axios.get(url);
            result = response.data;
          } catch (error) {
            console.error("Error fetching data: ", error);
          }
          break;
      }
      // Apply additional filters
      if (billType && billType !== "All") {
        result = result.filter((item) => item.billType === billType);
      }

      if (categoryType && categoryType !== "All") {
        result = result.filter((item) => item.category === categoryType);
      }

      if (paymentMethod && paymentMethod !== "All") {
        result = result.filter((item) => item.paymentMethod === paymentMethod);
      }

      if (paidBy && paidBy !== "All") {
        result = result.filter((item) => item.paidBy === paidBy);
      }

      setData(result);
      handleFilter(result);
    }
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, [
    category,
    dateRange,
    customDateStart,
    customDateEnd,
    billType,
    paymentMethod,
    categoryType,
    paidBy,
  ]);

  useEffect(() => {
    handleFilter();
  }, [amount, searchUser, searchStatus, data]);

  // Handle filter changes
  const handleBillTypeChange = (event) => {
    setBillType(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSearchUserChange = (event) => {
    setSearchUser(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSearchStatus(event.target.value);
  };

  const handleCategoryTypeChange = (event) => {
    setCategoryType(event.target.value);
  };

  const handlePaidUsingChange = (event) => {
    setPaidUsing(event.target.value);
  };

  const handleCustomDateStartChange = (event) => {
    setCustomDateStart(event.target.value);
  };

  const handleCustomDateEndChange = (event) => {
    setCustomDateEnd(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const amountMatch = amount
        ? item.amount.toString().startsWith(amount)
        : true;
      const userMatch = searchUser
        ? item.user.toLowerCase().includes(searchUser.toLowerCase())
        : true;
      const statusMatch = searchStatus
        ? item.paymentMethod.toLowerCase().includes(searchStatus.toLowerCase())
        : true;
      return amountMatch && userMatch && statusMatch;
    });
    setFilteredData(filtered);
  };

  const handleEdit = (row) => {
    setCurrentData(row);
    setPopupOpen(true);
  };
  const handleDeleteClick = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id); // Proceed with deletion if confirmed
      }
    });
  };

  const handleDelete = async (id) => {
    const url =
      category === "Income"
        ? `http://localhost:8087/incomes/deleteIncome/${id}`
        : `http://localhost:8087/expenses/deleteExpense/${id}`;
    try {
      await axios.delete(url);
      fetchData();
      MySwal.fire("Deleted!", "Deleted Successfully.", "success"); // Success message
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  const StyledTableCell = styled(TableCell)(({ paymentMethod }) => ({
    fontSize: "0.8rem",
    color:
      paymentMethod === "Complete"
        ? "green"
        : paymentMethod === "Partial"
        ? "brown"
        : paymentMethod === "Pending"
        ? "red"
        : "inherit",
  }));

  // Existing styled PopTypography component
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

  const totalAmount = filteredData.reduce((acc, item) => acc + item.total, 0);
  const paidAmount = filteredData.reduce(
    (acc, item) => acc + item.payingAmount,
    0
  );
  const pendingAmount = filteredData.reduce(
    (acc, item) => acc + item.pendingAmount,
    0
  );
  const totalGST = filteredData.reduce(
    (sum, row) => sum + (row.total - row.amount || 0), // Calculate GST per entry
    0
  );
  const formatValue = (value) => Math.abs(value).toLocaleString();

  const handleGenerate = (instituteData) => {
    setSelectedRow(instituteData);
    setOpenReceipt(true);
  };

  const downloadReceipt = () => {
    const receiptElement = document.getElementById("receipt");

    // Ensure that images are fully loaded before creating the PDF
    html2pdf()
      .from(receiptElement)
      .set({
        margin: 0.2,
        filename: "receipt.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          logging: true, // Set this to true to get logs about image loading
          useCORS: true, // Enables cross-origin loading for images
        },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div>
      <ToastContainer
        autoClose={1000} // Toast will close automatically after 5 seconds
        position="top-right" // Position of the toast
        hideProgressBar={false} // Show or hide the progress bar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Grid container spacing={2} className="textField-root">
        <Grid item xs={12}>
          {/* <PopTypography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
              backgroundColor: "#24A0ED",
              borderRadius: "150px",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            {category} List
          </PopTypography> */}
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              select
              label="Type"
              value={category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              select
              label="Date Range"
              value={dateRange}
              onChange={handleDateRangeChange}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="365days">Last 365 Days</MenuItem>
              <MenuItem value="Custom">Custom Date Range</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        {dateRange === "Custom" && (
          <>
            <Grid item xs={6} md={1.8}>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="date"
                  label="Start Date"
                  value={customDateStart}
                  onChange={handleCustomDateStartChange}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6} md={1.8}>
              <FormControl fullWidth>
                <TextField
                  size="small"
                  type="date"
                  label="End Date"
                  value={customDateEnd}
                  onChange={handleCustomDateEndChange}
                  InputLabelProps={{ shrink: true }}
                />
              </FormControl>
            </Grid>
          </>
        )}
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              select
              label="Bill Type"
              value={billType}
              onChange={handleBillTypeChange}
            >
              <MenuItem value="All">All</MenuItem>
              {billTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              select
              label="Category"
              value={categoryType}
              onChange={handleCategoryTypeChange}
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map((option) => (
                <MenuItem key={option.id} value={option.categoryName}>
                  {option.categoryName}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              select
              label="Payment Method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <MenuItem value="All">All</MenuItem>
              {paymentMethodOption.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              select
              label="Paid Using"
              value={paidBy}
              onChange={handlePaidUsingChange}
            >
              <MenuItem value="All">All</MenuItem>
              {paidByOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              label="Search By User Name"
              value={searchUser}
              onChange={handleSearchUserChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              label="Search By Amount"
              value={amount}
              onChange={handleAmountChange}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6} md={1.8}>
          <FormControl fullWidth>
            <TextField
              size="small"
              label="Search By Status"
              value={searchStatus}
              onChange={handleStatusChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <Button variant="contained" color="primary" onClick={exportToPDF}>
            Download PDF
          </Button>
        </Grid>
        <Grid item xs={6} md={1.8}>
          <Button
            variant="contained"
            color="primary"
            onClick={exportToCSV}
            // style={{ marginLeft: "-20px" }}
          >
            Download CSV
          </Button>
        </Grid>

        <Box display="flex" marginTop="20px" className="MuiTypography-root">
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginRight: 10, whiteSpace: "nowrap", marginLeft: 5 }}
          >
            Total Amount (+GST) : ₹ {formatValue(totalAmount)}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginRight: 10, whiteSpace: "nowrap", marginLeft: 5 }}
          >
            Total GST Amount : ₹ {formatValue(totalGST)}
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ marginRight: 10, whiteSpace: "nowrap" }}
          >
            Paid Amount : ₹ {formatValue(paidAmount)}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ whiteSpace: "nowrap" }}>
            Pending Amount : ₹ {formatValue(pendingAmount)}
          </Typography>
        </Box>
      </Grid>
      <TablePagination
        rowsPerPageOptions={[50, 100, 150]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
      <Table className="table-root">
        <TableHead>
          <TableRow>
            {/* <StyledTableCell >
              Type
            </StyledTableCell> */}
            <TableCell>ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Amt</TableCell>
            <TableCell>GST Amt</TableCell>
            <TableCell>Total(+Gst)</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Bill Type</TableCell>
            <TableCell>Category Type</TableCell>
            <TableCell>Paid Using</TableCell>
            <TableCell>Invoice No</TableCell>
            <TableCell>Status</TableCell>

            <TableCell >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id}>
                {/* <TableCell>{row.type}</TableCell> */}
                <TableCell style={{ whiteSpace: "nowrap" }}>{row.id}</TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {row.user}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {" "}
                  {row.date}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {row.phoneNumber}
                </TableCell>
                <TableCell> ₹{row.amount}</TableCell>
                <TableCell>₹{row.total - row.amount}</TableCell>
                <TableCell>₹{row.total}</TableCell>
                <TableCell>₹{row.payingAmount}</TableCell>
                <TableCell>
                  {row.pendingAmount === 0 ? "NA" : `₹${row.pendingAmount}`}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {row.duedate ? row.duedate : "NA"}
                </TableCell>

                <TableCell>{row.billType}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.paidBy}</TableCell>
                <TableCell>{row.invoiceNo}</TableCell>
                <TableCell paymentMethod={row.paymentMethod}>
                  {row.paymentMethod}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  <IconButton onClick={() => handleEdit(row)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(row.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>

                  <IconButton>
                    <EmailIcon color="warning" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => {
                      let message = "";
                      if (row.paymentMethod === "Pending") {
                        message = "Your payment is pending."; // Message for pending payments
                      } else if (row.paymentMethod === "Partial") {
                        message = "Pay your remaining payment ASAP."; // Message for partial payments
                      } else {
                        message = "Hello!"; // Default message if no specific condition is met
                      }

                      // Encode the message and open WhatsApp
                      const encodedMessage = encodeURIComponent(message);
                      window.open(
                        `https://wa.me/91${row.phoneNumber}?text=${encodedMessage}`,
                        "_blank"
                      );
                    }}
                  >
                    <WhatsAppIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => handleGenerate(row)}
                    color="inherit"
                  >
                    <PrintIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {popupOpen && (
        <UpdateIncomeExpense
          open={popupOpen}
          handleClose={() => setPopupOpen(false)}
          data={currentData}
          handleUpdatedData={handleUpdatedData}
        />
      )}

      <Dialog
        open={openReceipt}
        onClose={() => setOpenReceipt(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 1 }}>
          {selectedRow ? (
            <Box id="receipt" sx={{ p: 3 }}>
              {/* Heading */}

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
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

              {/* Invoice Number and Date */}

              <Typography
                variant="body2"
                align="center"
                sx={{
                  borderTop: "8px solid purple", // Thick top border
                  padding: "10px", // Padding for spacing
                  display: "flex", // To align the content in a row with space between
                  justifyContent: "space-between", // Evenly space the items
                  gap: "20px", // Gap between the data elements for spacing
                  backgroundColor: "#f3e5f5", // Light purple background
                }}
              >
                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Invoice No: {selectedRow.invoiceNo}
                  </Typography>
                </Typography>

                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    {selectedRow.type} Receipt
                  </Typography>
                </Typography>

                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Invoice Date: {new Date().toLocaleDateString()}
                  </Typography>
                </Typography>
              </Typography>

              {/* Table with Data */}
              <Table
                size="small"
                sx={{
                  marginTop: "10px",
                  textAlign: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <TableBody
                  sx={{
                    borderTop: "3px solid purple", // Thick top border
                    borderBottom: "3px solid purple",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Name:</TableCell>
                    <TableCell sx={{}}>{selectedRow.user}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Phone No:</TableCell>
                    <TableCell sx={{}}>{selectedRow.phoneNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Category Type:
                    </TableCell>
                    <TableCell sx={{}}>{selectedRow.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Particular:
                    </TableCell>
                    <TableCell sx={{}}>
                      {selectedRow.particular || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Payment Mode:
                    </TableCell>
                    <TableCell sx={{}}>{selectedRow.paidBy}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Transaction ID:
                    </TableCell>
                    <TableCell sx={{}}>
                      {selectedRow.transactionId || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Due Date:</TableCell>
                    <TableCell sx={{}}>
                      {selectedRow.duedate || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Amount:</TableCell>
                    <TableCell sx={{}}>₹{selectedRow.amount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>GST (%):</TableCell>
                    <TableCell sx={{}}>
                      {selectedRow.gst}% (₹
                      {(selectedRow.gst / 100) * selectedRow.amount})
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Paid:</TableCell>
                    <TableCell sx={{}}>₹{selectedRow.payingAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Pending:</TableCell>
                    <TableCell sx={{}}>₹{selectedRow.pendingAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Amount (+GST):
                    </TableCell>
                    <TableCell sx={{}}>₹{selectedRow.total}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {/* Typography aligned similarly to table */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "3px solid purple",
                  marginTop: "10px",
                  padding: "10px 0", // Optional: Adds some padding around
                }}
              >
                {/* Left side for label */}
                <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
                  Total Amount In Words:
                </Typography>

                {/* Right side for the amount in words */}
                <Typography sx={{ textAlign: "right", fontWeight: "bold" }}>
                  {numberToWords.toWords(selectedRow.total)} Rupees Only
                </Typography>
              </Box>
            </Box>
          ) : null}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => downloadReceipt(selectedRow)}
          >
            Download PDF
          </Button>
          <Button onClick={() => setOpenReceipt(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Category;
