import React, { useState, useEffect } from 'react';
import { 
  getAllEmployees, 
  getPresentEmployeeCount, 
  getAbsentEmployeeCount,
  getTotalEmployeeCount
} from '../Employee_System/Attendance/attendanceService';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const AttenDash = () => {
  const [employees, setEmployees] = useState([]);
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);  // State to store total employee count
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [totalEmployee, setTotalEmployee] = useState('0');
  const [paidEmployees, setPaidEmployees] = useState(null);
  const [pendingEmployees, setPendingEmployees] = useState(null);

  useEffect(() => {
    if (selectedYear) {
      if (selectedMonth) {
        fetchEmployeesByMonthYear(selectedMonth, selectedYear);
      } else {
        fetchTotalEmployeesByYear(selectedYear);
      }
    }
  }, [selectedMonth, selectedYear]);

  const fetchEmployeesByMonthYear = async (month, year) => {
    try {
      const [totalEmployeeResponse, paidEmployeesResponse, pendingEmployeesResponse] = await Promise.all([
        axios.get('http://localhost:8082/salaries/salarycountbymonthyear', { params: { month, year, institutecode } }),
        axios.get('http://localhost:8082/salaries/Paidcountbyyearmonth', { params: { month, year , institutecode} }),
        axios.get('http://localhost:8082/salaries/Pendingcountbyyearmonth', { params: { month, year, institutecode } }),
      ]);
      setTotalEmployee(totalEmployeeResponse.data);
      setPaidEmployees(paidEmployeesResponse.data);
      setPendingEmployees(pendingEmployeesResponse.data);
    } catch (error) {
      console.error('Error fetching data by month/year:', error);
    }
  };

  const fetchTotalEmployeesByYear = async (year) => {
    try {
      const response = await axios.get('http://localhost:8082/salaries/salarycountbyyear', { params: { year, institutecode } });
      setTotalEmployee(response.data);
      setPaidEmployees(null);
      setPendingEmployees(null);
    } catch (error) {
      console.error('Error fetching total employees by year:', error);
    }
  };

  useEffect(() => {
    fetchInitialData();
    fetchEmployeeCounts();
  }, []);

  const fetchInitialData = async () => {
    try {
      const allEmployees = await getAllEmployees();
      setEmployees(allEmployees);
    } catch (error) {
      console.error("Error fetching initial data:", error);
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

  return (
    <>
      <Container>
        <Grid container spacing={4}>
          {/* Attendance Section */}
          <Grid item xs={12} md={6}>
          <Box
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
    }}
  >
    <Box
      sx={{
        flexGrow: 1,
        height: "3px",
        backgroundColor: "#0D47A1",
      }}
    />
    <Typography variant="h6" sx={{ margin: "0 10px" }}>
      <b>Attendance</b>
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        height: "3px",
        backgroundColor: "#0D47A1",
      }}
    />
  </Box>
            <Grid container spacing={2} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: '#F9E79F', borderRadius: "10px" }}>
                  <CardContent>
                    <Typography variant="h7" component="div">
                      Total Employee
                    </Typography>
                    <Typography variant="h5" component="div">
                      {totalEmployeeCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: '#FF6F61',  borderRadius: '10px' }}>
                  <CardContent>
                    <Typography variant="h7" component="div">
                      Present
                    </Typography>
                    <Typography variant="h5" component="div">
                      {presentCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ backgroundColor: '#3498DB',  borderRadius: '10px' }}>
                  <CardContent>
                    <Typography variant="h7" component="div">
                      Absent
                    </Typography>
                    <Typography variant="h5" component="div">
                      {absentCount}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Salary Section */}
          <Grid item xs={12} md={6}>
          <Box
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
    }}
  >
    <Box
      sx={{
        flexGrow: 1,
        height: "3px",
        backgroundColor: "#0D47A1",
      }}
    />
    <Typography variant="h6" sx={{ margin: "0 10px" }}>
      <b>Salary</b>
    </Typography>
    <Box
      sx={{
        flexGrow: 1,
        height: "3px",
        backgroundColor: "#0D47A1",
      }}
    />
  </Box>
            <Grid container spacing={2} sx={{ marginBottom: 3 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '19px', backgroundColor: '#F9E79F', borderRadius: '10px' }}>
                  <Typography variant="h6">Total Salaries:</Typography>
                  <Typography variant="h5">{totalEmployee !== null ? totalEmployee : 0}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '19px', backgroundColor: '#FF6F61', borderRadius: '10px' }}>
                  <Typography variant="h6">Paid Salary:</Typography>
                  <Typography variant="h5">{paidEmployees !== null ? paidEmployees : 0}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} style={{ padding: '18px', backgroundColor: '#F9E79F', borderRadius: '10px' }}>
                  <Typography variant="h7">Pending Salary:</Typography>
                  <Typography variant="h5">{pendingEmployees !== null ? pendingEmployees : 0}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AttenDash;
