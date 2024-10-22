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
      <Box  textAlign="center">
        <Typography variant="h4" gutterBottom>
          Attendance for Employee ID: {empID}
        </Typography>
        <Grid container spacing={1} sx={{ marginBottom: 2 }} className='textField-root'>
          <Grid item xs={12} md={1.7}>
            <Button variant="contained" onClick={() => setPeriod('last7')} >
              Last 7 Days
            </Button>
          </Grid>
          <Grid item xs={12} md={1.7}>
            <Button variant="contained" onClick={() => setPeriod('lastMonth')} >
              Last Month
            </Button>
          </Grid>
          <Grid item xs={12} md={1.7}>
            <Button variant="contained" onClick={() => setPeriod('last365')} >
              Last 365 Days
            </Button>
          </Grid>
          <Grid item xs={12} md={1.7}>
            <Button variant="contained" onClick={() => setPeriod('dateRange')} >
              Date Range
            </Button>
          </Grid>
          {period === 'dateRange' && (<>
              <Grid item xs={12} md={1.7}>
                <TextField
                  label="From Date"
                  type="date"
                  size='small'
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={1.7}>
                <TextField
                  label="To Date"
                  type="date"
                  size='small'
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              </>
          )}
          <Grid item xs={12} md={1.7}>
            <Button
              variant="contained"
              onClick={() => navigate('/layout/attendance-manager/manage-attendance')}
            >
              Back to Report
            </Button>
          </Grid>
        </Grid>
        <TableContainer  sx={{ marginTop: 2 }}>
          <Table className='table-root'>
            <TableHead >
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Login Time</TableCell>
                <TableCell>Break In</TableCell>
                <TableCell>Break Out</TableCell>
                <TableCell>Break Minutes</TableCell>
                <TableCell>Logout Time</TableCell>
                <TableCell>Minutes</TableCell>
                <TableCell>Login IP</TableCell>
                <TableCell>Logout IP</TableCell>
                <TableCell>Status</TableCell>
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
