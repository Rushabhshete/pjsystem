import React, { useState, useEffect } from 'react';
import { getAllEmployees, deleteEmployee } from '../Attendance/attendanceService';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ManageAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  const handleDelete = async (employee) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this employee?');
      if (confirmed) {
        await deleteEmployee(employee);
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      (employee.empID && employee.empID.toString().includes(searchQuery)) ||
      (employee.fullName && employee.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (employee.joiningDate && employee.joiningDate.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Search..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ marginBottom: 2 }}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead sx={{backgroundColor:'#f2f2f2'}}>
            <TableRow>
              <TableCell sx={{fontWeight:'bold'}}>Employee ID</TableCell>
              <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
              <TableCell sx={{fontWeight:'bold'}}>Mobile Number</TableCell>
              <TableCell sx={{fontWeight:'bold'}}>Email Id</TableCell>
              <TableCell sx={{fontWeight:'bold'}}>Joining Date</TableCell>
              <TableCell sx={{fontWeight:'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.empID}>
                <TableCell>{employee.empID}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.mobileNo}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.joiningDate}</TableCell>
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
                    <Grid item>
                      {/* <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(employee.empID)}
                      >
                        Delete
                      </Button> */}
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageAttendance;