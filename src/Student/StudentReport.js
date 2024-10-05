import React, { useState, useEffect, useCallback, useMemo } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
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
  FormControl,
  InputLabel,
  Typography,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { castCategory } from "./DropdownData.js";
import { styled } from "@mui/material/styles";

const StudentReport = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [casteCategory, setCasteCategory] = useState("");
  const [standard, setStandard] = useState("");
  const [standards, setStandards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showDateFields, setShowDateFields] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("id");
  const [earthquake, setEarthquake] = useState("");
  const [projectDifferentiated, setProjectDifferentiated] = useState("");
  const [handicap, setHandicap] = useState("");
  const [medium, setMedium] = useState([]);
  const [selectedMedium, setSelectedMedium] = useState("");
  const [minority, setMinority] = useState("");
  const [sports, setSports] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const institutecode = () => localStorage.getItem("institutecode");

  const API_BASE_URL = "http://13.233.43.240:8080";

  const fetchStudentsByDateRange = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getStudentInTwoDates?institutecode=${institutecode()}&startDate=${startDate}&endDate=${endDate}`
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students by date range!", error);
      setStudents([]);
    }
  }, [startDate, endDate]);

  const fetchAllStudents = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllStudent?institutecode=${institutecode()}`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students!", error);
      setStudents([]);
    }
  }, []);

  const fetchStudentsLast7Days = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getStudentsByTimeframe?institutecode=${institutecode()}&timeframe=7days`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students for the last 7 days!", error);
      setStudents([]);
    }
  }, []);

  const fetchStudentsLast30Days = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getStudentsByTimeframe?institutecode=${institutecode()}&timeframe=30days`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students for the last 30 days!", error);
      setStudents([]);
    }
  }, []);

  const fetchStudentsLast365Days = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getStudentsByTimeframe?institutecode=${institutecode()}&timeframe=365days`
      );
      if (response.status === 200 && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students for the last 365 days!", error);
      setStudents([]);
    }
  }, []);

  const fetchFilteredStudents = useCallback(async () => {
    try {
      let initialUrl = `${API_BASE_URL}/getAllStudent?institutecode=${institutecode()}`;
      const params = {};
      // Apply the primary filter to the params object
      if (standard) {
        initialUrl = `${API_BASE_URL}/students/by-standard-options?institutecode=${institutecode()}&standardOptions=${standard}`;
      }

      // Make the initial API call with the primary filter
      const response = await fetch(initialUrl);
      let data = [];
      if (response.ok) {
        data = await response.json();
      } else {
        console.error("Unexpected response format:", response);
        setStudents([]);
        return;
      }

      // Apply additional filters on the data
      const filteredData = data.filter((student) => {
        if (selectedMedium && student.medium !== selectedMedium) return false;
        if (casteCategory && student.castCategory !== casteCategory)
          return false;
        if (earthquake && String(student.earthquake) !== earthquake)
          return false;
        if (
          projectDifferentiated &&
          String(student.projectDifferentiated) !== projectDifferentiated
        )
          return false;
        if (handicap && String(student.handicap) !== handicap) return false;
        if (minority && String(student.minority) !== minority) return false;
        if (sports && String(student.sportYesNo) !== sports) return false;
        return true;
      });

      // Sort data based on criteria
      const sortedData = filteredData.sort((a, b) => {
        if (sortCriteria === "name") {
          return a.full_name.localeCompare(b.full_name);
        } else if (sortCriteria === "casteCategory") {
          return a.castCategory.localeCompare(b.castCategory);
        }
        return a.id - b.id;
      });

      setStudents(sortedData);
      setTotalRows(sortedData.length); // Update total rows count
    } catch (error) {
      console.error("Error fetching filtered students!", error);
      setStudents([]);
    }
  }, [
    standard,
    selectedMedium,
    casteCategory,
    earthquake,
    projectDifferentiated,
    handicap,
    minority,
    sports,
    sortCriteria,
  ]);

  const fetchStandards = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all?institutecode=${institutecode()}`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setStandards(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setStandards([]);
      }
    } catch (error) {
      console.error("Error fetching standards!", error);
      setStandards([]);
    }
  }, []);

  useEffect(() => {
    axios
      .get(`http://13.233.43.240:8080/getall?institutecode=${institutecode()}`)
      .then((response) => {
        setMedium(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the Medium!", error);
      });
  }, []);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  useEffect(() => {
    fetchStandards();
  }, [fetchStandards]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchStudentsByDateRange();
    } else if (filter === "7") {
      fetchStudentsLast7Days();
    } else if (filter === "30") {
      fetchStudentsLast30Days();
    } else if (filter === "365") {
      fetchStudentsLast365Days();
    } else {
      fetchFilteredStudents();
    }
  }, [
    startDate,
    endDate,
    filter,
    casteCategory,
    standards,
    earthquake,
    projectDifferentiated,
    handicap,
    selectedMedium,
    minority,
    sports,
    fetchStudentsByDateRange,
    fetchFilteredStudents,
    fetchStudentsLast7Days,
    fetchStudentsLast30Days,
    fetchStudentsLast365Days,
  ]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.autoTable({
      head: [
        [
          "ID",
          "Student Full Name",
          "Phone",
          "standards",
          "Caste Category",
          "Earthquake",
          "Project Differentiated",
          "Handicap",
          "Medium",
          "Minority",
          "Sports",
          "Percentage",
        ],
      ],
      body: students.map((student) => [
        student.id,
        student.full_name,
        student.whatsappNumber,
        student.standardOptions,
        student.castCategory,
        student.earthquake ? "Yes" : "No",
        student.projectDifferentiated ? "Yes" : "No",
        student.handicap ? "Yes" : "No",
        student.medium,
        student.minority ? "Yes" : "No",
        student.sports ? "Yes" : "No",
        student.percentage,
      ]),
    });
    doc.save("students_report.pdf");
  };

  const handleFilterChange = async (event) => {
    const value = event.target.value;
    setFilter(value);
    setShowDateFields(value === "FromTo");

    if (value === "7") {
      await fetchStudentsLast7Days();
    } else if (value === "30") {
      await fetchStudentsLast30Days();
    } else if (value === "365") {
      await fetchStudentsLast365Days();
    } else if (value === "FromTo") {
      await fetchStudentsByDateRange();
    } else {
      fetchAllStudents();
    }
  };
  const handleSortCriteriaChange = (event) => {
    setSortCriteria(event.target.value);
  };

  const handleStandardChange = (event) => {
    setStandard(event.target.value);
  };

  const handleMediumChange = (event) => {
    setSelectedMedium(event.target.value);
  };

  const handleCasteCategoryChange = (event) => {
    setCasteCategory(event.target.value);
  };

  const handleEarthquakeChange = (event) => {
    setEarthquake(event.target.value);
  };

  const handleProjectDifferentiatedChange = (event) => {
    setProjectDifferentiated(event.target.value);
  };

  const handleHandicapChange = (event) => {
    setHandicap(event.target.value);
  };

  const handleMinorityChange = (event) => {
    setMinority(event.target.value);
  };

  const handleSportsChange = (event) => {
    setSports(event.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    // Add your delete logic here
    setOpenDialog(false);
  };

  const csvData = students.map((student) => ({
    id: student.id,
    name: student.full_name,
    standard: student.standard,
    age: student.age,
    medium: student.medium,
    mother_tongue: student.mother_tongue,
    handicap: student.handicap,
    earthquake: student.earthquake,
    sports: student.sportYesNo,
    projectDifferentiated: student.projectDifferentiated,
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };
  return (
    <Grid container>
      <Grid item xs={12}>
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
          Student Report
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ marginTop: "20px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="filter-label">Filter</InputLabel>
                  <Select
                    labelId="filter-label"
                    value={filter}
                    onChange={handleFilterChange}
                    label="Filter"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="7">Last 7 Days</MenuItem>
                    <MenuItem value="30">Last 30 Days</MenuItem>
                    <MenuItem value="365">Last 365 Days</MenuItem>
                    <MenuItem value="FromTo">Custom Date</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {showDateFields && (
                <>
                  <Grid item xs={12} sm={2} md={3}>
                    <TextField
                      fullWidth
                      type="date"
                      variant="outlined"
                      label="From Date"
                      value={startDate}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      type="date"
                      variant="outlined"
                      label="To Date"
                      value={endDate}
                      onChange={(e) => setToDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Sort by"
                  select
                  value={sortCriteria}
                  onChange={handleSortCriteriaChange}
                >
                  <MenuItem value="id">ID</MenuItem>
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="casteCategory">Caste Category</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Standard"
                  select
                  value={standard}
                  onChange={handleStandardChange}
                >
                  <MenuItem>All</MenuItem>
                  {standards.map((option) => (
                    <MenuItem
                      key={option.standardname}
                      value={option.standardname}
                    >
                      {option.standardname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Medium"
                  select
                  value={selectedMedium}
                  onChange={handleMediumChange}
                >
                  <MenuItem>All</MenuItem>
                  {medium.map((option) => (
                    <MenuItem key={option.mediumname} value={option.mediumname}>
                      {option.mediumname}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>{" "}
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Caste Category"
                  select
                  value={casteCategory}
                  onChange={handleCasteCategoryChange}
                >
                  {" "}
                  <MenuItem>All</MenuItem>
                  {castCategory.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Earthquake</InputLabel>
                  <Select
                    value={earthquake}
                    onChange={handleEarthquakeChange}
                    label="Earthquake"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Project Affected</InputLabel>
                  <Select
                    value={projectDifferentiated}
                    onChange={handleProjectDifferentiatedChange}
                    label="project Affected"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Handicap</InputLabel>
                  <Select
                    value={handicap}
                    onChange={handleHandicapChange}
                    label="handicap"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Minority</InputLabel>
                  <Select
                    value={minority}
                    onChange={handleMinorityChange}
                    label="Minority"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Sports</InputLabel>
                  <Select
                    value={sports}
                    onChange={handleSportsChange}
                    label="Sports"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small" // Reduce the size of the button
                  startIcon={<GetAppIcon />} // Place the icon before the text
                  onClick={handleDownloadPDF}
                >
                  Download PDF
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <CSVLink
                  data={csvData}
                  filename={"students.csv"}
                  target="_blank"
                  separator={","}
                  style={{ textDecoration: "none" }} // Optional: Remove underline style
                >
                  <Button
                    variant="contained"
                    color="primary"
                    size="small" // Reduce the size of the button
                    startIcon={<CloudDownloadIcon />} // Place the icon before the text
                  >
                    Download CSV
                  </Button>
                </CSVLink>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Table component={Paper} style={{ overflowX: "auto", marginTop: "20px" }}>
        <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Student Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Standards</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Caste Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>
              Earthquake Affected
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Project Affected</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Handicap</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Medium</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Minority</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Sports</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Percentage</TableCell>
            {/* <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStudents
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.whatsappNumber}</TableCell>
                <TableCell>{student.standardOptions}</TableCell>
                <TableCell>{student.castCategory}</TableCell>
                <TableCell>{student.earthquake ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {student.projectDifferentiated ? "Yes" : "No"}
                </TableCell>
                <TableCell>{student.handicap ? "Yes" : "No"}</TableCell>
                <TableCell>{student.medium}</TableCell>
                <TableCell>{student.minority ? "Yes" : "No"}</TableCell>
                <TableCell>{student.sportYesNo ? "Yes" : "No"}</TableCell>
                <TableCell>{student.percentage}</TableCell>
              </TableRow>
            ))}
        </TableBody>{" "}
      </Table>
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
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* </TableContainer> */}
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={filteredStudents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ position: "relative" }}
      />{" "}
    </Grid>
    // </Grid>
  );
};

export default StudentReport;