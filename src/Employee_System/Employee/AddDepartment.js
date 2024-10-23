import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

const Department = () => {
  const [department, setDepartment] = useState('');
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');
  const [departments, setDepartments] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  // const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  // const [updatedDepartmentName, setUpdatedDepartmentName] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, [institutecode]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      MySwal.fire("Error","Failed to Fetch Department","error");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = async () => {
    try {
      await axios.post(`http://localhost:8082/departments/addDepartment?institutecode=${institutecode}`, { department });
      MySwal.fire("Success", "Department Added Successfully", "success");
      setOpenAddDialog(false);
      setDepartment('');
      fetchDepartments();
    } catch (error) {
      MySwal.fire("Error","Failed to add department","error");
    }
  };

  // const handleEditSubmit = async () => {
  //   try {
  //     await axios.put(`http://localhost:8082/departments/updateDepartment/${currentDepartment.id}`, { department: updatedDepartmentName });
  //     toast.success('Department updated successfully');
  //     setOpenEditDialog(false);
  //     fetchDepartments();
  //   } catch (error) {
  //     toast.error('Failed to update department');
  //   }
  // };

  const handleDeleteSubmit = async (id) => {
    const { isConfirmed } = await MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (isConfirmed) {
    try {
      await axios.delete(`http://localhost:8082/departments/deleteDepartment/${id}`);
      MySwal.fire("Success", "Department Deleted Successfully", "success");
      setOpenDeleteDialog(false);
      fetchDepartments();
    } catch (error) {
      MySwal.fire("Error","Failed to delete department","error");
    }
  }
  };

  return (
    <>
      <Grid container spacing={2} className="textField-root">
      <Typography variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}>
        Total Departments: {filteredDepartments.length}
      </Typography>

      <Grid item xs={12} sm={1.6}>
      <TextField
        label="Search Department"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        sx={{ marginBottom: '20px' }}
      />
      </Grid>

      <Grid item xs={12} sm={2}>
      <Button  onClick={() => setOpenAddDialog(true)}
          variant="contained"
          color="primary"
          sx={{ marginTop: 1 }}>
          ADD DEPARTMENT
        </Button>
      </Grid>
      </Grid>



      <TableContainer sx={{ width: "100%" }}>
        <Table size="small" aria-label="exam table" sx={{ width: "100%" }}>
          <TableHead sx={{ background: '#f2f2f2' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Department Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.id}</TableCell>
                <TableCell>{department.department}</TableCell>
                <TableCell>
                  {/* <Button
                  size="small"
                   variant="contained"
                   color="primary" onClick={() => {
                    setCurrentDepartment(department);
                    setUpdatedDepartmentName(department.department);
                    setOpenEditDialog(true);
                  }}
                  sx={{ marginRight: "10px" }}>
                    Update
                  </Button> */}
                  <Button  size="small"
                        variant="contained" color="error" onClick={() => {
                          handleDeleteSubmit(department.id);
                  }} >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Department Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>
          AddDepartment.
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
              Add new exam.
            </DialogContentText>
            <Grid item className="textField-root"> 
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          </Grid>
        
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleAddSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
      <DialogTitle>Update Department</DialogTitle>
        <DialogContent>
        <DialogContentText>
              Update the details of the department.
            </DialogContentText>
            <Grid item className="textField-root">
            <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
             variant="outlined"
            value={updatedDepartmentName}
            onChange={(e) => setUpdatedDepartmentName(e.target.value)}
          />
            </Grid>
         
            <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleEditSubmit}  color="primary">
            Update
          </Button>
        </DialogActions>
        </DialogContent>
        
      </Dialog> */}

      {/* Delete Department Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
      <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this Department?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this Department cannot be recovered
      </Typography>
    </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}  color="primary">Cancel</Button>
          <Button onClick={handleDeleteSubmit}color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default Department;
