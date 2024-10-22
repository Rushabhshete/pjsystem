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
      const response = await axios.get(`http://localhost:8082/byDateRange`, {
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
      
      <Box sx={{ padding: { xs: 2, sm: 4 } }}>
        <Grid container spacing={2}  className='textField-root'>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
             
              size='small'
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              size='small'
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
              size='small'
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

        <TableContainer  sx={{ marginTop: 2 }}>
          <Table className='table-root'>
            <TableHead >
              <TableRow>
                <TableCell >EmpID</TableCell>
                <TableCell >Name</TableCell>
                <TableCell >Mobile Number</TableCell>
                <TableCell >Email Id</TableCell>
                <TableCell >Joining Date</TableCell>
                <TableCell >Actions</TableCell>
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
                 
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate(`/layout/attendance-manager/View-attendance/${employee.empID}`)}
                        >
                          View
                        </Button>
                    
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
