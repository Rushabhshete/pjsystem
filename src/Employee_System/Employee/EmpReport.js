import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
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
  Typography,
  Select,
  Grid,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { styled } from '@mui/system';

const employeeTypeOptions = ["all", "Permanent", "Temporary", "Intern"];
const dutyTypeOptions = ["all", "Full Time", "Part Time"];
const shiftOptions = ["all", "Morning", "Afternoon", "Evening", "Night", "General"];

const EmpReport = () => {
  const [user, setUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [employeeType, setEmployeeType] = useState("all");
  const [employeecategory, setEmployeeCategory] = useState("all");
  const [dutyType, setDutyType] = useState("all");
  const [shift, setShift] = useState("all");
  const [department, setDepartment] = useState("all");
  const [departmentOptions, setDepartmentOptions] = useState(["all"]);
  const [employeecategoryOptions, setEmployeeCategoryOptions] =useState(["all"]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

  // const getInstituteCode = () => localStorage.getItem("institutecode");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!institutecode) {
          console.error("No institutecode found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://13.233.43.240:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [institutecode]);

  const fetchAllEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`http://13.233.43.240:8082/getNonDeleted?institutecode=${institutecode}`);
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        setUser(response.data);
        const uniqueDepartments = ["all", ...new Set(response.data.map(emp => emp.department))];
        setDepartmentOptions(uniqueDepartments);
        const uniqueCategory = ["all", ...new Set(response.data.map(emp => emp.employeecategory))];
        setEmployeeCategoryOptions(uniqueCategory);
      } else {
        console.error("Unexpected response format:", response);
        setUser([]);
      }
    } catch (error) {
      console.error("There was an error fetching the employees!", error);
      setUser([]);
    }
  }, [institutecode]);

  const fetchFilteredUser = useCallback(async () => {
    try {
      let url = `http://13.233.43.240:8082/getNonDeleted?institutecode=${institutecode}`;
      if (filter === "7") {
        url = `http://13.233.43.240:8082/employees/last7days?institutecode=${institutecode}`;
      } else if (filter === "30") {
        url = `http://13.233.43.240:8082/employees/lastMonth?institutecode=${institutecode}`;
      } else if (filter === "365") {
        url = `http://13.233.43.240:8082/employees/lastYear?institutecode=${institutecode}`;
      }

      const response = await axios.get(url);
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        let filteredData = response.data;
        if (employeeType !== "all") {
          filteredData = filteredData.filter((user) => user.employeeType === employeeType);
        }
        if (dutyType !== "all") {
          filteredData = filteredData.filter((user) => user.dutyType === dutyType);
        }
        if (shift !== "all") {
          filteredData = filteredData.filter((user) => user.shift === shift);
        }
        if (employeecategory !== "all") {
          filteredData = filteredData.filter((user) => user.employeecategory === employeecategory);
        }
        if (department !== "all") {
          filteredData = filteredData.filter((user) => user.department === department);
        }
        setUser(filteredData);
      } else {
        console.error("Unexpected response format:", response);
        setUser([]);
      }
    } catch (error) {
      console.error("There was an error fetching the employees!", error);
      setUser([]);
    }
  }, [filter, employeeType, employeecategory, dutyType, shift, department, institutecode]);

  const fetchByDateRange = useCallback(async () => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(`http://13.233.43.240:8082/byDateRange?startDate=${startDate}&endDate=${endDate}&institutecode=${institutecode}`);
        if (response.status === 200 && response.data && Array.isArray(response.data)) {
          setUser(response.data);
        } else {
          console.error("Unexpected response format:", response);
          setUser([]);
        }
      } catch (error) {
        console.error("There was an error fetching employees by date range!", error);
        setUser([]);
      }
    }
  }, [startDate, endDate, institutecode]);

  useEffect(() => {
    fetchAllEmployees();
  }, [fetchAllEmployees],[ institutecode]);

  useEffect(() => {
    if (filter === "byDateRange") {
      fetchByDateRange();
    } else {
      fetchFilteredUser();
    }
  }, [filter, employeeType, employeecategory, dutyType, shift, department, fetchFilteredUser, fetchByDateRange, institutecode]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = user.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.workDetail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF({ orientation: "landscape" });
//     const margin = 10; // Set margin for top spacing

//     // Add the title "Employee Report"
//     const title = "Employee Report";
//     doc.setFontSize(18);
//     const titleWidth = doc.getTextWidth(title);
//     const centerX = (doc.internal.pageSize.getWidth() - titleWidth) / 2;
//     doc.text(title, centerX, margin + 15, { align: "center" });

//     // Add institute image and name
//     const instituteImage = employeeDetails.instituteimage; // Assuming this is a base64 string or URL
//     const instituteName = employeeDetails.institutename;

//     let currentY = margin + 30; // Initial Y position after title

//     if (instituteImage) {
//         const image = new Image();
//         image.src = instituteImage;
//         image.onload = () => {
//             const imageWidth = 30; // Set desired width
//             const imageHeight = 30; // Set desired height

//             // Center the image
//             doc.addImage(image, 'JPEG', (doc.internal.pageSize.getWidth() / 2) - (imageWidth / 2), currentY, imageWidth, imageHeight);
//             currentY += imageHeight + 5; // Update Y position for institute name

//             // Add institute name below the image
//             doc.setFontSize(14);
//             const instituteNameWidth = doc.getTextWidth(instituteName);
//             doc.text(instituteName, (doc.internal.pageSize.getWidth() - instituteNameWidth) / 2, currentY, { align: "center" });
//             currentY += 20; // Update Y position for table
//             createTable(doc, currentY);
//         };
//     } else {
//         // If there's no institute image, just add the institute name
//         doc.setFontSize(14);
//         const instituteNameWidth = doc.getTextWidth(instituteName);
//         doc.text(instituteName, (doc.internal.pageSize.getWidth() - instituteNameWidth) / 2, margin + 40, { align: "center" });
//         currentY = margin + 60; // Update Y position for table
//         createTable(doc, currentY);
//     }
// };

const handleDownloadPDF = () => {
  const doc = new jsPDF({ orientation: "landscape" });
  const margin = 10; // Set margin for top spacing

  // Add the title "Employee Report"
  const title = "Employee Report";
  doc.setFontSize(18);
  // Center title automatically
  doc.text(title, doc.internal.pageSize.getWidth() / 2, margin + 15, { align: "center" });

  // Add institute image and name
  const instituteImage = employeeDetails.instituteimage; // Assuming this is a base64 string or URL
  const instituteName = employeeDetails.institutename;

  let currentY = margin + 30; // Initial Y position after title

  if (instituteImage) {
      const image = new Image();
      image.src = instituteImage;
      image.onload = () => {
          const imageWidth = 30; // Set desired width
          const imageHeight = 30; // Set desired height

          // Center the image
          doc.addImage(image, 'JPEG', (doc.internal.pageSize.getWidth() / 2) - (imageWidth / 2), currentY, imageWidth, imageHeight);
          currentY += imageHeight + 5; // Update Y position for institute name

          // Add institute name below the image and center it
          doc.setFontSize(14);
          doc.text(instituteName, doc.internal.pageSize.getWidth() / 2, currentY, { align: "center" });
          currentY += 20; // Update Y position for table
          createTable(doc, currentY);
      };
  } else {
      // If there's no institute image, just add the institute name
      doc.setFontSize(14);
      doc.text(instituteName, doc.internal.pageSize.getWidth() / 2, margin + 40, { align: "center" });
      currentY = margin + 60; // Update Y position for table
      createTable(doc, currentY);
  }
};


const createTable = (doc, startY) => {
    doc.autoTable({
        head: [
            [
                "ID",
                "Full Name",
                "Mobile No",
                "Parent No",
                "City",
                "Department",
                "Designation",
                "Employee Type",
                "Duty Type",
                "Shift",
            ],
        ],
        body: filteredUsers.map((user) => [
            user.empID,
            user.fullName,
            user.mobileNo,
            user.parentNo,
            user.city,
            user.department,
            user.workDetail,
            user.employeeType,
            user.employeecategory,
            user.dutyType,
            user.shift,
        ]),
        styles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
        },
        headStyles: {
            fillColor: [128, 0, 128], // Purple heading color
            textColor: [255, 255, 255], // White text color
        },
        startY: startY, // Starting Y position for the table
    });

    doc.save("employees.pdf");
};


  const csvData = filteredUsers.map((user) => ({
    ID: user.empID,
    "Full Name": user.fullName,
    "Mobile No": user.mobileNo,
    "Parent No": user.parentNo,
    City: user.city,
    Department: user.department,
    Category: user.employeecategory,
    Designation: user.workDetail,
    "Employee Type": user.employeeType,
    "Duty Type": user.dutyType,
    Shift: user.shift,
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <>
     <PopTypography
      variant="h5"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#24A0ED',
        borderRadius: '150px',
        padding: '10px',
        marginBottom: '-2px'
      }}
    >
      Employee Report
      </PopTypography>
      {/* <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"> */}
        {/* <Container component="main" maxWidth="xl">
          <Paper variant="outlined" style={{ padding: "16px", marginTop: "16px", minHeight: "80vh" }}> */}
            <Grid container spacing={2} style={{ marginBottom: "16px",marginTop:"10px" }} className="textField-root">
             
              <Grid item xs={12} sm={2}>
                <TextField
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  select
                  label="Select"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="7">Last 7 Days</MenuItem>
                  <MenuItem value="30">Last 30 Days</MenuItem>
                  <MenuItem value="365">Last 365 Days</MenuItem>
                  <MenuItem value="byDateRange">Custom Date</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  value={employeeType}
                  onChange={(e) => setEmployeeType(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  select
                  label="Employee Type"
                >
                  {employeeTypeOptions.map((type) => (
                     <MenuItem key={type} value={type}>
                     {type === "all" ? "All Employee Types" : type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Select
                  value={dutyType}
                  onChange={(e) => setDutyType(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                >
                  {dutyTypeOptions.map((type) => (
                    <MenuItem key={type} value={type}>
                       {type === "all" ? "All Duty Types" : type}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  select
                  label="Shift"
                >
                  {shiftOptions.map((type) => (
                   <MenuItem key={type} value={type}>
                   {type === "all" ? "All Shift " : type}
                </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  select
                  label="Department"
                >
                  {departmentOptions.map((type) => (
                     <MenuItem key={type} value={type}>
                     {type === "all" ? "All Departments " : type}
                  </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  value={employeecategory}
                  onChange={(e) => setEmployeeCategory(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  select 
                  label="Category"
                >
                  {employeecategoryOptions.map((type) => (
                     <MenuItem key={type} value={type}>
                     {type === "all" ? "All Categories " : type}
                  </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {filter === "byDateRange" && (
                <>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      type="date"
                      label="Start Date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      type="date"
                      label="End Date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      size="small"
                    />
                  </Grid>
                </>
              )} <Grid item xs={12} sm={2}>
              <TextField
                label="Search"
                value={searchQuery}
                onChange={handleSearch}
                size="small"
                style={{ marginBottom: "16px" }}
              />
            </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  onClick={handleDownloadPDF}
                  fullWidth
                  size="small"
                >
                  Download PDF
                </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                <CSVLink data={csvData} filename="employees.csv" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" fullWidth size="small">
                    Download CSV
                  </Button>
                </CSVLink>
              </Grid>
            </Grid>
            <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={filteredUsers.length}
              style={{marginTop:'-20px'}}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per Page"
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ background: '#f2f2f2'}}>
                  <TableRow>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">ID</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Full Name</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Email</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Mobile No</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Parent No</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">City</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Department</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Category</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Designation</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Employee Type</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Duty Type</Typography></TableCell>
                    <TableCell><Typography variant="subtitle2" fontWeight="bold">Shift</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow key={user.empID}>
                      <TableCell>{user.empID}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobileNo}</TableCell>
                      <TableCell>{user.parentNo}</TableCell>
                      <TableCell>{user.city}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.employeecategory}</TableCell>
                      <TableCell>{user.workDetail}</TableCell>
                      <TableCell>{user.employeeType}</TableCell>
                      <TableCell>{user.dutyType}</TableCell>
                      <TableCell>{user.shift}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
              rowsPerPageOptions={[10, 20, 30]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per Page"
            /> */}
          {/* </Paper>
        </Container> */}
      {/* </Box> */}
    </>
  );
};

export default EmpReport;
