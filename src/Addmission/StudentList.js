import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import { Link } from 'react-router-dom';

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
      <Button onClick={() => { onConfirm(); onClose(); }} color="error">
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sourceResponse,
          courseResponse,
          guideResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`),
          axios.get(`http://localhost:8085/getAllCourse?institutecode=${institutecode}`),
          axios.get(`http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`),
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

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        let admissionResponse;
        switch (timeRange) {
          case "7Days":
            admissionResponse = await axios.get(`http://localhost:8085/AdmissionIn7DaysData?institutecode=${institutecode}`);
            break;
          case "30Days":
            admissionResponse = await axios.get(`http://localhost:8085/AdmissionIn30DaysData?institutecode=${institutecode}`);
            break;
          case "365Days":
            admissionResponse = await axios.get(`http://localhost:8085/AdmissionIn365DaysData?institutecode=${institutecode}`);
            break;
          case "Custom":
            admissionResponse = await axios.get(`http://localhost:8085/admissionsBetweenDates?institutecode=${institutecode}&startDate=${startDate}&endDate=${endDate}`);
            break;
          default:
            admissionResponse = await axios.get(`http://localhost:8085/admissions?institutecode=${institutecode}`);
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

  const handleStatusChange = (event) => { // New handler for status change
    setSelectedStatus(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((admission) => {
      const matchesSource = selectedSource ? admission.sourceBy === selectedSource : true;
      const matchesCourse = selectedCourse ? admission.courses === selectedCourse : true;
      const matchesPaymentMode = selectedPaymentMode ? admission.paymentMode === selectedPaymentMode : true;
      const matchesGuideName = selectedGuide ? admission.guideName === selectedGuide : true;
      const matchesStatus = selectedStatus ? admission.paymentMethod === selectedStatus : true; // filtering by status
      const matchesSearchQuery = admission.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSource && matchesCourse && matchesGuideName && matchesPaymentMode && matchesStatus && matchesSearchQuery;
    });
  }, [admissions, selectedSource, selectedCourse, selectedGuide, selectedPaymentMode, selectedStatus, searchQuery]);

  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const columns = [
      {title: "ID", dataKey: "id"},
      { title: "Name", dataKey: "name" },
      { title: "Institute Code", dataKey: "institutecode" },
      { title: "Mobile 1", dataKey: "mobile1" },
      { title: "Mobile 2", dataKey: "mobile2" },
      { title: "Email", dataKey: "email" },
      { title: "Course", dataKey: "courses" },
      { title: "Duration", dataKey: "duration" },
      { title: "Joining Date", dataKey: "joiningDate" },
      { title: "Expiry Date", dataKey: "expiryDate" },
      { title: "Total Fees", dataKey: "totalFees" },
      { title: "Paid Fees", dataKey: "paidFees" },
      { title: "Pending Fees", dataKey: "pendingFees" },
      { title: "Payment Mode", dataKey: "paymentMode" },
      { title: "Transaction ID", dataKey: "transactionid" },
      { title: "Guide Name", dataKey: "guideName" },
      { title: "Source By", dataKey: "sourceBy" },
      { title: "Medium", dataKey: "medium" },
      { title: "Remark", dataKey: "remark" },
      { title: "Status", dataKey: "status" },
    ];

    const rows = filteredAdmissions.map((admission) => ({
      id: admission.id,
      name: admission.name,
      institutecode: admission.institutecode,
      mobile1: admission.mobile1,
      mobile2: admission.mobile2,
      email: admission.email,
      courses: admission.courses,
      duration: admission.duration,
      joiningDate: new Date(admission.date).toLocaleDateString(),
      expiryDate: new Date(admission.dueDate).toLocaleDateString(),
      totalFees: admission.totalFees,
      paidFees: admission.paidFees,
      pendingFees: admission.pendingFees,
      paymentMode: admission.paymentMode,
      transactionid: admission.transactionid,
      guideName: admission.guideName,
      sourceBy: admission.sourceBy,
      medium: admission.medium,
      remark: admission.remark,
      status: admission.status,
    }));

    doc.autoTable({
      columns,
      body: rows,
      startY: 10,
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

  const handleEditClick = (admission) => {
    setCurrentAdmission(admission);
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (id) => {
    setAdmissionIdToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8085/deleteAdmission/${admissionIdToDelete}`);
      setAdmissions((prevAdmissions) =>
        prevAdmissions.filter((admission) => admission.id !== admissionIdToDelete)
      );
    } catch (error) {
      console.error("Error deleting admission:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const formatValue = (value) => Math.abs(value).toLocaleString();
  const totalAmount = filteredAdmissions.reduce((acc, item) => acc + item.totalFees, 0);
  const paidAmount = filteredAdmissions.reduce((acc, item) => acc + item.paidFees, 0);
  const pendingAmount = filteredAdmissions.reduce((acc, item) => acc + item.pendingFees, 0);

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#fff", textAlign: "center", backgroundColor: "#24A0ED", borderRadius: "150px", padding: "10px", marginBottom: "40px" }}>
        Admissions List
      </Typography>
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
          <DownloadButton variant="contained" color="primary" onClick={handleDownload}>
            Download PDF
          </DownloadButton>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
          <DownloadButton variant="contained" color="secondary" onClick={handleDownloadCSV}>
            Download CSV
          </DownloadButton>
        </Grid>
        <Grid item xs={8} sm={1.6} md={2}>
        <Link to="/layout/admission-form" style={{ textDecoration: 'none' }}>
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
      <Box display="flex" marginTop="20px" justifyContent="space-between" alignItems="center">
  <Typography variant="h6" gutterBottom
    sx={{ flex: 1, marginRight: 2, whiteSpace: "nowrap", marginLeft: 5 }}>
    Total Amount(+GST) : ₹ {formatValue(totalAmount)}
  </Typography>
  <Typography variant="h6" gutterBottom
    sx={{ flex: 1, marginRight: 2, whiteSpace: "nowrap" }}>
    Paid Amount : ₹ {formatValue(paidAmount)}
  </Typography>
  <Typography variant="h6" gutterBottom
    sx={{ flex: 1, whiteSpace: "nowrap" }}>
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
          <TableHead style={{ backgroundColor: "#f2f2f2", justifyContent: "center" }}>
            <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Mobile 1</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Course</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Source</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Duration</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Joining Date</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Expiry Date</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Total Fees</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Paid Fees</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Pending Fees</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Payment Mode</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Transaction ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
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
                <TableCell>{new Date(admission.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(admission.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{admission.totalFees}</TableCell>
                <TableCell>{admission.paidFees}</TableCell>
                <TableCell>{admission.pendingFees}</TableCell>
                <TableCell>{admission.paymentMode}</TableCell>
                <TableCell>{admission.transactionid}</TableCell>
                <TableCell style={{
                  fontWeight: "bold",
                  color: admission.paymentMethod === "Pending" ? "red"
                    : admission.paymentMethod === "Partial" ? "purple"
                    : admission.paymentMethod === "Complete" ? "green"
                    : "green",
                }}>
                  {admission.paymentMethod}
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  <IconButton variant="contained" color="primary" onClick={() => handleEditClick(admission)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(admission.id)} variant="contained">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AlertDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete} />
      <Dialog open={openUpdateDialog} onClose={handleCloseDialog}>
        <DialogTitle>Update Admission</DialogTitle>
        <DialogContent>
          <UpdateAdmissionForm admission={currentAdmission} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentList;
