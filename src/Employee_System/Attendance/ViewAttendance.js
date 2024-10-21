// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   getAttendanceById,
//   getLast7DaysAttendance,
//   getLastMonthAttendance,
//   getLast365DaysAttendance,
//   getAttendanceByDateRange,
// } from '../Attendance/attendanceService';
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Grid,
//   TextField,
// } from '@mui/material';
// import { DatePicker } from '@mui/lab';

// const ViewAttendance = () => {
//   const { empID } = useParams();
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [period, setPeriod] = useState('all');
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);

//   useEffect(() => {
//     fetchAttendance();
//   }, [empID, period, fromDate, toDate]);

//   const fetchAttendance = async () => {
//     try {
//       let data;
//       if (period === 'dateRange' && fromDate && toDate) {
//         data = await getAttendanceByDateRange(
//           empID,
//           fromDate.toISOString().split('T')[0],
//           toDate.toISOString().split('T')[0]
//         );
//       } else {
//         switch (period) {
//           case 'last7':
//             data = await getLast7DaysAttendance(empID);
//             break;
//           case 'lastMonth':
//             data = await getLastMonthAttendance(empID);
//             break;
//           case 'last365':
//             data = await getLast365DaysAttendance(empID);
//             break;
//           default:
//             data = await getAttendanceById(empID);
//         }
//       }
//       setAttendanceRecords(data);
//     } catch (error) {
//       console.error('Error fetching attendance records:', error);
//     }
//   };



//   return (
//     <Box sx={{ padding: { xs: 2, sm: 4 } }}>
//       <Typography variant="h4" gutterBottom>
//         Attendance for Employee ID: {empID}
//       </Typography>
//       <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//         <Grid item>
//           <Button variant="contained" onClick={() => setPeriod('all')} sx={{ marginRight: 1 }}>
//             All Time
//           </Button>
//         </Grid>
//         <Grid item>
//           <Button variant="contained" onClick={() => setPeriod('last7')} sx={{ marginRight: 1 }}>
//             Last 7 Days
//           </Button>
//         </Grid>
//         <Grid item>
//           <Button variant="contained" onClick={() => setPeriod('lastMonth')} sx={{ marginRight: 1 }}>
//             Last Month
//           </Button>
//         </Grid>
//         <Grid item>
//           <Button variant="contained" onClick={() => setPeriod('last365')}>
//             Last 365 Days
//           </Button>
//         </Grid>
//         <Grid item>
//           <Button variant="contained" onClick={() => setPeriod('dateRange')}>
//             Date Range
//           </Button>
//         </Grid>
//         {period === 'dateRange' && (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6} md={3}>
//               <DatePicker
//                 label="From Date"
//                 value={fromDate}
//                 onChange={(date) => setFromDate(date)}
//                 renderInput={(params) => <TextField {...params} />}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <DatePicker
//                 label="To Date"
//                 value={toDate}
//                 onChange={(date) => setToDate(date)}
//                 renderInput={(params) => <TextField {...params} />}
//               />
//             </Grid>
//           </Grid>
//         )}
//       </Grid>
//       <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//         <Table>
//           <TableHead sx={{backgroundColor:'#f2f2f2'}}>
//             <TableRow>
//               <TableCell sx={{fontWeight:'bold'}}>Date</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Shift</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Login Time</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Break In</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Break Out</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Logout Time</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Minutes</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>Status</TableCell>
//               <TableCell sx={{fontWeight:'bold'}}>IP</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {attendanceRecords.map((record) => (
//               <TableRow key={record.todaysDate}>
//                 <TableCell>{record.todaysDate}</TableCell>
//                 <TableCell>{record.shift}</TableCell>
//                 <TableCell>{record.loginTime}</TableCell>
//                 <TableCell>{record.breakIn}</TableCell>
//                 <TableCell>{record.breakOut}</TableCell>
//                 <TableCell>{record.logoutTime}</TableCell>
//                 <TableCell>{record.minutes}</TableCell>
//                 <TableCell>{record.status}</TableCell>
//                 <TableCell>{record.ip}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default ViewAttendance;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   getAttendanceById,
//   getLast7DaysAttendance,
//   getLastMonthAttendance,
//   getLast365DaysAttendance,
//   getAttendanceByDateRange,
// } from '../Attendance/attendanceService';
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   Grid,
//   TextField,
// } from '@mui/material';

// const ViewAttendance = () => {
//   const { empID } = useParams();
//   const navigate = useNavigate(); // Hook for navigation
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [period, setPeriod] = useState('all');
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   useEffect(() => {
//     fetchAttendance();
//   }, [empID, period, fromDate, toDate]);

//   const fetchAttendance = async () => {
//     try {
//       let data = [];
//       if (period === 'dateRange' && fromDate && toDate) {
//         data = await getAttendanceByDateRange(empID, fromDate, toDate);
//       } else {
//         switch (period) {
//           case 'last7':
//             data = await getLast7DaysAttendance(empID);
//             break;
//           case 'lastMonth':
//             data = await getLastMonthAttendance(empID);
//             break;
//           case 'last365':
//             data = await getLast365DaysAttendance(empID);
//             break;
//           default:
//             data = await getAttendanceById(empID);
//         }
//       }
  
//       // If the data is empty for the date range, set the state to an empty array
//       setAttendanceRecords(data && data.length > 0 ? data : []);
//     } catch (error) {
//       console.error('Error fetching attendance records:', error);
//       setAttendanceRecords([]); // Set to empty on error
//     }
//   };

//   return (
//     <>
//       <Box sx={{ padding: { xs: 2, sm: 4 } }}>
//         <Typography variant="h4" gutterBottom>
//           Attendance for Employee ID: {empID}
//         </Typography>
//         <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//           <Grid item>
//             <Button variant="contained" onClick={() => setPeriod('all')} sx={{ marginRight: 1 }}>
//               All Time
//             </Button>
//           </Grid>
//           <Grid item>
//             <Button variant="contained" onClick={() => setPeriod('last7')} sx={{ marginRight: 1 }}>
//               Last 7 Days
//             </Button>
//           </Grid>
//           <Grid item>
//             <Button variant="contained" onClick={() => setPeriod('lastMonth')} sx={{ marginRight: 1 }}>
//               Last Month
//             </Button>
//           </Grid>
//           <Grid item>
//             <Button variant="contained" onClick={() => setPeriod('last365')} sx={{ marginRight: 1 }}>
//               Last 365 Days
//             </Button>
//           </Grid>
//           <Grid item>
//             <Button variant="contained" onClick={() => setPeriod('dateRange')} sx={{ marginRight: 1 }}>
//               Date Range
//             </Button>
//           </Grid>
//           {period === 'dateRange' && (
//             <Grid container spacing={2} mt={2}>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="From Date"
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6} md={3}>
//                 <TextField
//                   label="To Date"
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//                 />
//               </Grid>
//             </Grid>
//           )}
//           <Grid item sx={{ marginLeft: 'auto' }}>
//             <Button 
//               variant="contained" 
//               onClick={() => navigate('/layout/attendance-manager/manage-attendance')} // Adjust the path as needed
//             >
//               Back to Report
//             </Button>
//           </Grid>
//         </Grid>
//         <TableContainer component={Paper} sx={{ marginTop: 2 }}>
//           <Table>
//             <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
//               <TableRow>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Shift</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Login Time</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Break In</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Break Out</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Break Minutes</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Logout Time</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Minutes</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Login IP</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>LogOut IP</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {attendanceRecords.map((record) => (
//                 <TableRow key={record.todaysDate}>
//                   <TableCell>{record.todaysDate}</TableCell>
//                   <TableCell>{record.shift}</TableCell>
//                   <TableCell>{record.loginTime}</TableCell>
//                   <TableCell>{record.breakIn}</TableCell>
//                   <TableCell>{record.breakOut}</TableCell>
//                   <TableCell>{record.breakMinutes}</TableCell>
//                   <TableCell>{record.logoutTime}</TableCell>
//                   <TableCell>{record.minutes}</TableCell>
//                   <TableCell>{record.ip}</TableCell>
//                   <TableCell>{record.logoutIP}</TableCell>
//                   <TableCell sx={{color: record.status === 'Late' ? 'red' : record.status === 'On time' ? 'green' : 'black', fontWeight: 'bold' }}>{record.status}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </>
//   );
// };

// export default ViewAttendance;



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
} from '@mui/material';

const ViewAttendance = () => {
  const { empID } = useParams();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [period, setPeriod] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [empID, period, fromDate, toDate]);

  const fetchAttendance = async () => {
    try {
      let response = {};
      if (period === 'dateRange' && fromDate && toDate) {
        const url = `http://localhost:8082/adminesideforcustomrange/${empID}?startDate=${fromDate}&endDate=${toDate}`;
        response = await fetch(url).then((res) => res.json());
      } else {
        let url = `http://localhost:8082/adminsidelast7days/${empID}`;
        if (period === 'lastMonth') url = `http://localhost:8082/adminsidelast30days/${empID}`;
        else if (period === 'last365') url = `http://localhost:8082/adminsidelast365days/${empID}`;
        
        response = await fetch(url).then((res) => res.json());
      }

      const { presentData = [], absentData = [] } = response;

      // Combine presentData and absentData
      const combinedData = [
        ...presentData.map((record) => ({ ...record, statusType: 'Present' })),
        ...absentData.map((record) => ({
          ...record,
          statusType: 'Absent',
          loginTime: null,
          logoutTime: null,
          breakIn: null,
          breakOut: null,
          breakMinutes: null,
          minutes: null,
          status: 'Absent',
          ip: null,
          logoutIP: null
        }))
      ];

      setAttendanceRecords(combinedData);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      setAttendanceRecords([]); // Set to empty on error
    }
  };

  return (
    <>
      <Box sx={{ padding: { xs: 2, sm: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Attendance for Employee ID: {empID}
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item>
            <Button variant="contained" onClick={() => setPeriod('last7')} sx={{ marginRight: 1 }}>
              Last 7 Days
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => setPeriod('lastMonth')} sx={{ marginRight: 1 }}>
              Last Month
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => setPeriod('last365')} sx={{ marginRight: 1 }}>
              Last 365 Days
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => setPeriod('dateRange')} sx={{ marginRight: 1 }}>
              Date Range
            </Button>
          </Grid>
          {period === 'dateRange' && (
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="From Date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="To Date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          )}
          <Grid item sx={{ marginLeft: 'auto' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/layout/attendance-manager/manage-attendance')}
            >
              Back to Report
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f2f2f2' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Shift</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Login Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Break In</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Break Out</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Break Minutes</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Logout Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Minutes</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Login IP</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Logout IP</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.todaysDate}</TableCell>
                  <TableCell>{record.shift}</TableCell>
                  <TableCell>{record.loginTime || 'N/A'}</TableCell>
                  <TableCell>{record.breakIn || 'N/A'}</TableCell>
                  <TableCell>{record.breakOut || 'N/A'}</TableCell>
                  <TableCell  sx={{ fontWeight: 'bold' }}>{record.breakMinutes || 'N/A'}</TableCell>
                  <TableCell>{record.logoutTime || 'N/A'}</TableCell>
                  <TableCell  sx={{ fontWeight: 'bold' }}>{record.minutes || 'N/A'}</TableCell>
                  <TableCell>{record.ip || 'N/A'}</TableCell>
                  <TableCell>{record.logoutIP || 'N/A'}</TableCell>
                  <TableCell sx={{ color: record.status === 'Late' ? 'Orange' : record.status === 'On time' ? 'green' : record.status === 'Absent' ? 'red' :'black', fontWeight: 'bold' }}>
                    {record.statusType === 'Absent' ? 'Absent' : record.status}
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

export default ViewAttendance;
