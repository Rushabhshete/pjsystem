import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  MenuItem,
  Select,
  InputLabel,
  Box,
  Container,
  TableContainer,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { styled } from '@mui/system';

const EmpDetails = ({ empID }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

  const id = useParams();

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchCategoryNames();
  }, [institutecode]);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:8082/getAllemp?institutecode=${institutecode}`);
  //     const formattedUsers = response.data.map(user => ({
  //       empID: user.empID,
  //       fullName: user.fullName,
  //       email: user.email,
  //       employeecategory: user.employeecategory,
  //       department: user.department,
  //       salary: user.salary
  //     }));
  //     setUsers(formattedUsers);
  //     setFilteredUsers(formattedUsers);
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   }
  // };

  const fetchUsers = async () => {
    const status = 'Joined'; // Set the desired status
    try {
        const response = await axios.get(`http://localhost:8082/employees/status/${status}?institutecode=${institutecode}`);
        const formattedUsers = response.data.map(user => ({
            empID: user.empID,
            fullName: user.fullName,
            email: user.email,
            employeecategory: user.employeecategory,
            department: user.department,
            salary: user.salary
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


  const fetchAllEmployees = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/getAllemp?institutecode=${institutecode}`);
      const formattedUsers = response.data.map(user => ({
        empID: user.empID,
        fullName: user.fullName,
        email: user.email,
        employeecategory: user.employeecategory,
        department: user.department,
        salary: user.salary
      }));
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers); // Update filteredUsers as well
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleSearch = async (empID) => {
    try {
      const response = await axios.get(`http://localhost:8082/empById/${empID}`);
      const usersData = Array.isArray(response.data) ? response.data : [response.data];
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      setFilteredUsers([]);
    }
  };

  const [error, setError] = useState(null);

  const handleCategoryChange = async (e) => {
    const { value } = e.target;
    setSearchCategory(value.trim());
    filterUsers(searchDepartment, value.trim());
  };

  const handleShowInfo = (user) => {
    setSelectedUser(user);
    setShowInfoModal(true);
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value.trim());
    if (value.trim() === '') {
      setFilteredUsers(users);
    } else {
      handleSearch(value.trim());
    }
  };

  const handleNameSearch = (e) => {
    const { value } = e.target;
    setSearchName(value.trim());
    if (value.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.fullName.toLowerCase().includes(value.trim().toLowerCase()));
      setFilteredUsers(filtered);
    }
  };

  const handleDepartmentChange = async (e) => {
    const { value } = e.target;
    setSearchDepartment(value.trim());
    filterUsers(value.trim(), searchCategory);
  };

  const filterUsers = (department, category) => {
    let filtered = users;
    if (department) {
      filtered = filtered.filter(user => user.department === department);
    }
    if (category) {
      filtered = filtered.filter(user => user.employeecategory === category);
    }
    setFilteredUsers(filtered);
  };

  const handleDownloadCsv = () => {
    const csvData = filteredUsers.map((user) => ({
      'Emp Id': user.empID,
      'Emp Name': user.fullName,
      Email: user.email,
      Category: user.categoryName,
      'Basic Salary': user.salary,
    }));

    const csvContent = [
      ['Emp Id', 'Emp Name', 'Email', 'Category', 'Basic Salary'],
      ...csvData.map((row) => Object.values(row)),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [categoryNames, setCategoryNames] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategoryNames = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/categories/all?institutecode=${institutecode}`);
      setCategoryNames(response.data.map(category => category.categoryName));
    } catch (error) {
      console.error('Error fetching category names:', error);
      setError('Failed to fetch category names');
    }
  };

  const handleCategorySelectChange = (event) => {
    setSelectedCategoryName(event.target.value);
    filterUsers(searchDepartment, event.target.value);
  };

  const fetchSalaryByCategoryName = async (categoryName) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8082/salaries/byCategoryName/${categoryName}&institutecode=${institutecode}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching salary by Category Name:', error);
      setError('Failed to fetch salary by Category Name');
    } finally {
      setLoading(false);
    }
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
    <div>
      <Box mt={4}>
      {/* <PopTypography
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
      Employee Details 
      </PopTypography> */}
      
      <Grid container spacing={2} alignItems="center" marginTop={0}>
    <Grid item xs={12} sm={6} md={3}>
        <TextField
            size="small"
            variant="outlined"
            placeholder="Search By Id"
            value={searchTerm}
            onChange={handleInputChange}
            fullWidth
        />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
        <TextField
            size="small"
            variant="outlined"
            placeholder="Search By Name"
            value={searchName}
            onChange={handleNameSearch}
            fullWidth
        />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
        <TextField
            select
            label="Select Department"
            value={searchDepartment}
            onChange={handleDepartmentChange}
            fullWidth
            size="small"
            variant="outlined"
        >
            <MenuItem value="">
                <em>All</em>
            </MenuItem>
            {departments.map((department) => (
                <MenuItem key={department} value={department.department}>
                    {department.department}
                </MenuItem>
            ))}
        </TextField>
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
        <TextField
            select
            label="Select Category"
            value={selectedCategoryName}
            onChange={handleCategorySelectChange}
            fullWidth
            size="small"
            variant="outlined"
        >
            <MenuItem value="">
                <em>All</em>
            </MenuItem>
            {categoryNames.map((categoryName) => (
                <MenuItem key={categoryName} value={categoryName}>
                    {categoryName}
                </MenuItem>
            ))}
        </TextField>
    </Grid>
</Grid>

<Grid container spacing={1} alignItems="left" mt={2}>
    <Grid item xs={12} sm={6} md={3}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadCsv}
            fullWidth
        >
            Download CSV
        </Button>
    </Grid>
    <Grid item xs={12} sm={6} md={9}>
        <Typography variant="h6" align="right" padding={'5px'} >
            Total Employees: {filteredUsers.length}
        </Typography>
    </Grid>
</Grid>


      
    </Box>
      <Box mt={4}>
        <TableContainer >
          <Table size="small">
            <TableHead sx={{backgroundColor:"#f2f2f2"}}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Salary</strong></TableCell>
                <TableCell><strong>Add Salary</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.empID}>
                  <TableCell>{user.empID}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.employeecategory}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>{user.salary}</TableCell>
                  <TableCell>
                    <Link className="btn btn-outline-primary mx-2" to={`/layout/employee-salary-manager/add-salary/${user.empID}`}>
                      Add
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

       
      </Box>
      <Modal open={showInfoModal} onClose={handleCloseInfoModal}>
        <Box className="modal" p={2} sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
          <Typography variant="h6" mb={2}>
            Employee Details
          </Typography>
          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Employee ID: {selectedUser.empID}</Typography>
                <Typography>Name: {selectedUser.fullName}</Typography>
                <Typography>Email: {selectedUser.email}</Typography>
                <Typography>Category: {selectedUser.employeecategory}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Department: {selectedUser.department}</Typography>
                <Typography>Salary: {selectedUser.salary}</Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default EmpDetails;