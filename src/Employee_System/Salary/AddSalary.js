import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Box, MenuItem, Snackbar, SnackbarContent } from '@mui/material';
import { styled } from '@mui/system';

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const yearsAhead = 5;
const yearsBehind = 5;

const currentYear = new Date().getFullYear();
const years = Array.from(new Array(yearsAhead + yearsBehind + 1), (val, index) => currentYear - yearsBehind + index);

export default function AddSalary() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

  const navigate = useNavigate();
  const { empID } = useParams();

  const [employee, setEmployee] = useState({
    institutecode:'',
    fullName: '',
    salary: '',
    department: '',
    employeecategory: '',
    transactionId: '',
  });

  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const { fullName, salary, department, employeecategory } = employee;

  const onInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const onDateChange = (e) => {
    setDate(e.target.value);
  };

  const onMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const onYearChange = (e) => {
    setYear(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Construct paymentDate in YYYY-MM-DD format
    const paymentDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    try {
      // Add salary for the employee using axios POST request
      await axios.post(`http://localhost:8082/salaries/add`, {
        empID: empID,
        basicSalary: parseInt(salary), // Convert salary to integer if needed
        paymentDate: paymentDate,
        month: parseInt(month), // Convert month to integer if needed
        year: parseInt(year), // Convert year to integer if needed
        fullName: fullName,
        department: department,
        employeecategory: employeecategory,
        transactionId: employee.transactionId,
      });

      // Show success message and navigate to SalaryList after 2 seconds
      setSnackbarMessage('Salary added successfully!');
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/layout/employee-salary-manager/salary-list');
      }, 2000);
    } catch (error) {
      console.error('Error adding salary:', error);
    }
  };

  useEffect(() => {
    const loadEmployee = async () => {
      if (!empID) {
        console.error('Employee ID is undefined.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8082/empById/${empID}`);
        const fetchedEmployee = response.data;
        setEmployee({
          fullName: fetchedEmployee.fullName,
          salary: fetchedEmployee.salary,
          department: fetchedEmployee.department,
          employeecategory: fetchedEmployee.employeecategory,
          transactionId: fetchedEmployee.transactionId,
        });
      } catch (error) {
        console.error('There was an error fetching the employee!', error);
      }
    };

    loadEmployee();
  }, [empID], [institutecode]);

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
    <Grid container justifyContent="center">
      <Grid item xs={10} md={6}>
        <Box mt={4}>
          <form onSubmit={onSubmit} mt={2}>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12}>
                <TextField
                  id="empID"
                  name="empID"
                  label="Emp ID"
                  fullWidth
                  variant="outlined"
                  value={empID}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="fullName"
                  name="fullName"
                  label="Emp Name"
                  fullWidth
                  variant="outlined"
                  value={fullName}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="salary"
                  name="salary"
                  label="Basic Salary"
                  fullWidth
                  variant="outlined"
                  value={salary}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="department"
                  name="department"
                  label="Department"
                  fullWidth
                  variant="outlined"
                  value={department}
                  InputProps={{
                    readOnly: true,
                  }}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="employeecategory"
                  name="employeecategory"
                  label="Employee Category"
                  fullWidth
                  variant="outlined"
                  value={employeecategory}
                  InputProps={{
                    readOnly: true,
                  }}
                  onChange={onInputChange}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="date"
                  name="date"
                  label="Date"
                  type="number"
                  fullWidth
                  value={date}
                  onChange={onDateChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="month"
                  name="month"
                  label="Month"
                  select
                  fullWidth
                  value={month}
                  onChange={onMonthChange}
                  variant="outlined"
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="year"
                  name="year"
                  label="Year"
                  select
                  fullWidth
                  value={year}
                  onChange={onYearChange}
                  variant="outlined"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="secondary" component={Link} to="/layout/Salarytable">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginLeft: '10px' }}
                >
                  Add Salary
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Adjust duration as needed
        onClose={() => setOpenSnackbar(false)}
      >
        <SnackbarContent
          message={snackbarMessage}
          sx={{
            backgroundColor: '#43a047', // Light green background
            color: '#fff', // White text color
            fontWeight: 'bold',
          }}
        />
      </Snackbar>
    </Grid>
  );
}
