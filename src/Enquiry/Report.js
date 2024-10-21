import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { saveAs } from "file-saver";
import Swal from "sweetalert2"; // Import SweetAlert2
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  Button,
  Table,
  MenuItem,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Grid,
  Box,
  TablePagination,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsIcon from "@mui/icons-material/Sms";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import InfoIcon from "@mui/icons-material/Info"; // Importing InfoIcon
import { styled } from "@mui/system";
import html2pdf from "html2pdf.js"; // Importing html2pdf.js
import UpdateEnquiry from "../Enquiry/pages/UpdateInquiry";
import { Delete } from "@mui/icons-material";

export default function Report() {
  const navigate = useNavigate();
  const { id } = useParams();
  // const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpenDialog = (id) => {
    console.log("Dialog opening for ID:", id); // Debugging
    setSelectedInquiryId(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedInquiryId(null);
    setDialogOpen(false);
  };

  // State management
  const [inquiries, setInquiries] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [conductedBy, setConductedBy] = useState([]);

  // Filters state
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedConduct, setSelectedConduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  // New states for month and year
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [smsData, setSmsData] = useState({ mobile: "", content: "" });
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [page, setPage] = useState(0);
  const [selectedInquiry, setSelectedInquiry] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const getInstituteCode = () => localStorage.getItem("institutecode");

  // Additional state for viewing inquiry details
  const [viewInquiryOpen, setViewInquiryOpen] = useState(false);
  const [inquiryDetail, setInquiryDetail] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadUsers();
    loadExams();
    loadSources();
    loadConducts();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      loadUsers(startDate, endDate);
    }
  }, [startDate, endDate]);

  const loadUsers = async (start = "", end = "") => {
    let url = `https://pjsofttech.in:14443/get/getALLEnquiryByInstitutecode?institutecode=${getInstituteCode()}`;

    // Update URL based on date, month and year filters
    if (start && end) {
      url = `https://pjsofttech.in:14443/enquiryBetweenDates?startDate=${start}&endDate=${end}&institutecode=${getInstituteCode()}`;
    } else if (selectedYear && selectedMonth) {
      url = `https://pjsofttech.in:14443/enquiryByMonthAndYear?month=${selectedMonth}&year=${selectedYear}&institutecode=${getInstituteCode()}`;
    }

    try {
      const result = await axios.get(url);
      setInquiries(result.data);
    } catch (error) {
      // Handle the error
      console.error("Error fetching data:", error);

      // Optionally, you can set an error state to display an error message to the user
      setError(
        "An error occurred while fetching data. Please try again later."
      );
    }
  };

  const loadExams = async () => {
    try {
      const response = await axios.get(
        `https://pjsofttech.in:14443/getAllExam?institutecode=${getInstituteCode()}`
      );
      setExamOptions(response.data);
    } catch (error) {
      console.error("Error fetching exam options:", error);
    }
  };

  const loadSources = async () => {
    try {
      const response = await axios.get(
        `https://pjsofttech.in:14443/getAllSource?institutecode=${getInstituteCode()}`
      );
      setSourceOptions(response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const loadConducts = async () => {
    try {
      const response = await axios.get(
        `https://pjsofttech.in:14443/get/getAllConductModels?institutecode=${getInstituteCode()}`
      );
      setConductedBy(response.data);
    } catch (error) {
      console.error("Error fetching conducts:", error);
    }
  };

  const handleExamChange = (e) => {
    setSelectedExam(e.target.value);
    loadUsers();
  };

  const handleSourceChange = (e) => {
    setSelectedSource(e.target.value);
    loadUsers();
  };

  const handleConductChange = (e) => {
    setSelectedConduct(e.target.value);
    loadUsers();
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    loadUsers();
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleViewInquiry = (inquiry) => {
    setInquiryDetail(inquiry);
    setViewInquiryOpen(true);
  };

  const closeViewInquiry = () => {
    setViewInquiryOpen(false);
    setInquiryDetail(null);
  };

  const handleDelete = async (id) => {
    console.log("Delete button clicked"); // Debug log
    // Show the confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this enquiry? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      console.log("Confirmation dialog result:", result); // Debug log
      if (result.isConfirmed) {
        console.log("Confirmed delete"); // Debug log
        try {
          await axios.delete(`https://pjsofttech.in:14443/deleteenquiry/${id}`);
          console.log("Enquiry deleted successfully"); // Debug log
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The enquiry has been deleted.",
            showConfirmButton: false,
            timer: 1500,
          });
          //onClose(); // Close the form/modal
          loadUsers();
        } catch (error) {
          console.error("Error deleting enquiry:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `Error deleting enquiry: ${error.message}`,
          });
        }
      } else {
        console.log("Delete action cancelled"); // Debug log
      }
    });
  };

  // Month and year change handlers
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    loadUsers();
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    loadUsers();
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleGenerate = (instituteData) => {
    setSelectedInquiry(instituteData);
    setOpenReceipt(true);
  };
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
  const filterInquiries = () => {
    return inquiries.filter((inquiry) => {
      const matchesExam = selectedExam ? inquiry.exam === selectedExam : true;
      const matchesSource = selectedSource
        ? inquiry.source_by === selectedSource
        : true;
      const matchesConduct = selectedConduct
        ? inquiry.conduct_by === selectedConduct
        : true;
      const matchesStatus = selectedStatus
        ? inquiry.status1 === selectedStatus
        : true;

      // Filtering by month and year
      const inquiryDate = new Date(inquiry.enquiryDate);
      const matchesMonth = selectedMonth
        ? inquiryDate.getMonth() + 1 === parseInt(selectedMonth)
        : true;
      const matchesYear = selectedYear
        ? inquiryDate.getFullYear() === parseInt(selectedYear)
        : true;

      return (
        matchesExam &&
        matchesSource &&
        matchesConduct &&
        matchesStatus &&
        matchesMonth &&
        matchesYear
      );
    });
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

  const handleDownloadPDF = async () => {
    console.log("Download PDF clicked!");
    const doc = new jsPDF("landscape");
    const instituteImage = employeeDetails.instituteimage; // Get the institute image if available
    const instituteName = employeeDetails.institutename; // Fetch the institute name

    // Check if employeeDetails and image exist
    if (instituteImage) {
      const img = new Image();
      img.src = instituteImage;

      img.onload = () => {
        // Calculate positions for alignment
        const imageWidth = 40; // Width of the image
        const imageHeight = 30; // Height of the image
        const title = "Enquiries Report"; // Title

        // Calculate X position for centering
        const middleX = (doc.internal.pageSize.getWidth() - imageWidth) / 2; // Centered X position for image
        const imageY = 10; // Initial Y position for the image

        // Adding the image, institute name, and title in vertical alignment
        doc.addImage(img, "JPEG", middleX, imageY, imageWidth, imageHeight); // Place image
        doc.text(instituteName, middleX, imageY + imageHeight + 5); // Place institute name below image

        // Calculate the position for the title, centered above the table
        const titleWidth =
          (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const titleY = imageY + imageHeight + 15; // Position for title below institute name
        const titleX = (doc.internal.pageSize.getWidth() - titleWidth) / 2; // Centered X position for title

        doc.text(title, titleX, titleY); // Place title

        createTable(doc); // Function call to handle the table creation
        doc.save("report.pdf");
      };
    } else {
      const title = "Enquiries Report";
      const textWidth =
        (doc.getStringUnitWidth(instituteName) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;

      // Center if no image present
      const middleX = (doc.internal.pageSize.getWidth() - textWidth) / 2;

      doc.text(instituteName, middleX, 10);
      doc.text(title, middleX, 20);
      createTable(doc); // Create the table if no image
      doc.save("report.pdf");
    }
  };

  const createTable = (doc) => {
    const tableColumn = [
      "ID",
      "Date of Enquiry",
      "Name",
      "Phone",
      "Email",
      "Exam",
      "Source",
      "Conducted By",
      "Status",
      "Remark",
    ];

    const tableRows = [];
    const inquiries = filterInquiries();
    console.log(inquiries); // Check if valid data is returned

    inquiries.forEach((inquiry) => {
      const inquiryData = [
        inquiry.id,
        inquiry.enquiryDate,
        inquiry.name,
        inquiry.mobile,
        inquiry.email,
        inquiry.exam,
        inquiry.source_by,
        inquiry.conduct_by,
        inquiry.status1,
        inquiry.remark,
      ];
      tableRows.push(inquiryData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 60, // Adjust startY to avoid overlap with header
      theme: "striped",
      headStyles: { fillColor: [128, 0, 128] }, // Setting headStyles to purple
      styles: { fontSize: 8 },
    });
  };

  const handleDownloadCSV = () => {
    const csvContent = filterInquiries()
      .map(
        (inquiry) =>
          `${inquiry.id},${inquiry.enquiryDate},${inquiry.name},${inquiry.mobile},${inquiry.email},${inquiry.exam},${inquiry.source_by},${inquiry.conduct_by},${inquiry.status1},${inquiry.remark}`
      )
      .join("\n");

    const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(csvBlob, "report.csv");
  };

  const handleOpenSmsDialog = (inquiry) => {
    setSmsData({ mobile: inquiry.mobile, content: "" });
    setSmsDialogOpen(true);
  };

  const handleCloseSmsDialog = () => {
    setSmsDialogOpen(false);
  };

  const handleSendSms = async () => {
    try {
      await axios.post("https://pjsofttech.in:14443/sendSms", {
        mobile: smsData.mobile,
        content: smsData.content,
      });
      alert("SMS sent successfully");
      handleCloseSmsDialog();
    } catch (error) {
      console.error("Error sending SMS:", error);
      alert("Error sending SMS");
    }
  };

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

  const currentYear = new Date().getFullYear();

  // Generate an array of years from the past 7 to the next 7
  const years = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);

  const filteredInquiries = filterInquiries();
  const inquiryCount = filteredInquiries.length;

  return (
    <div sx={{ padding: 2, width: "100%" }}>
      <Box textAlign="center" sx={{ width: "100%" }}>
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
            marginBottom: "-2px",
          }}
        >
          Enquiry Report
        </PopTypography> */}

        <Grid container spacing={2} className="textField-root" mt={2}>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Select Exam"
              value={selectedExam}
              onChange={handleExamChange}
              fullWidth
              size="small"
              variant="outlined"
            >
              <MenuItem value="">
                <em>
                  <strong>All</strong>
                </em>
              </MenuItem>
              {examOptions.map((exam) => (
                <MenuItem key={exam.name} value={exam.name}>
                  {exam.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Select Conduct"
              value={selectedConduct}
              onChange={handleConductChange}
              fullWidth
              size="small"
              variant="outlined"
            >
              <MenuItem value="">
                <em>
                  <strong>All</strong>
                </em>
              </MenuItem>
              {conductedBy.map((conduct) => (
                <MenuItem key={conduct.name} value={conduct.name}>
                  {conduct.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Select Source"
              value={selectedSource}
              onChange={handleSourceChange}
              fullWidth
              size="small"
              variant="outlined"
            >
              <MenuItem value="">
                <em>
                  <strong>All</strong>
                </em>
              </MenuItem>
              {sourceOptions.map((source) => (
                <MenuItem key={source.name} value={source.name}>
                  {source.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Select Status"
              value={selectedStatus}
              onChange={handleStatusChange}
              fullWidth
              size="small"
              variant="outlined"
            >
              <MenuItem value="">
                <strong>All</strong>
              </MenuItem>
              <MenuItem value="Call Back">Call Back</MenuItem>
              <MenuItem value="Interested">Interested</MenuItem>
              <MenuItem value="Not Interested">Not Interested</MenuItem>
              <MenuItem value="DND">DND</MenuItem>
              <MenuItem value="Ringing">Ringing</MenuItem>
              <MenuItem value="Switch Off">Switch Off</MenuItem>
              <MenuItem value="Waiting">Waiting</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3} className="textField-root">
            <TextField
              InputLabelProps={{ shrink: true }}
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3} className="textField-root">
            <TextField
              InputLabelProps={{ shrink: true }}
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              fullWidth
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
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
                <em>
                  <strong>All Months</strong>
                </em>
              </MenuItem>
              {/* Add options for all months */}
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
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
                <em>
                  <strong>All Years</strong>
                </em>
              </MenuItem>
              {/* Populate the year dropdown with the calculated years */}
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} md={1.8}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </Grid>
          <Grid item xs={6} md={1.8}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadCSV}
            >
              Download CSV
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} justifyContent="flex-start" mt={1}>
          <Grid item>
            <Typography variant="h6" gutterBottom>
              Total Inquiries: {inquiryCount}
            </Typography>
          </Grid>
        </Grid>

        <Box mt={-5}>
          <TablePagination
            rowsPerPageOptions={[50, 100, 150]}
            component="div"
            count={filteredInquiries.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <TableContainer>
            <Table className="table-root">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Exam</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Conduct By</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>CallBack Date & Time</TableCell>
                  <TableCell>Remark</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterInquiries().map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>{inquiry.id}</TableCell>
                    <TableCell >
                      {inquiry.enquiryDate}
                    </TableCell>
                    <TableCell>{inquiry.name}</TableCell>
                    <TableCell>{inquiry.mobile}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.exam}</TableCell>
                    <TableCell>{inquiry.source_by}</TableCell>
                    <TableCell>{inquiry.conduct_by}</TableCell>
                    <TableCell
                     
                      style={{
                        color:
                          inquiry.status1 === "Call Back"
                            ? "orange"
                            : inquiry.status1 === "Interested"
                            ? "purple"
                            : inquiry.status1 === "Not Interested"
                            ? "red"
                            : inquiry.status1 === "DND"
                            ? "blue"
                            : inquiry.status1 === "Ringing"
                            ? "brown"
                            : inquiry.status1 === "Switch Off"
                            ? "green"
                            : inquiry.status1 === "Waiting"
                            ? "magenta"
                            : "magenta",
                      }}
                    >
                      <b>
                        <strong>{inquiry.status1}</strong>
                      </b>
                    </TableCell>
                    <TableCell
                     
                    >
                      <b>
                        {inquiry.status1 === "Call Back"
                          ? `${inquiry.callBackDate} ${inquiry.callBackTime}`
                          : "NA"}
                      </b>
                    </TableCell>
                    <TableCell>{inquiry.remark || "NA"}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => {
                            window.open(
                              `https://wa.me/91${inquiry.mobile}`,
                              "_blank"
                            );
                          }}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleOpenSmsDialog(inquiry)}
                        >
                          <SmsIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          variant="contained"
                          color="primary"
                          component={Link}
                          onClick={() => handleOpenDialog(inquiry.id)} // This should trigger the dialog opening
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleGenerate(inquiry)}
                          color="inherit"
                        >
                          <PrintIcon />
                        </IconButton>
                        {/* Info Icon for Viewing Inquiry Details */}
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewInquiry(inquiry)}
                        >
                          <InfoIcon />
                        </IconButton>
                        <IconButton>
                          <Delete
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(inquiry.id)}
                          ></Delete>
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle textAlign={"center"}>Update Enquiry</DialogTitle>
          <DialogContent>
            <UpdateEnquiry
              id={selectedInquiryId}
              onClose={() => setDialogOpen(false)} // Close dialog function
            />
          </DialogContent>
        </Dialog>

        {/* sms dialog  */}

        <Dialog open={smsDialogOpen} onClose={handleCloseSmsDialog}>
          <DialogTitle>Send SMS</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="content"
              label="SMS Content"
              type="text"
              fullWidth
              variant="standard"
              value={smsData.content}
              onChange={(e) =>
                setSmsData({ ...smsData, content: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSmsDialog}>Cancel</Button>
            <Button onClick={handleSendSms}>Send</Button>
          </DialogActions>
        </Dialog>

        {/* print receipt  */}

        <Dialog
          open={openReceipt}
          onClose={() => setOpenReceipt(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 1 }}>
            {selectedInquiry ? (
              <Box id="receipt" sx={{ p: 3 }}>
                {/* Heading */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
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
                          mb: 0.5,
                        }}
                      >
                        {employeeDetails.address && (
                          <Typography variant="body2">
                            <strong>Address: </strong>
                            {employeeDetails.address}
                          </Typography>
                        )}
                      </Box>
                      {employeeDetails.phonenumber && (
                        <Box sx={{ mt: 0 }}>
                          <Typography variant="body2">
                            <strong>Mobile: </strong>
                            {employeeDetails.phonenumber}
                          </Typography>
                        </Box>
                      )}
                      {employeeDetails.emailaddress && (
                        <Box sx={{ mt: 0 }}>
                          <Typography variant="body2">
                            <strong>Email: </strong>
                            {employeeDetails.emailaddress}
                          </Typography>
                        </Box>
                      )}
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
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    borderTop: "8px solid purple",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f3e5f5",
                  }}
                >
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Invoice No: {selectedInquiry.id}
                  </Typography>

                  {/* Enquiry Receipt centered */}
                  <Typography
                    component="span"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Enquiry Receipt
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
                      borderTop: "3px solid purple",
                      borderBottom: "3px solid purple",
                    }}
                  >
                    {selectedInquiry.name && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Name:</TableCell>
                        <TableCell>{selectedInquiry.name}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.mobile && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Phone No:
                        </TableCell>
                        <TableCell>{selectedInquiry.mobile}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.email && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Email:
                        </TableCell>
                        <TableCell>{selectedInquiry.email}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.enquiryDate && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Date of Enquiry:
                        </TableCell>
                        <TableCell>{selectedInquiry.enquiryDate}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.exam && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Exam / Course:
                        </TableCell>
                        <TableCell>{selectedInquiry.exam}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.source_by && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Source By:
                        </TableCell>
                        <TableCell>{selectedInquiry.source_by}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.conduct_by && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Conduct By:
                        </TableCell>
                        <TableCell>{selectedInquiry.conduct_by}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.status1 && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Status:
                        </TableCell>
                        <TableCell>
                          {selectedInquiry.status1 === "Call Back"
                            ? `${selectedInquiry.status1}, Date: ${
                                selectedInquiry.callBackDate || "N/A"
                              } Time: ${selectedInquiry.callBackTime}`
                            : selectedInquiry.status1}
                        </TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.remark && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Remark:
                        </TableCell>
                        <TableCell>{selectedInquiry.remark}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.dob && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>DOB:</TableCell>
                        <TableCell>{selectedInquiry.dob}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.gender && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Gender:
                        </TableCell>
                        <TableCell>{selectedInquiry.gender}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.motherTongue && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Mother Tongue:
                        </TableCell>
                        <TableCell>{selectedInquiry.motherTongue}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.address && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Address:
                        </TableCell>
                        <TableCell>{selectedInquiry.address}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.landmark && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Landmark:
                        </TableCell>
                        <TableCell>{selectedInquiry.landmark}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.state && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          State:
                        </TableCell>
                        <TableCell>{selectedInquiry.state}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.district && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          District:
                        </TableCell>
                        <TableCell>{selectedInquiry.district}</TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.fatherProfession && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Father's Profession:
                        </TableCell>
                        <TableCell>
                          {selectedInquiry.fatherProfession}
                        </TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.educationQualification && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Edu. Qualification:
                        </TableCell>
                        <TableCell>
                          {selectedInquiry.educationQualification}
                        </TableCell>
                      </TableRow>
                    )}
                    {selectedInquiry.annualIncome && (
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Annual Income:
                        </TableCell>
                        <TableCell>{selectedInquiry.annualIncome}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
            ) : null}
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => downloadReceipt(selectedInquiry)}
            >
              Download PDF
            </Button>
            <Button onClick={() => setOpenReceipt(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={viewInquiryOpen}
          onClose={closeViewInquiry}
          PaperProps={{ sx: { width: "600px", height: "auto" } }} // Custom dialog size
        >
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogContent>
            {inquiryDetail && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Using `gap` for spacing between fields */}
                {inquiryDetail.photo ? (
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <img
                      src={inquiryDetail.photo}
                      alt="Inquiry"
                      style={{
                        maxWidth: "150px", // Adjust the size as needed
                        width: "100%",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginTop: "-15px",
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <strong>Photo:</strong>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      No photo available.
                    </Typography>
                  </Box>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Name:</strong> {inquiryDetail.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Mobile:</strong> {inquiryDetail.mobile}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Email:</strong> {inquiryDetail.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Exam:</strong> {inquiryDetail.exam}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Source:</strong> {inquiryDetail.source_by}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Conducted By:</strong> {inquiryDetail.conduct_by}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Status:</strong> {inquiryDetail.status1}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Enquiry Date:</strong> {inquiryDetail.enquiryDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Remark:</strong> {inquiryDetail.remark}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>DOB:</strong> {inquiryDetail.dob}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Gender:</strong> {inquiryDetail.gender}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Mother Tongue:</strong>{" "}
                      {inquiryDetail.motherTongue}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Address:</strong> {inquiryDetail.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Landmark:</strong> {inquiryDetail.landmark}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>State:</strong> {inquiryDetail.state}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>District:</strong> {inquiryDetail.district}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Father's Profession:</strong>{" "}
                      {inquiryDetail.fatherProfession}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Education Qualification:</strong>{" "}
                      {inquiryDetail.educationQualification}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Annual Income:</strong>{" "}
                      {inquiryDetail.annualIncome}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeViewInquiry}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
