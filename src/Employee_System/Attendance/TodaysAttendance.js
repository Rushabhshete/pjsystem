// import React, { useState, useEffect } from 'react';
// import { 
//   getAllEmployees, 
//   // getTodaysAttendance, 
//   getPresentEmployeeCount, 
//   getAbsentEmployeeCount,
//   getTotalEmployeeCount
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
//   MenuItem,
//   FormControl,
//   Card,
//   CardContent,
// } from '@mui/material';
// import axios from 'axios';
// import { styled } from '@mui/system';

// const Container = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
// }));

// const TodaysAttendance = () => {
//   const [employees, setEmployees] = useState([]);
//   const [todaysAttendance, setTodaysAttendance] = useState([]);
//   const [presentCount, setPresentCount] = useState(0);
//   const [absentCount, setAbsentCount] = useState(0);
//   const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [timeFilter, setTimeFilter] = useState('Today'); // New state for filter options
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [startDate, setStartDate] = useState(''); // State for start date
//   const [endDate, setEndDate] = useState('');     // State for end date
  
//   // Options for the dropdown, initialized with all possible statuses
//   const filterOptions = ['Today','Yesterday', 'Custom Date'];


//   useEffect(() => {
//     // fetchInitialData();
//     fetchEmployeeCounts();
//   }, []);

//   useEffect(() => {
//     filterAttendance();
//   }, [search, statusFilter, employees, todaysAttendance]);

//   // Trigger API call when timeFilter changes
//   useEffect(() => {
//     if (timeFilter !== 'Custom Date') {
//       handleFilterChange(timeFilter);
//     }
//   }, [timeFilter]);

//   useEffect(() => {
//     if (timeFilter === 'Custom Date' && startDate && endDate) {
//       handleFilterChange('Custom Date');
//     }
//   }, [startDate, endDate]);

//   // const fetchInitialData = async () => {
//   //   try {
//   //     const allEmployees = await getAllEmployees();
//   //     setEmployees(allEmployees);

//   //     // const attendanceData = await getTodaysAttendance();
//   //     // setTodaysAttendance(attendanceData);
//   //   } catch (error) {
//   //     console.error("Error fetching initial data:", error);
//   //   }
//   // };

//     // Fetch data based on the filter (All or Today)
//     const handleFilterChange = async (filter) => {
//       try {
//         let response;
//         const instituteCode = localStorage.getItem('institutecode');
  
//         // if (filter === 'All') {
//         //   response = await axios.get(
//         //     `http://localhost:8082/joinedEmployeesList?institutecode=${instituteCode}`
//         //   );
//         // } else 
//         if (filter === 'Today') {
//           response = await axios.get(
//             `http://localhost:8082/today?institutecode=${instituteCode}`
//           );
//         } else if (filter === 'Yesterday') {
//           response = await axios.get(
//             `http://localhost:8082/getAttendenceByyesterday?institutecode=${instituteCode}`
//           );
//         } else if (filter === 'Custom Date' && startDate && endDate) {
//           response = await axios.get(
//             `http://localhost:8082/getAttendenceBYycustomDate?institutecode=${instituteCode}&startDate=${startDate}&endDate=${endDate}`
//           );
//         }

  
//         if (response && response.data) {
//           setEmployees(response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//   const fetchEmployeeCounts = async () => {
//     try {
//       const presentCount = await getPresentEmployeeCount();
//       const absentCount = await getAbsentEmployeeCount();
//       const totalEmployeeCount = await getTotalEmployeeCount();
//       setTotalEmployeeCount(totalEmployeeCount);
//       setPresentCount(presentCount);
//       setAbsentCount(absentCount);
//     } catch (error) {
//       console.error("Error fetching employee counts:", error);
//     }
//   };

//   const mergeAttendanceData = () => {
//     const mergedData = employees.map(employee => {
//       const attendance = todaysAttendance.find(att => att.empID === employee.empID);
//       return attendance ? { ...employee, ...attendance } : { ...employee, status:employee.status || 'Absent' };
//     });
//     return mergedData;
//   };

//   const filterAttendance = () => {
//     let mergedData = mergeAttendanceData();

//     // Filter by search term
//     if (search) {
//       mergedData = mergedData.filter(employee =>
//         employee.fullName && employee.fullName.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//      // Filter by status
//      if (statusFilter === 'Present') {
//       mergedData = mergedData.filter(employee => employee.status === 'On time' || employee.status === 'Late');
//     } else if (statusFilter === 'Absent') {
//       mergedData = mergedData.filter(employee => employee.status === 'Absent');
//     }

//     // Update filtered attendance
//     setFilteredAttendance(mergedData);
//   };

//   return (
//     <>
          
//     <Container>
//       <Grid container spacing={2} sx={{ marginBottom: 3 }}>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ backgroundColor: '#F9E79F', borderRadius:"10px" }}>
//             <CardContent>
//               <Typography variant="h6" component="div">
//                 Total Employees
//               </Typography>
//               <Typography variant="h4" component="div">
//                 {totalEmployeeCount}
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Card sx={{ backgroundColor: '#FF6F61' }}>
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
//           <Card sx={{ backgroundColor: '#3498DB' }}>
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
//             <TextField
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               label="Status"
//               select
//             >
//               <MenuItem value="All">All</MenuItem>
//               <MenuItem value="Present">Present</MenuItem>
//               <MenuItem value="Absent">Absent</MenuItem>
//             </TextField>
//           </FormControl>
//         </Grid>
//            {/* Dropdown for filtering */}
//            <Grid item xs={12} sm={6} md={4}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//               select
//                 value={timeFilter} // Use new state here
//                 onChange={(e) => setTimeFilter(e.target.value)} // Update state
//                 label="Filter by"
//               >
//                 {filterOptions.map((option) => (
//                   <MenuItem key={option} value={option}>
//                     {option}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           {timeFilter === 'Custom Date' && (
//             <>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   fullWidth
//                   type='date'
//                   label="Start Date"
//                   variant="outlined"
//                   value={startDate}
//                   InputLabelProps={{ shrink: true }}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   fullWidth
//                   type='date'
//                   label="End Date"
//                   variant="outlined"
//                   value={endDate}
//                   InputLabelProps={{ shrink: true }}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={4}>
//               </Grid>
//             </>
//           )}
//       </Grid>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold' }}>EmpID</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Shift</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Login</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Break In</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Break Out</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Break Minutes</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Logout</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Total Minutes</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredAttendance.length > 0 ? (
//               filteredAttendance.map(employee => (
//                 <TableRow key={employee.empID}>
//                   <TableCell>{employee.empID}</TableCell>
//                   <TableCell>{employee.fullName || employee.name}</TableCell>
//                   <TableCell>{employee.todaysDate || 'N/A'}</TableCell>
//                   <TableCell>{employee.shift}</TableCell>
//                   <TableCell>{employee.loginTime || 'N/A'}</TableCell>
//                   <TableCell>{employee.breakIn || 'N/A'}</TableCell>
//                   <TableCell>{employee.breakOut || 'N/A'}</TableCell>
//                   <TableCell>{employee.breakMinutes || 'N/A'}</TableCell>
//                   <TableCell>{employee.logoutTime || 'N/A'}</TableCell>
//                   <TableCell>{employee.minutes || 'N/A'}</TableCell>
//                   <TableCell sx={{color: employee.status === 'Late' ? 'red' : employee.status === 'On time' ? 'green' : 'black', fontWeight: 'bold' }}>{employee.status}</TableCell>
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
//     </>
//   );
// };

// export default TodaysAttendance;

import React, { useState, useEffect } from 'react';
import { 
  getPresentEmployeeCount, 
  getAbsentEmployeeCount,
  getTotalEmployeeCount
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
  MenuItem,
  FormControl,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const TodaysAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('Today'); // New state for filter options
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [startDate, setStartDate] = useState(''); // State for start date
  const [endDate, setEndDate] = useState('');     // State for end date
  
  const filterOptions = ['Today', 'Yesterday', 'custom'];

  useEffect(() => {
    fetchEmployeeCounts();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [search, statusFilter, employees]);

  // Trigger API call when timeFilter changes
  useEffect(() => {
    if (timeFilter !== 'custom') {
      handleFilterChange(timeFilter);
    }
  }, [timeFilter]);

  useEffect(() => {
    if (timeFilter === 'custom' && startDate && endDate) {
      handleFilterChange('custom');
    }
  }, [startDate, endDate]);

  const handleFilterChange = async (filter) => {
    try {
      let response;
      const instituteCode = localStorage.getItem('institutecode');
      
      // Updated API call
      response = await axios.get(
        `http://localhost:8082/presentandabsent?institutecode=${instituteCode}&filter=${filter}${
          filter === 'custom' && startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : ''}`
      );
  
      if (response && response.data) {
        const presentEmployees = response.data.presentEmployees || [];
        const absentEmployees = response.data.absentEmployees || [];
  
        // Merge present and absent employees into one array
        const combinedEmployees = [
          ...presentEmployees.map(emp => ({ ...emp, status: emp.status || 'On time' })), // Status for present employees
          ...absentEmployees.map(emp => ({ ...emp, status: 'Absent' })) // Status for absent employees
        ];
  
        setEmployees(combinedEmployees);
        setPresentCount(presentEmployees.length);
        setAbsentCount(absentEmployees.length);
        setTotalEmployeeCount(presentEmployees.length + absentEmployees.length);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  const fetchEmployeeCounts = async () => {
    try {
      const presentCount = await getPresentEmployeeCount();
      const absentCount = await getAbsentEmployeeCount();
      const totalEmployeeCount = await getTotalEmployeeCount();
      setTotalEmployeeCount(totalEmployeeCount);
      setPresentCount(presentCount);
      setAbsentCount(absentCount);
    } catch (error) {
      console.error("Error fetching employee counts:", error);
    }
  };

  const mergeAttendanceData = () => {
    // Ensure employees is an array
    const mergedData = (employees || []).map(employee => {
      return { ...employee };
    });
    return mergedData;
  };
  
  const filterAttendance = () => {
    let mergedData = mergeAttendanceData();

    // Filter by search term
    if (search) {
      mergedData = mergedData.filter(employee =>
        employee.name && employee.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    // Changed the filtering logic to include both 'On time' and 'Late' for Present and ensure only Absent for Absent
    if (statusFilter === 'Present') {
      mergedData = mergedData.filter(employee => employee.status === 'On time' || employee.status === 'Late');
    } else if (statusFilter === 'Absent') {
      mergedData = mergedData.filter(employee => employee.status === 'Absent'); // Ensure only Absent employees
    }

    setFilteredAttendance(mergedData);
  };

  return (
    <>
    <Container>
      <Grid container spacing={2} sx={{ marginBottom: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: '#F9E79F', borderRadius:"10px", fontWeight:'bold' }}>
            <CardContent>
              <Typography variant="h7" component="div">
                Total Employees
              </Typography>
              <Typography variant="h5" component="div">
                {totalEmployeeCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: '#FF6F61', borderRadius:"10px", fontWeight:'bold' }}>
            <CardContent>
              <Typography variant="h7" component="div">
                Present Employees
              </Typography>
              <Typography variant="h5" component="div">
                {presentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: '#3498DB', borderRadius:"10px", fontWeight:'bold' }}>
            <CardContent>
              <Typography variant="h7" component="div">
                Absent Employees
              </Typography>
              <Typography variant="h5" component="div">
                {absentCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
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
            <TextField
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
              select
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Absent">Absent</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth variant="outlined">
            <TextField
              select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              label="Filter by"
            >
              {filterOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        {timeFilter === 'custom' && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type='date'
                label="Start Date"
                variant="outlined"
                value={startDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                type='date'
                label="End Date"
                variant="outlined"
                value={endDate}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}></Grid>
          </>
        )}
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>EmpID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Shift</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Login</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Break In</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Break Out</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Break Minutes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Logout</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Minutes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendance.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.empID}</TableCell>
                <TableCell>{employee.fullName || employee.name}</TableCell>
                <TableCell>{employee.todaysDate}</TableCell>
                <TableCell>{employee.shift}</TableCell>
                <TableCell>{employee.loginTime || 'N/A'}</TableCell>
                <TableCell>{employee.breakIn || 'N/A'}</TableCell>
                <TableCell>{employee.breakOut || 'N/A'}</TableCell>
                <TableCell  sx={{ fontWeight: 'bold' }}>{employee.breakMinutes || '0'}</TableCell>
                <TableCell>{employee.logoutTime || 'N/A'}</TableCell>
                <TableCell  sx={{ fontWeight: 'bold' }}>{employee.minutes || 'N/A'}</TableCell>
                <TableCell  sx={{
          fontWeight: 'bold',
          color: employee.status === 'On time' ? 'green' : 
                 employee.status === 'Late' ? 'orange' : 
                 employee.status === 'Absent' ? 'red' : 'inherit',
        }}>{employee.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </>
  );
};

export default TodaysAttendance;
