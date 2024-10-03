// import React, { useState, useEffect } from 'react';
// import { getAllEmployees, deleteEmployee } from '../Attendance/attendanceService';
// import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Box, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const ManageAttendance = () => {
//   const [employees, setEmployees] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const data = await getAllEmployees();
//       setEmployees(data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   const handleDelete = async (employee) => {
//     try {
//       const confirmed = window.confirm('Are you sure you want to delete this employee?');
//       if (confirmed) {
//         await deleteEmployee(employee);
//         fetchEmployees();
//       }
//     } catch (error) {
//       console.error('Error deleting employee:', error);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const filteredEmployees = employees.filter((employee) => {
//     return (
//       (employee.empID && employee.empID.toString().includes(searchQuery)) ||
//       (employee.fullName && employee.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (employee.joiningDate && employee.joiningDate.toLowerCase().includes(searchQuery.toLowerCase()))
//     );
//   });

//   return (
//     <Box sx={{ padding: { xs: 2, sm: 4 } }}>
//       <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//         <Grid item xs={12}>
//           <TextField
//             fullWidth
//             label="Search..."
//             variant="outlined"
//             value={searchQuery}
//             onChange={handleSearch}
//             sx={{ marginBottom: 2 }}
//           />
//         </Grid>
//       </Grid>
//       <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//         <Table>
//           <TableHead sx={{backgroundColor:'#f2f2f2'}}>
//             <TableRow>
//               <TableCell sx={{fontWeight:'bold'}}>Employee ID</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Mobile Number</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Email Id</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Joining Date</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredEmployees.map((employee) => (
//               <TableRow key={employee.empID}>
//                 <TableCell>{employee.empID}</TableCell>
//                 <TableCell>{employee.fullName}</TableCell>
//                 <TableCell>{employee.mobileNo}</TableCell>
//                 <TableCell>{employee.email}</TableCell>
//                 <TableCell>{employee.joiningDate}</TableCell>
//                 <TableCell>
//                   <Grid container spacing={1}>
//                     <Grid item>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => navigate(`/layout/ViewAttendance/${employee.empID}`)}
//                       >
//                         View
//                       </Button>
//                     </Grid>
//                     <Grid item>
//                       {/* <Button
//                         variant="contained"
//                         color="error"
//                         onClick={() => handleDelete(employee.empID)}
//                       >
//                         Delete
//                       </Button> */}
//                     </Grid>
//                   </Grid>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default ManageAttendance;

// import React, { useState, useEffect } from 'react';
// import { getAllEmployees, deleteEmployee } from '../Attendance/attendanceService';
// import {
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   Grid,
//   Box,
//   Typography
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const ManageAttendance = () => {
//   const [employees, setEmployees] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const data = await getAllEmployees();
//       setEmployees(data);
//     } catch (error) {
//       console.error('Error fetching employees:', error);
//     }
//   };

//   // const handleDelete = async (employee) => {
//   //   try {
//   //     const confirmed = window.confirm('Are you sure you want to delete this employee?');
//   //     if (confirmed) {
//   //       await deleteEmployee(employee);
//   //       fetchEmployees();
//   //     }
//   //   } catch (error) {
//   //     console.error('Error deleting employee:', error);
//   //   }
//   // };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Function to handle filtering by date range
//   const isWithinDateRange = (joiningDate) => {
//     const date = new Date(joiningDate);
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     if (start && end) {
//       return date >= start && date <= end;
//     } else if (start) {
//       return date >= start;
//     } else if (end) {
//       return date <= end;
//     }
//     return true; // No date filter applied
//   };

//   const filteredEmployees = employees.filter((employee) => {
//     const matchesSearch = 
//       (employee.empID && employee.empID.toString().includes(searchQuery)) ||
//       (employee.fullName && employee.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase()));

//     const matchesDateRange = isWithinDateRange(employee.joiningDate);

//     return matchesSearch && matchesDateRange;
//   });

//   return (
//     <>
//     <Typography
//     variant="h5"
//     gutterBottom
//     sx={{
//       fontWeight: "bold",
//       color: "#fff",
//       textAlign: "center",
//       backgroundColor: "#24A0ED",
//       borderRadius: "150px",
//       padding: "10px"
//     }}
//   >
//     Attendance Report
//   </Typography>
//     <Box sx={{ padding: { xs: 2, sm: 4 } }}>
//       <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//         <Grid item xs={12} sm={4}>
//           <TextField
//             fullWidth
//             label="Search..."
//             variant="outlined"
//             value={searchQuery}
//             onChange={handleSearch}
//             sx={{ marginBottom: 2 }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="Start Date"
//             type="date"
//             InputLabelProps={{
//               shrink: true,
//             }}
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="End Date"
//             type="date"
//             InputLabelProps={{
//               shrink: true,
//             }}
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </Grid>
//       </Grid>

//       <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//         <Table>
//           <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold' }}>EmpID</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Mobile Number</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Email Id</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Joining Date</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredEmployees.map((employee) => (
//               <TableRow key={employee.empID}>
//                 <TableCell>{employee.empID}</TableCell>
//                 <TableCell>{employee.fullName}</TableCell>
//                 <TableCell>{employee.mobileNo}</TableCell>
//                 <TableCell>{employee.email}</TableCell>
//                 <TableCell>{new Date(employee.joiningDate).toLocaleDateString("en-GB")}</TableCell>
//                 <TableCell>
//                   <Grid container spacing={1}>
//                     <Grid item>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => navigate(`/layout/ViewAttendance/${employee.empID}`)}
//                       >
//                         View
//                       </Button>
//                     </Grid>
//                     <Grid item>
//                       {/* <Button
//                         variant="contained"
//                         color="error"
//                         onClick={() => handleDelete(employee.empID)}
//                       >
//                         Delete
//                       </Button> */}
//                     </Grid>
//                   </Grid>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//     </>
//   );
// };

// export default ManageAttendance;


import React, { useState, useEffect } from 'react';
import { getAllEmployees } from '../Attendance/attendanceService';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  Typography,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const institutecode = () => localStorage.getItem('institutecode'); // Assuming institutecode is stored in localStorage

  // Fetch all employees initially
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Automatically fetch employees by date range when both start and end dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      fetchEmployeesByDateRange();
    }
  }, [startDate, endDate]);

  // Function to fetch employees by custom date range
  const fetchEmployeesByDateRange = async () => {
    try {
      const response = await axios.get(`http://13.233.43.240:8082/byDateRange`, {
        params: {
          startDate,
          endDate,
          institutecode: institutecode(),
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees by date range:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = 
      (employee.empID && employee.empID.toString().includes(searchQuery)) ||
      (employee.fullName && employee.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

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
          padding: "10px"
        }}
      >
        Attendance Report
      </Typography>
      <Box sx={{ padding: { xs: 2, sm: 4 } }}>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              sx={{ marginBottom: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>EmpID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mobile Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email Id</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Joining Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.empID}>
                  <TableCell>{employee.empID}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.mobileNo}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{new Date(employee.joiningDate).toLocaleDateString("en-GB")}</TableCell>
                  <TableCell>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate(`/layout/ViewAttendance/${employee.empID}`)}
                        >
                          View
                        </Button>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default ManageAttendance;
