import React, { useState, useEffect, useCallback, useMemo } from "react";
//import { useNavigate } from "react-router-dom";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";

// import MapsUgcTwoToneIcon from "@mui/icons-material/MapsUgcTwoTone";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Box,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import {
  gender,
  bloodGroup,
  maritalStatus,
  incomeRanges,
  title,
  nationality,
  birthState,
  birthDistrict,
  castCategory,
  religionOptions,
  districtOptions,
  noOfYearsPlayed,
  weightOptions,
  heightOptions,
  disabilityTypes,
  sportsInjuries,
  levelOfParticipation,
  stateOptions,
  sportsName,
  specialPercentage,
  boardOptions,
} from "./DropdownData.js";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
const infoFields = {
  id: "ID",
  dateOfRegistration: "Date of Registration",
  standardOptions: "Standard",
  medium: "Medium",
  firstName: "First Name",
  middleName: "Middle Name",
  surname: "Last Name",
  full_name: "Full Name",
  gender: "Gender",
  bloodGroup: "Blood Group",
  motherTongue: "Mother Tongue",
  maritalStatus: "Marital Status",
  emailAddress: "Email Address",
  religion: "Religion",
  minority: "Minority",
  minorityType: "Minority Type",
  castCategory: "Caste Category",
  casteCertificateNumber: "Caste Certificate Number",
  casteValidation: "Caste Validity",
  casteValidationNumber: "Caste Validity Number",
  subCaste: "Sub Caste",
  dateOfBirth: "Date of Birth",
  age: "Age",
  birthPlace: "Birth Place",
  birthTaluka: "Birth Taluka",
  birthDistrict: "Birth District",
  birthState: "Birth State",
  birthCountry: "Birth Country",
  fathersName: "Father's Name",
  motherName: "Mother Name",
  fatherProfession: "Father's Profession",
  fathersContact: "Father's Contact",
  phoneNumber: "Phone Number",
  whatsappNumber: "WhatsApp Number",
  panNumber: "PAN Number",
  aadharNumber: "Aadhar Number",
  udiseNo: "UDISE Number",
  saralNo: "SARAL Number",
  incomeRanges: "Income",
  nationality: "Nationality",
  othernationality: "Other Nationality",
  sportYesNo: "Sports Participation",
  sportsName: "Sports Name",
  role: "Role",
  levelOfParticipation: "Level of Participation",
  internationaldetail: "International Details",
  noOfYearsPlayed: "Number of Years Played",
  achievement: "Achievement",
  sportsInjuries: "Sports Injuries",
  height: "Height",
  weight: "Weight",
  handicap: "Handicap",
  disabilityType: "Disability Type",
  specialPercentage: "Disability Percentage",
  domicilebool: "Domicile",
  domicileNumber: "Domicile Number",
  earthquake: "Earthquake Affected",
  earthquakeNumber: "Earthquake Affected Certificate Number",
  projectDifferentiated: "Project Affected",
  projectDifferentiatedNumber: "Project Affected Certificate Number",
  scholarship: "Scholarship",
  scholarshipName: "Scholarship Name",
  address: "Address",
  landmark: "Landmark",
  city: "City",
  taluka: "Taluka",
  district: "District",
  state: "State",
  country: "Country",
  pincode: "Pincode",
  permanentAddress: "Permanent Address",
  plandmark: "Landmark (Permanent)",
  pcity: "City (Permanent)",
  ptaluka: "Taluka (Permanent)",
  pdistrict: "District (Permanent)",
  pstate: "State (Permanent)",
  pcountry: "Country (Permanent)",
  ppincode: "Pincode (Permanent)",
  //"standards",
};
const StudentList = () => {
  const [students, setStudents] = useState([]);
  // const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [searchQueryFirstName, setSearchQueryFirstName] = useState("");
  const [searchQueryLastName, setSearchQueryLastName] = useState("");
  const [searchQueryEmail, setSearchQueryEmail] = useState("");
  const [searchQueryPhone, setSearchQueryPhone] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [updatingStudent, setUpdatingStudent] = useState(null); // Track the student being updated
  const [exams, setExam] = useState([
    {
      board: "",
      collegeName: "",
      enterExamName: "",
      rollNo: "",
      obtainedMarks: "",
      totalMarks: "",
      percentage: "",
      year: "",
      reasonOfLeavingSchool: "",
      grade: "",
      cgpa: "",
    },
  ]);
  const [medium, setMedium] = useState([]);
  const institutecode = () => localStorage.getItem("institutecode");

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.firstName
          .toLowerCase()
          .includes(searchQueryFirstName.toLowerCase()) &&
        student.surname
          .toLowerCase()
          .includes(searchQueryLastName.toLowerCase()) &&
        student.emailAddress
          .toLowerCase()
          .includes(searchQueryEmail.toLowerCase()) &&
        student.phoneNumber
          .toLowerCase()
          .includes(searchQueryPhone.toLowerCase())
    );
  }, [
    students,
    searchQueryFirstName,
    searchQueryLastName,
    searchQueryEmail,
    searchQueryPhone,
  ]);
  //const navigate = useNavigate();

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    if (event.target.value !== "custom") {
      fetchFilteredStudents(event.target.value);
    }
  };
  const fetchAllStudents = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getAllStudent?institutecode=${institutecode()}`);
      if (
        response.status === 200 &&
        response.data &&
        Array.isArray(response.data)
      ) {
        setStudents(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setStudents([]);
      }
    } catch (error) {
      console.error("There was an error fetching the students!", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setStudents([]);
    }
  }, []);

  const fetchFilteredStudents = useCallback(
    async (filter, startDate = null, endDate = null) => {
      try {
        let response;
        if (filter === "custom" && startDate && endDate) {
          response = await axios.get(
            `http://localhost:8080/getStudentsByDateRange?institutecode=${institutecode()}&startDate=${startDate}&endDate=${endDate}`
          );
        } else {
          switch (filter) {
            case "7":
              response = await axios.get(
                // `http://localhost:8080/getDataof7Days?institutecode=${institutecode()}`
                `http://localhost:8080/getStudentsByTimeframe?institutecode=${institutecode()}&timeframe=7days`
              );
              break;
            case "30":
              response = await axios.get(
                `http://localhost:8080/getStudentsByTimeframe?institutecode=${institutecode()}&timeframe=30days`
              );
              break;
            case "365":
              response = await axios.get(
                `http://localhost:8080/getStudentsByTimeframe?institutecode=${institutecode()}&timeframe=365days`
              );
              break;
            default:
              response = await axios.get(`http://localhost:8080/getAllStudent?institutecode=${institutecode()}`);
              break;
          }
        }
        if (
          response.status === 200 &&
          response.data &&
          Array.isArray(response.data)
        ) {
          setStudents(response.data);
        } else {
          console.error("Unexpected response format:", response);
          setStudents([]);
        }
      } catch (error) {
        console.error("There was an error fetching the students!", error);
        setStudents([]);
      }
    },
    []
  );
  useEffect(() => {
    if (filter === "custom" && startDate && endDate) {
      fetchFilteredStudents("custom", startDate, endDate);
    }
  }, [filter, startDate, endDate, fetchFilteredStudents]);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  useEffect(() => {
    if (filter !== "all") {
      fetchFilteredStudents(filter);
    } else {
      fetchAllStudents();
    }
  }, [filter, fetchFilteredStudents, fetchAllStudents]);

  // const handleSearch = (event) => {
  //   setSearchQuery(event.target.value);
  // };
  const handleSearchFirstName = (event) => {
    setSearchQueryFirstName(event.target.value);
  };

  const handleSearchLastName = (event) => {
    setSearchQueryLastName(event.target.value);
  };

  const handleSearchEmail = (event) => {
    setSearchQueryEmail(event.target.value);
  };

  const handleSearchPhone = (event) => {
    setSearchQueryPhone(event.target.value);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        [
          "ID",
          "First Name",
          "Last Name",
          "Registration Date",
          "Email",
          "Phone",
        ],
      ],
      body: students.map((student) => [
        student.id,
        student.firstName,
        student.surname,
        student.dateOfRegistration,
        student.emailAddress,
        student.phoneNumber,
      ]),
    });
    doc.save("students.pdf");
  };

  const csvData = students.map((student) => ({
    ID: student.id,
    "First Name": student.firstName,
    "Last Name": student.surname,
    Email: student.emailAddress,
    Phone: student.phoneNumber,
  }));

  const handleUpdate = (id) => {
    const studentToUpdate = students.find((student) => student.id === id);
    if (studentToUpdate) {
      setUpdatingStudent(studentToUpdate);
      // Assuming `exams` is a field in student data
      setExam(studentToUpdate.exams || []);
    }
  };

  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [standardOptions, setStandards] = useState([]);

  const handleOpenInfoDialog = (id) => {
    const student = students.find((student) => student.id === id);
    setSelectedStudent(student);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
    setSelectedStudent(null);
  };

  const handleSubmitUpdate = async () => {
    try {
      const payload = {
        ...updatingStudent,
        exams,
      };
      await axios.put(
        `http://localhost:8080/updateStudent/${updatingStudent.id}`,
        payload
      );
      fetchAllStudents();
      setUpdatingStudent(null);
      toast.success("Student data updated");
    } catch (error) {
      console.error("Error updating student!", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/deleteMapping/${id}`);
      fetchAllStudents();
      handleCloseDialog();
      toast.success("Student data Deleted");
    } catch (error) {
      console.error("Error deleting student!", error);
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedStudentId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudentId("");
  };

  const handleInputChange = (event, key) => {
    const { value } = event.target;
    setUpdatingStudent((prevStudent) => ({
      ...prevStudent,
      [key]: value,
    }));
  };

  const handleEducationDetailChange = (index, field, value) => {
    const newEducationDetails = [...exams];
    newEducationDetails[index][field] = value;
    setExam(newEducationDetails);
  };

  const addEducationDetail = () => {
    setExam([
      ...exams,
      {
        board: "",
        collegeName: "",
        enterExamName: "",
        rollNo: "",
        obtainedMarks: "",
        totalMarks: "",
        percentage: "",
        year: "",
        reasonOfLeavingSchool: "",
        grade: "",
        cgpa: "",
      },
    ]);
  };
  useEffect(() => {
    axios
      .get(`http://localhost:8080/all?institutecode=${institutecode()}`)
      .then((response) => {
        setStandards(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the standards!", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/getall?institutecode=${institutecode()}`)
      .then((response) => {
        setMedium(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the Medium!", error);
      });
  }, []);

  const removeEducationDetail = (index) => {
    const newEducationDetails = exams.filter((_, i) => i !== index);
    setExam(newEducationDetails);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  return (
    <>
       <Typography
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
        Student List
      </Typography>
      <div >
        <div>
          <Paper
            variant="outlined"
            style={{ padding: "16px", marginTop: "10px" }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Select
                  value={filter}
                  onChange={handleFilterChange}
                  fullWidth
                  style={{ marginBottom: "16px" }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="7">Last 7 Days</MenuItem>
                  <MenuItem value="30">Last 30 Days</MenuItem>
                  <MenuItem value="365">Last 365 Days</MenuItem>
                  <MenuItem value="custom">Custom Date Range</MenuItem>
                </Select>
              </Grid>
              {filter === "custom" && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="date"
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="date"
                      label="End Date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadPDF}
                  fullWidth
                  style={{
                    marginRight: "16px",
                    height: "50px",
                    marginTop: "-20px",
                  }} // Adjust height as needed
                >
                  Download PDF
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CSVLink
                  data={csvData}
                  filename="students.csv"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ height: "50px", marginTop: "-20px" }} // Adjust height as needed
                  >
                    Download CSV
                  </Button>
                </CSVLink>
              </Grid>
            </Grid>
            <TableContainer component={Paper} style={{ marginTop: "16px" }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
                  <TableRow>
                    <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      First Name
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Search"
                          value={searchQueryFirstName}
                          onChange={handleSearchFirstName}
                          InputProps={{
                            style: {
                              height: "40px",
                              width: "100px",
                            },
                          }}
                        />
                      </Grid>
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Last Name
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Search"
                          value={searchQueryLastName}
                          onChange={handleSearchLastName}
                          InputProps={{
                            style: {
                              height: "40px",
                              width: "100px",
                            },
                          }}
                        />
                      </Grid>
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Email
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Search"
                          value={searchQueryEmail}
                          onChange={handleSearchEmail}
                          InputProps={{
                            style: {
                              height: "40px",
                              width: "100px",
                            },
                          }}
                        />
                      </Grid>
                    </TableCell>

                    <TableCell style={{ fontWeight: "bold" }}>
                      Phone
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Search"
                          value={searchQueryPhone}
                          onChange={handleSearchPhone}
                          InputProps={{
                            style: {
                              height: "40px",
                              width: "100px",
                            },
                          }}
                        />
                      </Grid>
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Registered Date
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Info/Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.id}</TableCell>
                        <TableCell>{student.firstName}</TableCell>
                        <TableCell>{student.surname}</TableCell>
                        <TableCell>{student.emailAddress}</TableCell>

                        <TableCell>{student.phoneNumber}</TableCell>
                        <TableCell>{student.dateOfRegistration}</TableCell>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <IconButton
                              color="success"
                              onClick={() => handleOpenInfoDialog(student.id)}
                              style={{ marginRight: "8px" }}
                            >
                              <InfoIcon />
                            </IconButton>
                            <IconButton
                              variant="outlined"
                              color="primary"
                              onClick={() => handleUpdate(student.id)}
                              style={{ marginRight: "8px" }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              variant="outlined"
                              color="error"
                              onClick={() => handleOpenDialog(student.id)}
                            >
                              <DeleteForeverTwoToneIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[25, 50, 100]}
              component="div"
              count={filteredStudents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{  position: "relative", left:-670 }}
            />
          </Paper>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this student?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(selectedStudentId)}
                color="secondary"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {selectedStudent && (
            <Dialog
              open={openInfoDialog}
              maxWidth="md"
              onClose={handleCloseInfoDialog}
            >
              <DialogTitle>Student Information</DialogTitle>
              <DialogContent>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img
                    src={selectedStudent.studentphoto}
                    alt="Student Photo"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", width: "100%" }}
                >
                  {Object.keys(infoFields).map((field) => (
                    <div
                      key={field}
                      style={{
                        flex: "0 0 50%",
                        boxSizing: "border-box",
                        padding: "4px",
                      }}
                    >
                      <p>
                        <strong>{infoFields[field]}:</strong>{" "}
                        {String(selectedStudent[field])}
                      </p>
                    </div>
                  ))}
                  {/* Displaying exam fields */}
                  <div
                    style={{
                      flex: "0 0 100%", // Full width for exam fields
                      boxSizing: "border-box",
                      padding: "4px",
                    }}
                  >
                    <h3>Exam Details</h3>
                    {selectedStudent.exams.map((exam, index) => (
                      <div key={index}>
                        {Object.keys(exam).map((field) => (
                          <p key={field}>
                            <strong>
                              {field
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, (str) => str.toUpperCase())}
                              :
                            </strong>{" "}
                            {String(exam[field])}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right", marginTop: "20px" }}>
                  <img
                    src={selectedStudent.studentSign}
                    alt="Student Signature"
                    style={{ width: "150px", height: "50px" }}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseInfoDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}

          {/* Update Student Dialog */}
          <Dialog
            open={!!updatingStudent}
            onClose={() => setUpdatingStudent(null)}
            maxWidth="md" // Set the maximum width to medium (options: 'xs', 'sm', 'md', 'lg', 'xl')
            fullWidth // Ensure the dialog takes the full width of the maxWidth
            sx={{ "& .MuiDialog-paper": { width: "90%", height: "90%" } }} // Customize the width and height
          >
            <DialogTitle>Update Student</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} style={{ marginTop: "5px" }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Standard"
                    value={updatingStudent?.standardOptions || ""}
                    onChange={(e) => handleInputChange(e, "standardOptions")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                    select
                  >
                    <MenuItem value="">Please select Standard</MenuItem>
                    {standardOptions.map((standard) => (
                      <MenuItem
                        key={standard.standardname}
                        value={standard.standardname}
                      >
                        {standard.standardname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Medium"
                    value={updatingStudent?.medium || ""}
                    onChange={(e) => handleInputChange(e, "medium")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                    select
                  >
                    <MenuItem value="">Please select Medium</MenuItem>
                    {medium.map((option) => (
                      <MenuItem
                        key={option.mediumname}
                        value={option.mediumname}
                      >
                        {option.mediumname}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Title"
                    value={updatingStudent?.title || ""}
                    onChange={(e) => handleInputChange(e, "title")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                    select
                    name="title"
                  >
                    <MenuItem value="">Please select title</MenuItem>
                    {title.map((title) => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="First Name"
                    value={updatingStudent?.firstName || ""}
                    onChange={(e) => handleInputChange(e, "firstName")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Middle Name"
                    value={updatingStudent?.middleName || ""}
                    onChange={(e) => handleInputChange(e, "middleName")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Last Name"
                    value={updatingStudent?.surname || ""}
                    onChange={(e) => handleInputChange(e, "surname")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Full Name"
                    value={updatingStudent?.full_name || ""}
                    onChange={(e) => handleInputChange(e, "full_name")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Gender"
                    value={updatingStudent?.gender || ""}
                    onChange={(e) => handleInputChange(e, "gender")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                    select
                    name="gender"
                  >
                    <MenuItem value="">Please select gender</MenuItem>
                    {gender.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Blood Group"
                    value={updatingStudent?.bloodGroup || ""}
                    onChange={(e) => handleInputChange(e, "bloodGroup")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                    select
                    name="bloodGroup"
                  >
                    <MenuItem value="">Please select blood group</MenuItem>
                    {bloodGroup.map((bloodGroup) => (
                      <MenuItem key={bloodGroup} value={bloodGroup}>
                        {bloodGroup}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Mother Tongue"
                    value={updatingStudent?.motherTongue || ""}
                    onChange={(e) => handleInputChange(e, "motherTongue")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Marital Status"
                    value={updatingStudent?.maritalStatus || ""}
                    onChange={(e) => handleInputChange(e, "maritalStatus")}
                    fullWidth
                    style={{ marginBottom: "16px" }}
                    select
                    name="maritalStatus"
                  >
                    <MenuItem value="">Please select Marital Status</MenuItem>
                    {maritalStatus.map((maritalStatus) => (
                      <MenuItem key={maritalStatus} value={maritalStatus}>
                        {maritalStatus}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Email"
                    value={updatingStudent?.emailAddress || ""}
                    onChange={(e) => handleInputChange(e, "emailAddress")}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <h4>Religion/Caste</h4>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Religion"
                        name="religion"
                        value={updatingStudent?.religion || ""}
                        onChange={(e) => handleInputChange(e, "religion")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Please select religion</MenuItem>
                        {religionOptions.map((religionOptions) => (
                          <MenuItem
                            key={religionOptions}
                            value={religionOptions}
                          >
                            {religionOptions}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Cast Category"
                        value={updatingStudent?.castCategory || ""}
                        onChange={(e) => handleInputChange(e, "castCategory")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                        name="castCategory"
                      >
                        <MenuItem value="">
                          Please select caste category
                        </MenuItem>
                        {castCategory.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="minorityType"
                        value={updatingStudent?.minorityType || ""}
                        onChange={(e) => handleInputChange(e, "minorityType")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                        name="minorityType"
                      >
                        <MenuItem value="">Select Minority Type</MenuItem>
                        <MenuItem value="Muslims">Muslims</MenuItem>
                        <MenuItem value="Sikhs">Sikhs</MenuItem>
                        <MenuItem value="Christians">Christians</MenuItem>
                        <MenuItem value="Buddhists">Buddhists</MenuItem>
                        <MenuItem value="Jain">Jain</MenuItem>
                        <MenuItem value="Zorastrians (Parsis)">
                          Zorastrians (Parsis)
                        </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="casteValidationNumber"
                        value={updatingStudent?.casteValidationNumber || ""}
                        onChange={(e) =>
                          handleInputChange(e, "casteValidationNumber")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="casteCertificateNumber"
                        value={updatingStudent?.casteCertificateNumber || ""}
                        onChange={(e) =>
                          handleInputChange(e, "casteCertificateNumber")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Caste"
                        value={updatingStudent?.caste || ""}
                        onChange={(e) => handleInputChange(e, "caste")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Sub-Caste"
                        value={updatingStudent?.subCaste || ""}
                        onChange={(e) => handleInputChange(e, "subCaste")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <h4>Birth Info</h4>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Date of Birth"
                        value={updatingStudent?.dateOfBirth || ""}
                        onChange={(e) => handleInputChange(e, "dateOfBirth")}
                        type="date"
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Age"
                        value={updatingStudent?.age || ""}
                        onChange={(e) => handleInputChange(e, "age")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Birth Place"
                        value={updatingStudent?.birthPlace || ""}
                        onChange={(e) => handleInputChange(e, "birthPlace")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />{" "}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Birth Taluka"
                        value={updatingStudent?.birthTaluka || ""}
                        onChange={(e) => handleInputChange(e, "birthTaluka")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        name="birthTaluka"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Birth District"
                        value={updatingStudent?.birthDistrict || ""}
                        onChange={(e) => handleInputChange(e, "birthDistrict")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                        name="birthDistrict"
                      >
                        <MenuItem value="">Please select District</MenuItem>
                        {birthDistrict.map((birthDistrict) => (
                          <MenuItem key={birthDistrict} value={birthDistrict}>
                            {birthDistrict}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>{" "}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Birth State"
                        value={updatingStudent?.birthState || ""}
                        onChange={(e) => handleInputChange(e, "birthState")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                        name="birthState"
                      >
                        <MenuItem value="">Please select State</MenuItem>
                        {birthState.map((birthState) => (
                          <MenuItem key={birthState} value={birthState}>
                            {birthState}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Birth Country"
                        value={updatingStudent?.birthCountry || ""}
                        onChange={(e) => handleInputChange(e, "birthCountry")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                        name="birthCountry"
                      >
                        <MenuItem value="">Please select Country</MenuItem>
                        {nationality.map((nationality) => (
                          <MenuItem key={nationality} value={nationality}>
                            {nationality}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>{" "}
                </Grid>
                <Grid item xs={12}>
                  <h4>Family/Contact Info</h4>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Father's Name"
                        value={updatingStudent?.fathersName || ""}
                        onChange={(e) => handleInputChange(e, "fathersName")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Mother's Name"
                        value={updatingStudent?.motherName || ""}
                        onChange={(e) => handleInputChange(e, "motherName")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Father's Profession"
                        value={updatingStudent?.fatherProfession || ""}
                        onChange={(e) =>
                          handleInputChange(e, "fatherProfession")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Father's Contact"
                        value={updatingStudent?.fathersContact || ""}
                        onChange={(e) => handleInputChange(e, "fathersContact")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Phone"
                        value={updatingStudent?.phoneNumber || ""}
                        onChange={(e) => handleInputChange(e, "phoneNumber")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="WhatsApp Number"
                        value={updatingStudent?.whatsappNumber || ""}
                        onChange={(e) => handleInputChange(e, "whatsappNumber")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="PAN Number"
                        value={updatingStudent?.panNumber || ""}
                        onChange={(e) => handleInputChange(e, "panNumber")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Aadhar Number"
                        value={updatingStudent?.aadharNumber || ""}
                        onChange={(e) => handleInputChange(e, "aadharNumber")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="UDISE Number"
                        value={updatingStudent?.udiseNo || ""}
                        onChange={(e) => handleInputChange(e, "udiseNo")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Saral Number"
                        value={updatingStudent?.saralNo || ""}
                        onChange={(e) => handleInputChange(e, "saralNo")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Income Ranges"
                        value={updatingStudent?.incomeRanges || ""}
                        onChange={(e) => handleInputChange(e, "incomeRanges")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Please Select Income Range</MenuItem>
                        {incomeRanges.map((income) => (
                          <MenuItem key={income} value={income}>
                            {income}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Nationality"
                        value={updatingStudent?.nationality || ""}
                        onChange={(e) => handleInputChange(e, "nationality")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                        name="nationality"
                      >
                        <MenuItem value="">Please select nationality</MenuItem>
                        {nationality.map((nationality) => (
                          <MenuItem key={nationality} value={nationality}>
                            {nationality}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <h4>Educational Details</h4>
                  <Grid container spacing={2}>
                    {exams.map((detail, index) => (
                      <React.Fragment key={index}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Board"
                            name="board"
                            value={detail.board}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "board",
                                e.target.value
                              )
                            }
                            fullWidth
                          >
                            <MenuItem value="">Please select Board</MenuItem>
                            {boardOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Enter Last School Name"
                            value={detail.collegeName}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "collegeName",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Last Qualifying Exam"
                            value={detail.enterExamName}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "enterExamName",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Roll Number"
                            value={detail.rollNo}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "rollNo",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Obtained Marks"
                            value={detail.obtainedMarks}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "obtainedMarks",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Total Marks"
                            value={detail.totalMarks}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "totalMarks",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Percentage"
                            value={detail.percentage}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "percentage",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="CGPA"
                            value={detail.cgpa}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "cgpa",
                                e.target.value
                                // (type = "Number")
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Grade"
                            value={detail.grade}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "grade",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Year"
                            value={detail.year}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "year",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Reason For Leaving School"
                            value={detail.reasonOfLeavingSchool}
                            onChange={(e) =>
                              handleEducationDetailChange(
                                index,
                                "reasonOfLeavingSchool",
                                e.target.value
                              )
                            }
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <IconButton
                            onClick={() => removeEducationDetail(index)}
                            color="secondary"
                          >
                            <RemoveIcon />
                          </IconButton>
                        </Grid>
                      </React.Fragment>
                    ))}
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={addEducationDetail}
                        startIcon={<AddIcon />}
                      >
                        Add Education Detail
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <h4>Sports</h4>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Sports Name"
                        value={updatingStudent?.sportsName || ""}
                        onChange={(e) => handleInputChange(e, "sportsName")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Select The Name Of Sport</MenuItem>
                        {sportsName.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Role"
                        value={updatingStudent?.role || ""}
                        onChange={(e) => handleInputChange(e, "role")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Height"
                        value={updatingStudent?.height || ""}
                        onChange={(e) => handleInputChange(e, "height")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Select Height</MenuItem>
                        {heightOptions.map((height) => (
                          <MenuItem key={height} value={height}>
                            {height}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Weight"
                        value={updatingStudent?.weight || ""}
                        onChange={(e) => handleInputChange(e, "weight")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Select Weight</MenuItem>
                        {weightOptions.map((weight) => (
                          <MenuItem key={weight} value={weight}>
                            {weight}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Achievement"
                        value={updatingStudent?.achievement || ""}
                        onChange={(e) => handleInputChange(e, "achievement")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Number of Years Played"
                        value={updatingStudent?.noOfYearsPlayed || ""}
                        onChange={(e) =>
                          handleInputChange(e, "noOfYearsPlayed")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Select Number of Years</MenuItem>
                        {noOfYearsPlayed.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Level of Participation"
                        value={updatingStudent?.levelOfParticipation || ""}
                        onChange={(e) =>
                          handleInputChange(e, "levelOfParticipation")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Select Participation Level</MenuItem>
                        {levelOfParticipation.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Sports Injuries"
                        value={updatingStudent?.sportsInjuries || ""}
                        onChange={(e) => handleInputChange(e, "sportsInjuries")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">
                          Select Known Medical Injuries
                        </MenuItem>
                        {sportsInjuries.map((injury) => (
                          <MenuItem key={injury} value={injury}>
                            {injury}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <h4>Other Details</h4>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Disability Type"
                        value={updatingStudent?.disabilityType || ""}
                        onChange={(e) => handleInputChange(e, "disabilityType")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">
                          Please select disability type
                        </MenuItem>
                        {disabilityTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Special Percentage"
                        value={updatingStudent?.specialPercentage || ""}
                        onChange={(e) =>
                          handleInputChange(e, "specialPercentage")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Please select percentage</MenuItem>
                        {specialPercentage.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Domicile Number"
                        value={updatingStudent?.domicileNumber || ""}
                        onChange={(e) => handleInputChange(e, "domicileNumber")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Date of Registration"
                        value={updatingStudent?.dateOfRegistration || ""}
                        onChange={(e) =>
                          handleInputChange(e, "dateOfRegistration")
                        }
                        type="date"
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Scholarship Name"
                        value={updatingStudent?.scholarshipName || ""}
                        onChange={(e) =>
                          handleInputChange(e, "scholarshipName")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Address"
                        value={updatingStudent?.address || ""}
                        onChange={(e) => handleInputChange(e, "address")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="landmark"
                        value={updatingStudent?.landmark || ""}
                        onChange={(e) => handleInputChange(e, "landmark")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="City"
                        value={updatingStudent?.city || ""}
                        onChange={(e) => handleInputChange(e, "city")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Taluka"
                        value={updatingStudent?.taluka || ""}
                        onChange={(e) => handleInputChange(e, "taluka")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="District"
                        value={updatingStudent?.district || ""}
                        onChange={(e) => handleInputChange(e, "district")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Please select District</MenuItem>
                        {districtOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="State"
                        value={updatingStudent?.state || ""}
                        onChange={(e) => handleInputChange(e, "state")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Please select State</MenuItem>
                        {stateOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Country"
                        value={updatingStudent?.country || ""}
                        onChange={(e) => handleInputChange(e, "country")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>{" "}
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Pincode"
                        value={updatingStudent?.pincode || ""}
                        onChange={(e) => handleInputChange(e, "pincode")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Permanent Address"
                        value={updatingStudent?.permanentAddress || ""}
                        onChange={(e) =>
                          handleInputChange(e, "permanentAddress")
                        }
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Permanent Landmark"
                        value={updatingStudent?.plandmark || ""}
                        onChange={(e) => handleInputChange(e, "plandmark")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Permanent City"
                        value={updatingStudent?.pcity || ""}
                        onChange={(e) => handleInputChange(e, "pcity")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Permanent Taluka"
                        value={updatingStudent?.ptaluka || ""}
                        onChange={(e) => handleInputChange(e, "ptaluka")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Permanent District"
                        value={updatingStudent?.pdistrict || ""}
                        onChange={(e) => handleInputChange(e, "pdistrict")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Please select District</MenuItem>
                        {districtOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Permanent State"
                        value={updatingStudent?.pstate || ""}
                        onChange={(e) => handleInputChange(e, "pstate")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                        select
                      >
                        <MenuItem value="">Please select District</MenuItem>
                        {stateOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="permanent country"
                        value={updatingStudent?.pcountry || ""}
                        onChange={(e) => handleInputChange(e, "pcountry")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="permanent pincode"
                        value={updatingStudent?.ppincode || ""}
                        onChange={(e) => handleInputChange(e, "ppincode")}
                        fullWidth
                        style={{ marginBottom: "16px" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdatingStudent(null)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmitUpdate} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default StudentList;