// import React, { useState, useEffect } from 'react';
// import { 
//   getAllEmployees, 
//   getTodaysAttendance, 
//   getPresentEmployeeCount, 
//   getAbsentEmployeeCount 
// } from '../Attendance/attendanceService';
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Grid,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Card,
//   CardContent,
// } from '@mui/material';
// import { styled } from '@mui/system';

// const Container = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
// }));

// const TodaysAttendance = () => {
//   const [employees, setEmployees] = useState([]);
//   const [todaysAttendance, setTodaysAttendance] = useState([]);
//   const [presentCount, setPresentCount] = useState(0);
//   const [absentCount, setAbsentCount] = useState(0);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [filteredAttendance, setFilteredAttendance] = useState([]);

//   useEffect(() => {
//     fetchInitialData();
//     fetchEmployeeCounts();
//   }, []);

//   useEffect(() => {
//     filterAttendance();
//   }, [search, statusFilter, employees, todaysAttendance]);

//   const fetchInitialData = async () => {
//     try {
//       const allEmployees = await getAllEmployees();
//       setEmployees(allEmployees);

//       const attendanceData = await getTodaysAttendance();
//       setTodaysAttendance(attendanceData);
//     } catch (error) {
//       console.error("Error fetching initial data:", error);
//     }
//   };

//   const fetchEmployeeCounts = async () => {
//     try {
//       const presentCount = await getPresentEmployeeCount();
//       const absentCount = await getAbsentEmployeeCount();
//       setPresentCount(presentCount);
//       setAbsentCount(absentCount);
//     } catch (error) {
//       console.error("Error fetching employee counts:", error);
//     }
//   };

//   const mergeAttendanceData = () => {
//     const mergedData = employees.map(employee => {
//       const attendance = todaysAttendance.find(att => att.empID === employee.empID);
//       return attendance ? { ...employee, ...attendance } : { ...employee, status: 'Absent' };
//     });

//     return mergedData;
//   };

//   const filterAttendance = () => {
//     let mergedData = mergeAttendanceData();

//     if (search) {
//       mergedData = mergedData.filter(employee =>
//         employee.fullName && employee.fullName.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'All') {
//       mergedData = mergedData.filter(employee => employee.status === statusFilter);
      
//     }

//     setFilteredAttendance(mergedData);
//   };

//   return (
//     <Container>
//        <Typography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           color: "#fff",
//           textAlign: "center",
//           backgroundColor: "#24A0ED",
//           borderRadius: "150px",
//           padding: "10px",
//           marginBottom: "20px",
//         }}
//       >
//         Attendane Dashboard
//       </Typography>
//       <Grid container spacing={2} sx={{ marginBottom: 3 }}>
//         <Grid item xs={12} md={4}>
//           <Card sx={{backgroundColor:'#3498DB'}}>
//             <CardContent>
//               <Typography variant="h6" component="div">
//                 Total Employees
//               </Typography>
//               <Typography variant="h4" component="div" >
//                 {filteredAttendance.length}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{backgroundColor:'#FF6F61'}}>
//             <CardContent>
//               <Typography variant="h6" component="div">
//                 Present Employees
//               </Typography>
//               <Typography variant="h4" component="div">
//                 {presentCount}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{backgroundColor:'#9ACD32'}}>
//             <CardContent>
//               <Typography variant="h6" component="div">
//                 Absent Employees
//               </Typography>
//               <Typography variant="h4" component="div">
//                 {absentCount}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <TextField
//             fullWidth
//             label="Search by name"
//             variant="outlined"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <FormControl fullWidth variant="outlined">
//             <InputLabel>Status</InputLabel>
//             <Select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               label="Status"
//             >
//               <MenuItem value="All">All</MenuItem>
//               <MenuItem value="Present">Present</MenuItem>
//               <MenuItem value="Absent">Absent</MenuItem>
//               {/* Add more status options as needed */}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{backgroundColor:'#f2f2f2'}}>
//             <TableRow>
//               <TableCell sx={{fontWeight:'bold'}}>ID</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Shift</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Login</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Break In</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Break Out</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Logout</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Total Minutes</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredAttendance.length > 0 ? (
//               filteredAttendance.map(employee => (
//                 <TableRow key={employee.empID}>
//                   <TableCell>{employee.empID}</TableCell>
//                   <TableCell>{employee.fullName}</TableCell>
//                   <TableCell>{employee.shift}</TableCell>
//                   <TableCell>{employee.loginTime || 'N/A'}</TableCell>
//                   <TableCell>{employee.breakIn || 'N/A'}</TableCell>
//                   <TableCell>{employee.breakOut || 'N/A'}</TableCell>
//                   <TableCell>{employee.logoutTime || 'N/A'}</TableCell>
//                   <TableCell>{employee.minutes || 'N/A'}</TableCell>
//                   <TableCell>{employee.status}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={9} align="center">
//                   No attendance records found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default TodaysAttendance;


import React, { useState, useEffect } from 'react';
import { 
  getAllEmployees, 
  getTodaysAttendance, 
  getPresentEmployeeCount, 
  getAbsentEmployeeCount 
} from '../Attendance/attendanceService';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const TodaysAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  
  // Options for the dropdown, initialized with all possible statuses
  const statusOptions = ['All', 'Present', 'Absent', 'Late'];

  useEffect(() => {
    fetchInitialData();
    fetchEmployeeCounts();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [search, statusFilter, employees, todaysAttendance]);

  const fetchInitialData = async () => {
    try {
      const allEmployees = await getAllEmployees();
      setEmployees(allEmployees);

      const attendanceData = await getTodaysAttendance();
      setTodaysAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const fetchEmployeeCounts = async () => {
    try {
      const presentCount = await getPresentEmployeeCount();
      const absentCount = await getAbsentEmployeeCount();
      setPresentCount(presentCount);
      setAbsentCount(absentCount);
    } catch (error) {
      console.error("Error fetching employee counts:", error);
    }
  };

  // const fetchTodaysAttendanceFromAPI = async () => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:8082/today?institutecode=${institutecode}`
  //     );
  //     setTodaysAttendance(response.data);
  //   } catch (error) {
  //     console.error('Error fetching today\'s attendance:', error);
  //   }
  // };

  const mergeAttendanceData = () => {
    const mergedData = employees.map(employee => {
      const attendance = todaysAttendance.find(att => att.empID === employee.empID);
      return attendance ? { ...employee, ...attendance } : { ...employee, status: 'Absent' };
    });
    return mergedData;
  };

  const filterAttendance = () => {
    let mergedData = mergeAttendanceData();

    // Filter by search term
    if (search) {
      mergedData = mergedData.filter(employee =>
        employee.fullName && employee.fullName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'All') {
      mergedData = mergedData.filter(employee => employee.status === statusFilter);
    }

    // Update filtered attendance
    setFilteredAttendance(mergedData);
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
        }}
      >
        Attendance Dashboard
      </Typography>
    <Container>
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#3498DB', borderRadius:"10px" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Employees
              </Typography>
              <Typography variant="h4" component="div">
                {filteredAttendance.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#9ACD32' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Present Employees
              </Typography>
              <Typography variant="h4" component="div">
                {presentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#FF6F61' }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Absent Employees
              </Typography>
              <Typography variant="h4" component="div">
                {absentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Search by name"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shift</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Login</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Break In</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Break Out</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Logout</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Minutes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map(employee => (
                <TableRow key={employee.empID}>
                  <TableCell>{employee.empID}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.shift}</TableCell>
                  <TableCell>{employee.loginTime || 'N/A'}</TableCell>
                  <TableCell>{employee.breakIn || 'N/A'}</TableCell>
                  <TableCell>{employee.breakOut || 'N/A'}</TableCell>
                  <TableCell>{employee.logoutTime || 'N/A'}</TableCell>
                  <TableCell>{employee.minutes || 'N/A'}</TableCell>
                  <TableCell>{employee.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No attendance records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </>
  );
};

export default TodaysAttendance;

