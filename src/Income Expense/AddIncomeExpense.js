import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Checkbox,
  FormControlLabel,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  typeOptions,
  billTypeOptions,
  paidByOptions,
  paymentMethodOption,
} from "./DropdownData";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/system";
import axios from "axios";
import { debounce } from "lodash"; // Import debounce function from lodash
import jsPDF from "jspdf"; // Import jsPDF from jspdf
import numberToWords from "number-to-words";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

// Custom styles for Dialog
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  "& .MuiIconButton-root": {
    color: theme.palette.grey,
  },
}));

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

const AddIncomeExpense = () => {
  const [formData, setFormData] = useState({
    type: "",
    user: "",
    date: "",
    category: "",
    particular: "",
    amount: "",
    gst: "0",
    total: "",
    paymentMethod: "",
    payingAmount: "",
    pendingAmount: "",
    billType: "",
    paidBy: "",
    transactionId: "",
    duedate: "",
    remark: "",
    invoiceNo: "",
  });

  const [showGst, setShowGst] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);
  const [submittedData, setSubmittedData] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const getInstituteCode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/users/getAllUserByinstitutecode?institutecode=${getInstituteCode()}`
        );
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize with all users
        setLoading(false);
      } catch (error) {
        setError("Error fetching users. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${getInstituteCode()}`
        );
        setCategories(response.data);
      } catch (error) {
        setError("Error fetching categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.amount) {
      const amount = parseFloat(formData.amount);
      let total = amount;

      if (showGst && formData.gst) {
        const gst = parseFloat(formData.gst);
        total += (amount * gst) / 100;
      }

      setFormData((prevState) => ({
        ...prevState,
        total: total.toFixed(2),
      }));
    }
  }, [formData.amount, formData.gst, showGst]);

  useEffect(() => {
    if (formData.total && formData.payingAmount) {
      const totalAmount = parseFloat(formData.total);
      const payingAmount = parseFloat(formData.payingAmount);
      const pendingAmount = totalAmount - payingAmount;
      setFormData((prevState) => ({
        ...prevState,
        pendingAmount: pendingAmount >= 0 ? pendingAmount : 0,
      }));
    }
  }, [formData.total, formData.payingAmount]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setShowGst(checked);
    } else {
      setFormData((prevState) => {
        const newState = { ...prevState, [name]: value };

        // Check if paymentMethod is "Complete"
        if (name === "paymentMethod") {
          if (value === "Complete") {
            newState.payingAmount = newState.total;
            newState.pendingAmount = 0;
          } else {
            // Reset payingAmount and pendingAmount if paymentMethod is not "Complete"
            newState.payingAmount = "";
            newState.pendingAmount =
              newState.total - (parseFloat(newState.payingAmount) || 0);
          }
        }

        // Handle search term update for user
        if (name === "user") {
          setSearchTerm(value);
          if (value.length >= 3) {
            setAnchorEl(inputRef.current);
          } else {
            setAnchorEl(null);
          }
        }

        return newState;
      });
    }
  };

  // Debounce the search function to improve performance
  // Memoize the debounce function
  const debouncedSearch = useCallback(
    debounce((term, users) => {
      const filtered = term
        ? users.filter((user) =>
            user.userName.toLowerCase().includes(term.toLowerCase())
          )
        : users;
      setFilteredUsers(filtered);
    }, 500),
    []
  );

  // Function to handle the search term change
  const handleSearch = (term) => {
    setSearchTerm(term);
    debouncedSearch(term, users);
  };

  useEffect(() => {
    debouncedSearch(searchTerm, users);
    // Cleanup the debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, users, debouncedSearch]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const integerFormData = {
      ...formData,
      amount: Math.floor(parseFloat(formData.amount)),
      gst: Math.floor(parseFloat(formData.gst)),
      total: Math.floor(parseFloat(formData.total)),
      payingAmount: Math.floor(parseFloat(formData.payingAmount)),
      pendingAmount: Math.floor(parseFloat(formData.pendingAmount)),
    };

    const apiUrl =
      formData.type === "Income"
        ? `http://localhost:8087/incomes/save?institutecode=${getInstituteCode()}`
        : `http://localhost:8087/expenses/save?institutecode=${getInstituteCode()}`;

    try {
      const response = await axios.post(apiUrl, integerFormData);

      const responseData = response.data;
      const submittedId = responseData.id;

      console.log("Submitted ID:", submittedId); // Log the ID to the console

      // Determine the GET API URL based on the type
      const getApiUrl =
        formData.type === "Income"
          ? `http://localhost:8087/incomes/getIncomeById/${submittedId}`
          : `http://localhost:8087/expenses/getExpenseById/${submittedId}`;

      // Fetch the data using the ID
      const getResponse = await axios.get(getApiUrl);
      const fetchedData = getResponse.data;

      console.log("Fetched Data:", fetchedData); // Log the fetched data
      MySwal.fire("Success", "Form Submitted Successfully", "success");


     // Store the fetched data for display
      setOpenDialog(true);
      setSubmittedData(fetchedData);


      // Reset form data
      setFormData({
        type: "",
        user: "",
        date: "",
        category: "",
        particular: "",
        amount: "",
        gst: "0",
        total: "",
        paymentMethod: "",
        payingAmount: "",
        pendingAmount: "",
        billType: "",
        paidBy: "",
        transactionId: "",
        gstNumber: "",
        duedate: "",
        remark: "",
      });
      setSearchTerm("");
      setShowGst(false);
    } catch (error) {
      MySwal.fire("Error", "Error While Submitting the form", "error");
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "",
      user: "",
      date: "",
      category: "",
      particular: "",
      amount: "",
      gst: "0",
      total: "",
      paymentMethod: "",
      payingAmount: "",
      pendingAmount: "",
      billType: "",
      paidBy: "",
      transactionId: "",
      gstNumber: "",
      duedate: "",
      remark: "",
    });
    setSearchTerm("");
    setShowGst(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (userName) => {
    setFormData((prevState) => ({
      ...prevState,
      user: userName,
    }));
    setSearchTerm(""); // Clear search term
    setAnchorEl(null); // Close dropdown
  };

  const handlePrint = () => {
    const doc = new jsPDF();

    const maxWidth = 60; // Adjust as needed for your layout

    const instituteName = employeeDetails.institutename || "Guest";
    const receiptTitle = `${submittedData.user} ${submittedData.type} Receipt`;

    // Function to center align a string
    const centerAlign = (text) => {
      const padding = Math.max(0, Math.floor((maxWidth - text.length) / 2));
      return text;
    };

    // Get the page width for positioning
    const pageWidth = doc.internal.pageSize.getWidth();

    // Prepare titles
    const titleLine = `${centerAlign(instituteName)}   ${centerAlign(receiptTitle)}`;

    // Load the image (ensure it's base64 encoded)
const instituteImage = employeeDetails.instituteimage; // Make sure this is in base64 format
if (instituteImage) {
    const imageX = pageWidth - 35; // X-coordinate for the image
    const imageY = 10; // Y-coordinate for the image
    const imageWidth = 30; // Width of the image
    const imageHeight = 30; // Height of the image (should be the same as width for a circle)

    // Draw a circle behind the image
    const radius = imageWidth / 2; // Radius of the circle (half of the width)
    const centerX = imageX + radius; // Center X for the circle
    const centerY = imageY + radius; // Center Y for the circle

    // Draw the circular border
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0); // Set border color (black)
    doc.circle(centerX, centerY, radius, 'S'); // Draw the circle border

    // Add the image on top of the circle
    doc.addImage(instituteImage, 'JPEG', imageX, imageY, imageWidth, imageHeight); // Place the image
}


    // Generated date
    const generatedDate = `Generated On: ${new Date().toLocaleDateString()}`;

    // Invoice number on top-left corner
    const invoiceNo = `Invoice No: ${submittedData.invoiceNo}`;

    doc.setFontSize(16);
    doc.text(titleLine, 15, 20); // Adjust positioning as needed

    // Generated date on the top right
    doc.setFontSize(12);
    doc.text(
      generatedDate,
      pageWidth - doc.getTextWidth(generatedDate) - 15,
      35
    );

    // Invoice number on the top left
    doc.text(invoiceNo, 15, 35);

    // Prepare table data with labels and one key-value pair per row
    const tableData = [];
    const labels = {
      amount: "Amount",
      billType: "Bill Type",
      category: "Category",
      date: "Date",
      gst: "GST",
      id: "ID",
      paidBy: "Paid By",
      particular: "Particular",
      payingAmount: "Paying Amount",
      paymentMethod: "Payment Method",
      pendingAmount: "Pending Amount",
      remark: "Remark",
      total: "Total",
      transactionId: "Transaction ID",
      type: "Type",
      user: "User",
    };

    // Filter out unwanted fields from table
    const entries = Object.entries(submittedData).filter(
      ([key]) => key !== "invoiceNo" && key !== "institutecode"
    );

    // Create rows with one field-value pair per row
    for (const [key, value] of entries) {
      tableData.push([
        {
          content: `${labels[key] || capitalizeFirstLetter(key)}:`,
          styles: { fontStyle: "bold" },
        },
        value,
      ]);
    }

    // Add total amount in words as a row in the table
    const totalInWords = numberToWords.toWords(submittedData.total);
    tableData.push([
      { content: "Total in Words:", styles: { fontStyle: "bold" } },
      totalInWords,
    ]);

    // Adjust marginTop as needed
    const marginTop = 35; // Space between title and table
    doc.autoTable({
      body: tableData,
      theme: "grid",
      startY: 45 + marginTop, // Start below the title
      columnStyles: {
        0: { fontStyle: "bold" }, // Make the first column (Field) bold
      },
      margin: { top: 20 }, // Adjust the margin if needed
      styles: {
        cellPadding: 2, // Adjust cell padding if needed
      },
      columnStyles: {
        0: { cellWidth: "auto" }, // Adjust column width for key
        1: { cellWidth: "auto" }, // Adjust column width for value
      },
    });

    // Add section for authorized signature below the table
    doc.text("Authorized Signature:", 15, doc.lastAutoTable.finalY + 30);
    doc.line(
      15,
      doc.lastAutoTable.finalY + 32,
      80,
      doc.lastAutoTable.finalY + 32
    ); // Draw line for signature

    doc.save(`${submittedData.user}_data.pdf`);
};


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div>
      <ToastContainer />

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
        Add {formData.type || "Income/Expense"}
      </PopTypography> */}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} className="textField-root">
          {/* Dropdown Fields */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Type"
                name="type"
                required
                InputLabelProps={{ className: "required-asterisk" }}
                value={formData.type}
                onChange={handleChange}
                select
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                labelId="user-input-label"
                label="User"
                name="user"
                value={formData.user}
                onChange={handleChange}
                onClick={handleClick}
                fullWidth
                variant="outlined"
                inputRef={inputRef}
              />
            </FormControl>
            {filteredUsers.length > 0 && anchorEl && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {filteredUsers.map((user) => (
                  <MenuItem
                    key={user.id}
                    onClick={() => handleSelect(user.userName)}
                  >
                    {user.userName}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Grid>
          {/* Other Fields */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ shrink: true, className: "required-asterisk" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                required
                InputLabelProps={{ className: "required-asterisk" }}
                onChange={handleChange}
                select
              >
                {categories.map((option) => (
                  <MenuItem key={option.id} value={option.categoryName}>
                    {option.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Particular"
              name="particular"
              value={formData.particular}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              required
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
            />
          </Grid>

          {/* GST Checkbox */}
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showGst}
                  onChange={handleChange}
                  name="showGst"
                />
              }
              label="Include GST"
            />
          </Grid>
          {showGst && (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="number"
                  label="GST (%)"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  //type="number"
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={3}>
            <TextField
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                required
                InputLabelProps={{ className: "required-asterisk" }}
                onChange={handleChange}
                select
              >
                {paymentMethodOption.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount Paying"
              name="payingAmount"
              value={
                formData.paymentMethod === "Pending" ? 0 : formData.payingAmount
              }
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
              disabled={formData.paymentMethod === "Pending"} // Disable input if paymentMethod is "Pending"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount Pending"
              name="pendingAmount"
              value={formData.pendingAmount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          {formData.paymentMethod === "Partial" ||
          formData.paymentMethod === "Pending" ? (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Due Date"
                  name="duedate"
                  type="date"
                  value={formData.duedate}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                    className: "required-asterisk",
                  }}
                />
              </Grid>
            </>
          ) : null}

          {formData.paymentMethod === "Partial" ||
          formData.paymentMethod === "Complete" ? (
            <>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Bill Type"
                    name="billType"
                    value={
                      formData.billType === "Pending" ? 0 : formData.billType
                    }
                    required
                    onChange={handleChange}
                    select
                    InputLabelProps={{ className: "required-asterisk" }}
                    variant="outlined"
                    disabled={formData.paymentMethod === "Pending"} // Disable input if paymentMethod is "Pending"
                  >
                    {billTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    label="Paid Using"
                    name="paidBy"
                    value={
                      formData.paidBy === "Pending"
                        ? "Pending"
                        : formData.paidBy
                    }
                    required
                    onChange={handleChange}
                    select
                    InputLabelProps={{ className: "required-asterisk" }}
                    variant="outlined"
                    disabled={formData.paymentMethod === "Pending"} // Disable input if paymentMethod is "Pending"
                  >
                    {paidByOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              {formData.paidBy !== "Cash" && (
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Transaction ID"
                    name="transactionId"
                    value={
                      formData.transactionId === "Pending"
                        ? "Pending"
                        : formData.transactionId
                    }
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ className: "required-asterisk" }}
                    disabled={formData.paymentMethod === "Pending"} // Disable input if paymentMethod is "Pending"
                  />
                </Grid>
              )}
            </>
          ) : null}

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
            marginTop="10px"
          >
            <Grid item xs={12} sm={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ height: "56px" }}
              >
                Submit
              </Button>
            </Grid>
            {/* <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
                fullWidth
                sx={{ height: "56px" }}
              >
                Cancel
              </Button>
            </Grid> */}
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          {submittedData.user} {submittedData.type} Data
          <IconButton aria-label="close" onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead></TableHead>
              <TableBody>
                {Object.entries(submittedData)
                  .reduce((rows, [key, value], index) => {
                    const rowIndex = Math.floor(index / 2);
                    if (!rows[rowIndex]) {
                      rows[rowIndex] = [];
                    }
                    rows[rowIndex].push({
                      key: capitalizeFirstLetter(key),
                      value,
                    });

                    return rows;
                  }, [])
                  .map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <StyledTableCell>
                        {row[0] ? `${row[0].key}:` : ""}
                      </StyledTableCell>
                      <TableCell>{row[0] ? row[0].value : ""}</TableCell>
                      <StyledTableCell>
                        {row[1] ? `${row[1].key}:` : ""}
                      </StyledTableCell>
                      <TableCell>{row[1] ? row[1].value : ""}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePrint}>Download PDF</Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddIncomeExpense;
