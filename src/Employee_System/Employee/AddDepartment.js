// import React, { useState, useEffect } from 'react';
// import { 
//   Container, 
//   TextField, 
//   Button, 
//   Box, 
//   Typography, 
//   Grid, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Paper, 
//   IconButton, 
//   Dialog, 
//   DialogActions, 
//   DialogContent, 
//   DialogContentText 
// } from '@mui/material';
// import { Edit, Delete, Info } from '@mui/icons-material';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
// import { styled } from '@mui/system';

// const Department = () => {
//   // State for department addition
//   const [department, setDepartment] = useState('');
//   const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

//   // State for managing departments
//   const [departments, setDepartments] = useState([]);
//   const [openInfoDialog, setOpenInfoDialog] = useState(false);
//   const [openEditDialog, setOpenEditDialog] = useState(false);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [currentDepartment, setCurrentDepartment] = useState(null);
//   const [updatedDepartmentName, setUpdatedDepartmentName] = useState('');
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch departments
//   useEffect(() => {
//     fetchDepartments();
//   }, [institutecode]);

//   // Function to fetch departments
//   const fetchDepartments = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`);
//       setDepartments(response.data);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       toast.error('Failed to fetch departments');
//     }
//   };

//   // Handle change in input fields
//   const handleChange = (event) => {
//     setDepartment(event.target.value);
//   };

//   // Submit handler for adding department
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`http://localhost:8082/departments/addDepartment?institutecode=${institutecode}`, { department });
//       toast.success('Department added successfully');
//       setDepartment(''); // Reset the form
//       fetchDepartments(); // Refresh the list
//     } catch (error) {
//       toast.error('Failed to add department');
//     }
//   };

//   // Handlers for dialogs
//   const handleInfoClick = (department) => {
//     setCurrentDepartment(department);
//     setOpenInfoDialog(true);
//   };

//   const handleEditClick = (department) => {
//     setCurrentDepartment(department);
//     setUpdatedDepartmentName(department.department);
//     setOpenEditDialog(true);
//   };

//   const handleDeleteClick = (department) => {
//     setCurrentDepartment(department);
//     setOpenDeleteDialog(true);
//   };

//   const handleEditSubmit = async () => {
//     try {
//       await axios.put(`http://localhost:8082/departments/updateDepartment/${currentDepartment.id}`, { department: updatedDepartmentName });
//       toast.success('Department updated successfully');
//       setOpenEditDialog(false); // Close dialog
//       fetchDepartments(); // Refresh the departments list
//     } catch (error) {
//       toast.error('Failed to update department');
//     }
//   };

//   const handleDeleteSubmit = async () => {
//     try {
//       await axios.delete(`http://localhost:8082/departments/deleteDepartment/${currentDepartment.id}`);
//       toast.success('Department deleted successfully');
//       setOpenDeleteDialog(false); // Close dialog
//       fetchDepartments(); // Refresh the departments list
//     } catch (error) {
//       toast.error('Failed to delete department');
//     }
//   };

//   // Handle search input change
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Filter departments based on search term
//   const filteredDepartments = departments.filter((department) =>
//     department.department.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       {/* Add Department Section */}
//       <Typography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: 'bold',
//           color: '#fff',
//           textAlign: 'center',
//           backgroundColor: '#24A0ED',
//           borderRadius: '150px',
//           padding: '10px',
//         }}
//       >
//         Add Department
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Typography
//             variant="h6"
//             gutterBottom
//             sx={{ marginTop: 3, whiteSpace: "nowrap" }}
//           >
//             Total Departments: {departments.length}
//           </Typography>{" "}
//           <Grid item xs={12} sm={1.6}>
//             <TextField
//               label="Search Department"
//               variant="outlined"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               required
//               fullWidth
//               label="Department Name"
//               name="department"
//               value={department}
//               onChange={handleChange}
//               variant="outlined"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <Box display="flex" justifyContent="center">
//               <Button type="submit" variant="contained" color="primary">
//                 Submit
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </form>

//       {/* Manage Departments Section */}
//       <TableContainer component={Paper} sx={{ marginTop: '30px' }}>
//         <Table>
//           <TableHead sx={{ background: '#f2f2f2' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold' }}>Department ID</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Department Name</TableCell>
//               <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredDepartments.map((department) => (
//               <TableRow key={department.id}>
//                 <TableCell>{department.id}</TableCell>
//                 <TableCell>{department.department}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleInfoClick(department)} sx={{ color: 'green' }}>
//                     <Info />
//                   </IconButton>
//                   <IconButton onClick={() => handleEditClick(department)} sx={{ color: 'blue' }}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDeleteClick(department)} sx={{ color: 'red' }}>
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Info Dialog */}
//       <Dialog open={openInfoDialog} onClose={() => setOpenInfoDialog(false)} maxWidth="sm" fullWidth>
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{
//             fontWeight: 'bold',
//             color: '#fff',
//             textAlign: 'center',
//             backgroundColor: '#24A0ED',
//             borderRadius: '150px',
//             padding: '10px',
//             margin: '10px auto -2px',
//             width: '50%',
//           }}
//         >
//           Department Information
//         </Typography>
//         <DialogContent>
//           <DialogContentText sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography fontWeight={'bold'}>Department ID:</Typography> {currentDepartment?.id}
//           </DialogContentText>
//           <DialogContentText sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography fontWeight={'bold'}>Department Name:</Typography> {currentDepartment?.department}
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenInfoDialog(false)}>Close</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Dialog */}
//       <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{
//             fontWeight: 'bold',
//             color: '#fff',
//             textAlign: 'center',
//             backgroundColor: '#24A0ED',
//             borderRadius: '150px',
//             padding: '10px',
//             margin: '10px auto -2px',
//             width: '50%',
//           }}
//         >
//           Edit Department
//         </Typography>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Department Name"
//             fullWidth
//             value={updatedDepartmentName}
//             onChange={(e) => setUpdatedDepartmentName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
//           <Button onClick={handleEditSubmit} variant="contained" color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Dialog */}
//       <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{
//             fontWeight: 'bold',
//             color: '#fff',
//             textAlign: 'center',
//             backgroundColor: '#24A0ED',
//             borderRadius: '150px',
//             padding: '10px',
//             margin: '10px auto -2px',
//             width: '50%',
//           }}
//         >
//           Delete Department
//         </Typography>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete the department <strong>{currentDepartment?.department}</strong>?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
//           <Button onClick={handleDeleteSubmit} variant="contained" color="error">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <ToastContainer />
//     </>
//   );
// };

// export default Department;


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
import { Edit, Delete, Info } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { styled } from '@mui/system';

const Department = () => {
  const [department, setDepartment] = useState('');
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');
  const [departments, setDepartments] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [updatedDepartmentName, setUpdatedDepartmentName] = useState('');
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
      toast.error('Failed to fetch departments');
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
      toast.success('Department added successfully');
      setOpenAddDialog(false);
      setDepartment('');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to add department');
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:8082/departments/updateDepartment/${currentDepartment.id}`, { department: updatedDepartmentName });
      toast.success('Department updated successfully');
      setOpenEditDialog(false);
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to update department');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`http://localhost:8082/departments/deleteDepartment/${currentDepartment.id}`);
      toast.success('Department deleted successfully');
      setOpenDeleteDialog(false);
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
          backgroundColor: '#24A0ED',
          borderRadius: '150px',
          padding: '10px',
        }}
      >
        Manage Departments
      </Typography>

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
          Add 
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
                  <Button
                  size="small"
                   variant="contained"
                   color="primary" onClick={() => {
                    setCurrentDepartment(department);
                    setUpdatedDepartmentName(department.department);
                    setOpenEditDialog(true);
                  }}
                  sx={{ marginRight: "10px" }}>
                    Update
                  </Button>
                  <Button  size="small"
                        variant="contained" color="error" onClick={() => {
                    setCurrentDepartment(department);
                    setOpenDeleteDialog(true);
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

      {/* Edit Department Dialog */}
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
        
      </Dialog>

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
