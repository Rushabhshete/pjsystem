import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { saveAs } from "file-saver";
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
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmsIcon from "@mui/icons-material/Sms";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/system";

export default function Report() {
  const navigate = useNavigate();
  const { id } = useParams();

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


  // New states for month and year
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [smsDialogOpen, setSmsDialogOpen] = useState(false);
  const [smsData, setSmsData] = useState({ mobile: "", content: "" });

  const getInstituteCode = () => localStorage.getItem("institutecode");

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
    let url = `http://localhost:8086/get/getALLEnquiryByInstitutecode?institutecode=${getInstituteCode()}`;

    // Update URL based on date, month and year filters
    if (start && end) {
      url = `http://localhost:8086/enquiryBetweenDates?startDate=${start}&endDate=${end}&institutecode=${getInstituteCode()}`;
    } else if (selectedYear && selectedMonth) {
      url = `http://localhost:8086/enquiryByMonthAndYear?month=${selectedMonth}&year=${selectedYear}&institutecode=${getInstituteCode()}`;
    }

    const result = await axios.get(url);
    setInquiries(result.data);
  };

  const loadExams = async () => {
    try {
      const response = await axios.get(`http://localhost:8086/getAllExam?institutecode=${getInstituteCode()}`);
      setExamOptions(response.data);
    } catch (error) {
      console.error("Error fetching exam options:", error);
    }
  };

  const loadSources = async () => {
    try {
      const response = await axios.get(`http://localhost:8086/getAllSource?institutecode=${getInstituteCode()}`);
      setSourceOptions(response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const loadConducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8086/get/getAllConductModels?institutecode=${getInstituteCode()}`);
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

  // Month and year change handlers
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    loadUsers();
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    loadUsers();
  };

  const filterInquiries = () => {
    return inquiries.filter((inquiry) => {
      const matchesExam = selectedExam ? inquiry.exam === selectedExam : true;
      const matchesSource = selectedSource ? inquiry.source_by === selectedSource : true;
      const matchesConduct = selectedConduct ? inquiry.conduct_by === selectedConduct : true;
      const matchesStatus = selectedStatus ? inquiry.status1 === selectedStatus : true;

      // Filtering by month and year
      const inquiryDate = new Date(inquiry.enquiryDate);
      const matchesMonth = selectedMonth ? inquiryDate.getMonth() + 1 === parseInt(selectedMonth) : true;
      const matchesYear = selectedYear ? inquiryDate.getFullYear() === parseInt(selectedYear) : true;

      return matchesExam && matchesSource && matchesConduct && matchesStatus && matchesMonth && matchesYear;
    });
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF("landscape");
    doc.text("Inquiries Report", 10, 10);

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

    filterInquiries().forEach((inquiry) => {
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
      startY: 20,
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 8 },
    });

    doc.save("report.pdf");
  };

  const handleDownloadCSV = () => {
    const csvContent = filterInquiries()
      .map((inquiry) =>
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
      await axios.post("http://localhost:8086/sendSms", {
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
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
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
        <PopTypography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#fff", textAlign: "center", backgroundColor: "#24A0ED", borderRadius: "150px", padding: "10px", marginBottom: "-2px" }}>
          Enquiry Report
        </PopTypography>

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
                <em><strong>All</strong></em>
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
                <em><strong>All</strong></em>
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
                <em><strong>All</strong></em>
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
              <MenuItem value="Call" >
        Call
      </MenuItem>
      <MenuItem value="Interested" >
        Interested
      </MenuItem>
      <MenuItem value="Not Interested" >
        Not Interested
      </MenuItem>
      <MenuItem value="DND" >
       DND
      </MenuItem>
      <MenuItem value="Ringing" >
        Ringing
      </MenuItem>
      <MenuItem value="Switch Off" >
        Switch Off
      </MenuItem>
      <MenuItem value="Waiting" >
        Waiting
      </MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3} className="textField-root">
            <TextField
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
                <em><strong>All Months</strong></em>
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
                <em><strong>All Years</strong></em>
              </MenuItem>
              {/* Populate the year dropdown with the calculated years */}
              {years.map(year => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box mt={4}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f2f2f2", align: "center" }}>
                <TableRow sx={{ align: "center" }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Exam</strong></TableCell>
                  <TableCell><strong>Source</strong></TableCell>
                  <TableCell><strong>Conduct By</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Remark</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterInquiries().map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>{inquiry.id}</TableCell>
                    <TableCell>{inquiry.enquiryDate}</TableCell>
                    <TableCell>{inquiry.name}</TableCell>
                    <TableCell>{inquiry.mobile}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>{inquiry.exam}</TableCell>
                    <TableCell>{inquiry.source_by}</TableCell>
                    <TableCell>{inquiry.conduct_by}</TableCell>
                    <TableCell sx={{ align:'center'}} style={{
  color: inquiry.status1 === 'Call' ? 'orange' :
         inquiry.status1 === 'Interested' ? 'purple' :
         inquiry.status1 === 'Not Interested' ? 'red' :
         inquiry.status1 === 'DND' ? 'blue' :
         inquiry.status1 === 'Ringing' ? 'brown' :
         inquiry.status1 === 'Switch Off' ? 'green' :
         inquiry.status1 === 'Waiting' ? 'magenta' : 'magenta'
}}>
  <b><strong>{inquiry.status1}</strong></b>
</TableCell>
<TableCell sx={{ align:'center'}} style={{  alignItems: 'center', flexDirection: 'row' }}>
      <b>
        {inquiry.status1 === 'Call' ? `${inquiry.callBackDate} ${inquiry.callBackTime}` : '-----'}
      </b>
    </TableCell>
                    <TableCell>{inquiry.remark}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => {
                            window.open(`https://wa.me/91${inquiry.mobile}`, "_blank");
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
                          to={`/layout/manage/${inquiry.id}`}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        

        <Grid container spacing={2} justifyContent="flex-end" mt={1}>
          <Grid item> 
          <Typography variant="h6" gutterBottom>
        Total Inquiries: {inquiryCount}
      </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
          </Grid>
        </Grid>

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
              onChange={(e) => setSmsData({ ...smsData, content: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSmsDialog}>Cancel</Button>
            <Button onClick={handleSendSms}>Send</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
