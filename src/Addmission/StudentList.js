
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Import WhatsApp Icon
import InfoIcon from "@mui/icons-material/Info"; // Importing InfoIcon
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  MenuItem,
  TextField,
  Grid,
  Button,
  IconButton,
  Dialog,
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Typography,
  TablePagination,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import UpdateAdmissionForm from "./UpdateAdmissionForm";
import { Link } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import html2pdf from "html2pdf.js"; // Importing html2pdf.js

const DownloadButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

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

const StudentList = () => {
  const [admissions, setAdmissions] = useState([]);
  const [timeRange, setTimeRange] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedGuide, setSelectedGuide] = useState("");
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // New state for status
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [sources, setSources] = useState([]);
  const [guide, setGuide] = useState([]);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [currentAdmission, setCurrentAdmission] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const institutecode = localStorage.getItem("institutecode");
  const [admissionIdToDelete, setAdmissionIdToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [selectedPrintAdmission, setSelectedPrintAdmission] = useState(false);
  const [openReceipt, setOpenReceipt] = useState(false);
  const handleGenerate = (instituteData) => {
    setSelectedPrintAdmission(instituteData);
    setOpenReceipt(true);
  };

      // Additional state for viewing inquiry details
      const [viewAdmissionOpen, setViewAdmissionOpen] = useState(false);
      const [admissionDetail, setAdmissionDetail] = useState(null);


      const handleViewAdmission = (admission) => {
        setAdmissionDetail(admission);
        setViewAdmissionOpen(true);
      };
    
      const closeViewAdmission = () => {
        setViewAdmissionOpen(false);
        setAdmissionDetail(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sourceResponse, courseResponse, guideResponse] =
          await Promise.all([
            axios.get(
              `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
            ),
            axios.get(
              `http://localhost:8085/getAllCourse?institutecode=${institutecode}`
            ),
            axios.get(
              `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
            ),
          ]);

        setSources(sourceResponse.data);
        setCourses(courseResponse.data);
        setGuide(guideResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [institutecode]);

  const [employeeDetails, setEmployeeDetails] = useState(null);
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
    const fetchAdmissions = async () => {
      try {
        let admissionResponse;
        switch (timeRange) {
          case "Today":
            admissionResponse = await axios.get(
              `http://localhost:8085/getAdmissionsByTodayByInstitutecode?institutecode=${institutecode}`
            );
            break;
          case "7Days":
            admissionResponse = await axios.get(
              `http://localhost:8085/AdmissionIn7DaysData?institutecode=${institutecode}`
            );
            break;
          case "30Days":
            admissionResponse = await axios.get(
              `http://localhost:8085/AdmissionIn30DaysData?institutecode=${institutecode}`
            );
            break;
          case "365Days":
            admissionResponse = await axios.get(
              `http://localhost:8085/AdmissionIn365DaysData?institutecode=${institutecode}`
            );
            break;
          case "Custom":
            admissionResponse = await axios.get(
              `http://localhost:8085/admissionsBetweenDates?institutecode=${institutecode}&startDate=${startDate}&endDate=${endDate}`
            );
            break;
          default:
            admissionResponse = await axios.get(
              `http://localhost:8085/admissions?institutecode=${institutecode}`
            );
            break;
        }
        setAdmissions(admissionResponse.data);
      } catch (error) {
        console.error("Error fetching admissions:", error);
      }
    };

    fetchAdmissions();
  }, [institutecode, timeRange, startDate, endDate]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
    if (event.target.value !== "Custom") {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleSourceChange = (event) => {
    setSelectedSource(event.target.value);
  };

  const handlePaymentModeChange = (event) => {
    setSelectedPaymentMode(event.target.value);
  };

  const handleCourseMethodChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleGuideChange = (event) => {
    setSelectedGuide(event.target.value);
  };

  const handleStatusChange = (event) => {
    // New handler for status change
    setSelectedStatus(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleWhatsAppClick = (mobile1) => {
    const url = `https://wa.me/${mobile1}`; // Format: wa.me/1234567890
    window.open(url, '_blank'); // Open WhatsApp in new tab
  };

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((admission) => {
      const matchesSource = selectedSource
        ? admission.sourceBy === selectedSource
        : true;
      const matchesCourse = selectedCourse
        ? admission.courses === selectedCourse
        : true;
      const matchesPaymentMode = selectedPaymentMode
        ? admission.paymentMode === selectedPaymentMode
        : true;
      const matchesGuideName = selectedGuide
        ? admission.guideName === selectedGuide
        : true;
      const matchesStatus = selectedStatus
        ? admission.paymentMethod === selectedStatus
        : true; // filtering by status
      const matchesSearchQuery = admission.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return (
        matchesSource &&
        matchesCourse &&
        matchesGuideName &&
        matchesPaymentMode &&
        matchesStatus &&
        matchesSearchQuery
      );
    });
  }, [
    admissions,
    selectedSource,
    selectedCourse,
    selectedGuide,
    selectedPaymentMode,
    selectedStatus,
    searchQuery,
  ]);

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Load the image
    const imgData = employeeDetails.instituteimage; // Assuming it's a base64 string or URL

    // Calculate the vertical center position
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const startY = 20;

    // Add institute image (you may need to adjust the width/height)
    if (imgData) {
      doc.addImage(imgData, "JPEG", centerX - 30, startY, 60, 30); // Adjust the size and position as needed
    }

    // Add title
    const title = "Admission Report";
    const instituteName = employeeDetails.institutename;

    doc.setFontSize(18);
    doc.text(title, centerX, startY + 35, { align: "center" }); // Position the title below the image
    doc.setFontSize(14);
    doc.text(instituteName, centerX, startY + 45, { align: "center" }); // Position the institute name below the title

    const columns = [
      { title: "ID", dataKey: "id" },
      { title: "Name", dataKey: "name" },
      { title: "Mobile 1", dataKey: "mobile1" },
      { title: "Email", dataKey: "email" },
      { title: "Course", dataKey: "courses" },
      { title: "Duration", dataKey: "duration" },
      { title: "Joining Date", dataKey: "joiningDate" },
      { title: "Due Date", dataKey: "expiryDate" },
      { title: "Total Fees", dataKey: "totalFees" },
      { title: "Paid Fees", dataKey: "paidFees" },
      { title: "Pending Fees", dataKey: "pendingFees" },
      { title: "Payment Mode", dataKey: "paymentMode" },
      { title: "Guide Name", dataKey: "guideName" },
      { title: "Source By", dataKey: "sourceBy" },
      { title: "Medium", dataKey: "medium" },
    ];

    const rows = filteredAdmissions.map((admission) => ({
      id: admission.id,
      name: admission.name,
      mobile1: admission.mobile1,
      email: admission.email,
      courses: admission.courses,
      duration: admission.duration,
      joiningDate: new Date(admission.date).toLocaleDateString(),
      expiryDate: new Date(admission.dueDate).toLocaleDateString(),
      totalFees: admission.totalFees,
      paidFees: admission.paidFees,
      pendingFees: admission.pendingFees,
      paymentMode: admission.paymentMode,
      guideName: admission.guideName,
      sourceBy: admission.sourceBy,
      medium: admission.medium,
    }));

    // Set the starting Y position for the table below the title
    const tableStartY = startY + 55; // Adjust this value as needed to create space for the table

    doc.autoTable({
      columns,
      body: rows,
      startY: tableStartY, // Use the defined table starting position
      columnStyles: {
        id: { cellWidth: 10 },
        name: { cellWidth: 30 },
        mobile1: { cellWidth: 20 },
        email: { cellWidth: 50 },
        courses: { cellWidth: 15 },
        duration: { cellWidth: 15 },
        joiningDate: { cellWidth: 17 },
        expiryDate: { cellWidth: 17 },
        totalFees: { cellWidth: 12 },
        paidFees: { cellWidth: 12 },
        pendingFees: { cellWidth: 12 },
        paymentMode: { cellWidth: 15 },
        guideName: { cellWidth: 20 },
        sourceBy: { cellWidth: 20 },
        medium: { cellWidth: 15 },
      },
      styles: {
        overflow: "linebreak",
        fontSize: 7,
      },
      headStyles: {
        fillColor: [128, 0, 128], // Purple header background
      },
    });

    doc.save("admissions.pdf");
  };

  const handleDownloadCSV = () => {
    const csvData = Papa.unparse(filteredAdmissions);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "admissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

   // Update click handler
   const handleUpdateClick = (admission) => {
    setSelectedAdmission(admission); // Set the selected admission
    setOpenUpdateDialog(true); // Open the update dialog
  };

  const handleCloseDialog = () => {
    setOpenUpdateDialog(false); // Close the dialog
    setSelectedAdmission(null); // Reset the admission state
  };
  const handleUpdateAdmission = (updatedAdmission) => {
    // Update the list with the updated admission details
    setAdmissions((prevAdmissions) =>
      prevAdmissions.map((ad) =>
        ad.id === updatedAdmission.id ? updatedAdmission : ad
      )
    );
    setSelectedAdmission(null); // Close the popup after updating
  };
  const handleDeleteClick = (id) => {
    setAdmissionIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8085/deleteAdmission/${admissionIdToDelete}`
      );
      setAdmissions((prevAdmissions) =>
        prevAdmissions.filter(
          (admission) => admission.id !== admissionIdToDelete
        )
      );
    } catch (error) {
      console.error("Error deleting admission:", error);
    }
  };



  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatValue = (value) => Math.abs(value).toLocaleString();
  const totalAmount = filteredAdmissions.reduce(
    (acc, item) => acc + item.totalFees,
    0
  );
  const paidAmount = filteredAdmissions.reduce(
    (acc, item) => acc + item.paidFees,
    0
  );
  const pendingAmount = filteredAdmissions.reduce(
    (acc, item) => acc + item.pendingFees,
    0
  );

  return (
    <div>
      <Grid container spacing={2} className="textField-root">
        <Grid item xs={8} sm={1.6} md={2}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="TimeRange"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="7Days">Last 7 Days</MenuItem>
            <MenuItem value="30Days">Last 30 Days</MenuItem>
            <MenuItem value="365Days">Last 365 Days</MenuItem>
            <MenuItem value="Custom">Custom Range</MenuItem>
          </TextField>
        </Grid>
        {timeRange === "Custom" && (
          <>
            <Grid item xs={8} sm={1.6} md={2}>
              <TextField
                type="date"
                label="Start Date"
                value={startDate}
                fullWidth
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={8} sm={1.6} md={2}>
              <TextField
                type="date"
                label="End Date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}
        <Grid item xs={8} sm={1.6} md={2}>
          <TextField
            select
            fullWidth
            label="Source"
            value={selectedSource}
            onChange={handleSourceChange}
          >
            <MenuItem value="">All Sources</MenuItem>
            {sources.map((source) => (
              <MenuItem key={source.id} value={source.sourceBy}>
                {source.sourceBy}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <TextField
            select
            fullWidth
            label="Course"
            value={selectedCourse}
            onChange={handleCourseMethodChange}
          >
            <MenuItem value="">All Courses</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.cname}>
                {course.cname}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <TextField
            select
            fullWidth
            label="Guide"
            value={selectedGuide}
            onChange={handleGuideChange}
          >
            <MenuItem value="">All Guides</MenuItem>
            {guide.map((guide) => (
              <MenuItem key={guide.id} value={guide.guideName}>
                {guide.guideName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <TextField
            select
            fullWidth
            label="Payment Mode"
            value={selectedPaymentMode}
            onChange={handlePaymentModeChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <TextField
            select
            fullWidth
            label="Status" // New dropdown for status
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Complete">Complete</MenuItem>
            <MenuItem value="Partial">Partial</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <TextField
            label="Search by Student Name"
            value={searchQuery}
            fullWidth
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <DownloadButton
            variant="contained"
            color="primary"
            onClick={handleDownload}
          >
            Download PDF
          </DownloadButton>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <DownloadButton
            variant="contained"
            color="secondary"
            onClick={handleDownloadCSV}
          >
            Download CSV
          </DownloadButton>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <Link to="/layout/Admission-manager/admission-form" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              Back to Form
            </Button>
          </Link>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <Typography>
            Total Admissions - {filteredAdmissions.length}
          </Typography>
        </Grid>
      </Grid>
      <Box
        display="flex"
        marginTop="20px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ flex: 1, marginRight: 2, whiteSpace: "nowrap", marginLeft: 5 }}
        >
          Total Amount(+GST) : ₹ {formatValue(totalAmount)}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ flex: 1, marginRight: 2, whiteSpace: "nowrap" }}
        >
          Paid Amount : ₹ {formatValue(paidAmount)}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ flex: 1, whiteSpace: "nowrap" }}
        >
          Pending Amount : ₹ {formatValue(pendingAmount)}
        </Typography>
        <TablePagination
          sx={{ flex: 1, marginRight: 2, whiteSpace: "nowrap" }}
          rowsPerPageOptions={[50, 100, 150]}
          component="div"
          count={filteredAdmissions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      <TableContainer style={{ marginTop: "10px" }}>
        <Table style={{ overflowX: "hidden" }}>
          <TableHead
            style={{ backgroundColor: "#f2f2f2", justifyContent: "center" }}
          >
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Mobile 1</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Course</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Source</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Duration</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Joining Date</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Total Fees</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Paid Fees</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Pending Fees</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Payment Mode</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Transaction ID
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell style={{ fontWeight: "bold", textAlign:'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmissions.map((admission) => (
              <TableRow key={admission.id}>
                <TableCell>{admission.id}</TableCell>
                <TableCell>{admission.name}</TableCell>
                <TableCell>{admission.mobile1}</TableCell>
                <TableCell>{admission.email}</TableCell>
                <TableCell>{admission.courses}</TableCell>
                <TableCell>{admission.sourceBy}</TableCell>
                <TableCell>{admission.duration}</TableCell>
                <TableCell>
                  {new Date(admission.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {admission.dueDate
                    ? new Date(admission.dueDate).toLocaleDateString()
                    : "NA"}
                </TableCell>
                {/* {inquiry.status1 === "Call Back"
                          ? `${inquiry.callBackDate} ${inquiry.callBackTime}`
                          : "-----"} */}
                <TableCell>{admission.totalFees}</TableCell>
                <TableCell>{admission.paidFees}</TableCell>
                <TableCell>{admission.pendingFees}</TableCell>
                <TableCell>{admission.paymentMode}</TableCell>
                <TableCell>{admission.transactionid}</TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    color:
                      admission.paymentMethod === "Pending"
                        ? "red"
                        : admission.paymentMethod === "Partial"
                        ? "purple"
                        : admission.paymentMethod === "Complete"
                        ? "green"
                        : "green",
                  }}
                >
                  {admission.paymentMethod}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  <IconButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateClick(admission)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(admission.id)}
                    variant="contained"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleGenerate(admission)}
                    color="inherit"
                  >
                    <PrintIcon />
                  </IconButton>
                  <IconButton onClick={() => handleWhatsAppClick(admission.mobile1)} color="success">
                    <WhatsAppIcon />
                  </IconButton>
                   {/* Info Icon for Viewing Inquiry Details */}
                   <IconButton size="small" color="info" onClick={() => handleViewAdmission(admission)}>
                          <InfoIcon />
                        </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />



      {/* print receipt  */}

      <Dialog
  open={openReceipt}
  onClose={() => setOpenReceipt(false)}
  maxWidth="md"
  fullWidth
>
  <DialogContent sx={{ p: 1 }}>
    {selectedPrintAdmission ? (
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
    position: "relative",
    backgroundColor: "#f3e5f5",
  }}
>
  {/* Invoice Number on the left */}
  <Typography component="span" sx={{ fontWeight: "bold" }}>
    Invoice No: {selectedPrintAdmission.id}
  </Typography>

  {/* Admission Receipt centered */}
  <Typography
    component="span"
    sx={{
      fontWeight: "bold",
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    }}
  >
    Admission Receipt
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
            {selectedPrintAdmission.name && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name:</TableCell>
                <TableCell>{selectedPrintAdmission.name}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.mobile1 && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Mobile No:</TableCell>
                <TableCell>{selectedPrintAdmission.mobile1}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.email && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Email:</TableCell>
                <TableCell>{selectedPrintAdmission.email}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.courses && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Course:</TableCell>
                <TableCell>{selectedPrintAdmission.courses}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.duration && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Duration:</TableCell>
                <TableCell>{selectedPrintAdmission.duration}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.joiningDate && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Joining Date:</TableCell>
                <TableCell>{selectedPrintAdmission.joiningDate}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.expiryDate && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Expiry Date:</TableCell>
                <TableCell>{selectedPrintAdmission.expiryDate}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.paymentMethod && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Status:</TableCell>
                <TableCell>{selectedPrintAdmission.paymentMethod}</TableCell>
              </TableRow>
            )}
            {/* {selectedPrintAdmission.remark && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Remark:</TableCell>
                <TableCell>{selectedPrintAdmission.remark}</TableCell>
              </TableRow>
            )} */}
            {selectedPrintAdmission.totalFees && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Total Fees:</TableCell>
                <TableCell>{selectedPrintAdmission.totalFees}</TableCell>
              </TableRow>
            )}{selectedPrintAdmission.paidFees && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Paid Fees:</TableCell>
                <TableCell>{selectedPrintAdmission.paidFees}</TableCell>
              </TableRow>
            )}{selectedPrintAdmission.pendingFees && selectedPrintAdmission.pendingFees !== "0.0" && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Pending Fees:</TableCell>
                <TableCell>{selectedPrintAdmission.pendingFees}</TableCell>
              </TableRow>
            )}
            
            {selectedPrintAdmission.paymentMode && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Payment Mode:</TableCell>
                <TableCell>{selectedPrintAdmission.paymentMode}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.guideName && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Guide Name:</TableCell>
                <TableCell>{selectedPrintAdmission.guideName}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.sourceBy && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Source:</TableCell>
                <TableCell>{selectedPrintAdmission.sourceBy}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.medium && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Medium:</TableCell>
                <TableCell>{selectedPrintAdmission.medium}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.fatherProfession && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Father's Profession:</TableCell>
                <TableCell>{selectedPrintAdmission.fatherProfession}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.educationQualification && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Edu. Qualification:</TableCell>
                <TableCell>{selectedPrintAdmission.educationQualification}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.annualIncome && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Annual Income:</TableCell>
                <TableCell>{selectedPrintAdmission.annualIncome}</TableCell>
              </TableRow>
            )}
            {selectedPrintAdmission.photo && (
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Photo:</TableCell>
                <TableCell>{selectedPrintAdmission.photo}</TableCell>
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
      onClick={() => downloadReceipt(selectedPrintAdmission)}
    >
      Download PDF
    </Button>
    <Button onClick={() => setOpenReceipt(false)}>Close</Button>
  </DialogActions>
</Dialog>





      {/* <Dialog open={openUpdateDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Admission</DialogTitle>
        <DialogContent>
        {currentAdmission && ( // Ensure we only render if currentAdmission is not null
            <UpdateAdmissionForm admission={currentAdmission} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog> */}
      
      {selectedAdmission && (
        <UpdateAdmissionForm
          admission={selectedAdmission}
          onUpdate={handleUpdateAdmission}
        />
      )}

<Dialog 
  open={viewAdmissionOpen} 
  onClose={closeViewAdmission} 
  PaperProps={{ sx: { width: '600px', height: 'auto' } }} // Custom dialog size
>
  <DialogTitle>Admission Details</DialogTitle>
  <DialogContent>
    {admissionDetail && (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Using `gap` for spacing between fields */}
        {admissionDetail.studentImage ? (
 <Box sx={{ mt: 3, textAlign: 'center' }}>
 <img 
   src={admissionDetail.studentImage} 
   alt="Inquiry" 
   style={{ 
     width: '150px',  // Set width
     height: '150px', // Set height
     objectFit: 'cover', // Ensure image fits well within the defined size
     borderRadius: '50%', // Make image round
     display: 'block', 
     margin: '0 auto' // Center image horizontally
   }} 
 />
</Box>
) : (
<Box sx={{ mt: 3, textAlign: 'center' }}>
 <strong>Photo:</strong>
 <Typography variant="body2" sx={{ mt: 2 }}>No photo available.</Typography>
</Box>
)}
        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Name:</strong> {admissionDetail.name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Email:</strong> {admissionDetail.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Mobile:</strong> {admissionDetail.mobile1}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Courses:</strong> {admissionDetail.courses}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Medium:</strong> {admissionDetail.medium}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Duration:</strong> {admissionDetail.duration}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Total Fees:</strong> {admissionDetail.totalFees}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Payment Method:</strong> {admissionDetail.paymentMethod}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Paid Fees:</strong> {admissionDetail.paidFees}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Pending Fees:</strong> {admissionDetail.pendingFees}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Payment Mode:</strong> {admissionDetail.paymentMode}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Transaction Id:</strong> {admissionDetail.transactionid}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Source By:</strong> {admissionDetail.sourceBy}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Guide Name:</strong> {admissionDetail.guideName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Date:</strong> {admissionDetail.date}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Due Date:</strong> {admissionDetail.dueDate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Remark:</strong> {admissionDetail.remark}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={closeViewAdmission}>Close</Button>
  </DialogActions>
</Dialog>




    </div>
  );
};

export default StudentList;
