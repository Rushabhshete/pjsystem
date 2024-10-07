// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   TextField,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Snackbar,
//   Grid,
//   MenuItem,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import MuiAlert from "@mui/material/Alert";
// import Calendar from 'react-awesome-calendar';  // Import the calendar

// const Alert = React.forwardRef((props, ref) => (
//   <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
// ));

// const AlertDialog = ({ open, onClose, onConfirm }) => (
//   <Dialog open={open} onClose={onClose}>
//     <DialogTitle color="blue" textAlign={"center"}>
//       Confirm Deletion
//     </DialogTitle>
//     <DialogContent>
//       <Typography>Are you sure you want to delete this Holiday?</Typography>
//       <Typography color="red" fontWeight={200} variant="body2">
//         *On clicking Confirm, this Holiday cannot be recovered.
//       </Typography>
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={onClose} color="primary">
//         Cancel
//       </Button>
//       <Button
//         onClick={() => {
//           onConfirm();
//           onClose();
//         }}
//         color="primary"
//       >
//         Confirm
//       </Button>
//     </DialogActions>
//   </Dialog>
// );

// const ManageHoliday = () => {
//   // State Variables
//   const [open, setOpen] = useState(false);
//   const [holidayName, setNewUser] = useState("");
//   const [date, setDate] = useState("");
//   const [day, setDay] = useState("");
//   const [Users, setUsers] = useState([]);
//   const [error, setError] = useState("");
//   const [editOpen, setEditOpen] = useState(false);
//   const [editUser, setEditUser] = useState({ id: null, holidayName: "", date: "", day: "" });
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [userIdToDelete, setUserIdToDelete] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//   const getInstituteCode = () => localStorage.getItem("institutecode");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
//         );
//         const result = await response.json();
//         setUsers(result);
//       } catch (error) {
//         console.error("Error fetching Users: ", error);
//       }
//     };

//     fetchUsers();
//   }, [getInstituteCode()]);

//   useEffect(() => {
//     if (searchTerm === "") {
//       setFilteredUsers(Users);
//     } else {
//       setFilteredUsers(
//         Users.filter((user) =>
//           user.holidayName.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }
//   }, [searchTerm, Users]);

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setError(""); 
//     setDate(""); // Clear the date
//     setDay(""); // Clear the day
//   };

//   const handleChange = (event) => {
//     setNewUser(event.target.value);
//   };

//   const handleDateChange = (event) => {
//     setDate(event.target.value);
//   };

//   const handleDayChange = (event) => {
//     setDay(event.target.value);
//   };

//   const handleSubmit = async () => {
//     const getInstituteCode = () => localStorage.getItem("institutecode");
    
//     if (holidayName.trim() === "") {
//       setError("User name cannot be empty");
//     } else if (!date) {
//       setError("Date cannot be empty");
//     } else if (!day) {
//       setError("Day cannot be empty");
//     } else if (Users.map((u) => u.holidayName).includes(holidayName.trim())) {
//       setError("User already exists");
//     } else {
//       try {
//         const response = await fetch(
//           `http://localhost:8082/addHoliday?institutecode=${getInstituteCode()}`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ 
//               holidayName: holidayName.trim(),
//               date: date,
//               day: day
//             }),
//           }
//         );
  
//         if (response.ok) {
//           setSnackbarMessage("User added successfully");
//           setSnackbarOpen(true);

//           const updatedResponse = await fetch(
//             `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
//           );
//           const updatedUser = await updatedResponse.json();
//           setUsers(updatedUser);
//           setNewUser("");
//           setDate("");
//           setDay("");
//           setError("");
//           handleClose();
//         } else {
//           setError("Failed to add holidayName");
//         }
//       } catch (error) {
//         console.error("Error adding holidayName: ", error);
//         setError("Failed to add holidayName");
//       }
//     }
//   };

//   const handleEditClickOpen = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8082/getHolidayById/${id}`);
//       const result = await response.json();
//       setEditUser(result);
//       setEditOpen(true);
//     } catch (error) {
//       console.error("Error fetching user details: ", error);
//     }
//   };

//   const handleEditClose = () => {
//     setEditOpen(false);
//     setEditUser({ id: null, holidayName: "", date: "", day: "" });
//     setError("");
//   };

//   const handleEditChange = (event) => {
//     setEditUser({ ...editUser, holidayName: event.target.value });
//   };

//   const handleEditDateChange = (event) => {
//     setEditUser({ ...editUser, date: event.target.value });
//   };

//   const handleEditDayChange = (event) => {
//     setEditUser({ ...editUser, day: event.target.value });
//   };

//   const handleUpdate = async (id) => {
//     if (editUser.holidayName.trim() === "") {
//       setError("User name cannot be empty");
//     } else if (!editUser.date) {
//       setError("Date cannot be empty");
//     } else if (!editUser.day) {
//       setError("Day cannot be empty");
//     } else {
//       try {
//         const response = await fetch(
//           `http://localhost:8082/updateHoliday/${id}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               holidayName: editUser.holidayName.trim(),
//               date: editUser.date,
//               day: editUser.day,
//               institutecode: getInstituteCode(),
//             }),
//           }
//         );
//         if (response.ok) {
//           const updatedResponse = await fetch(
//             `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
//           );
//           const updatedUser = await updatedResponse.json();
//           setUsers(updatedUser);
//           setSnackbarMessage("User updated successfully");
//           setSnackbarOpen(true);
//           handleEditClose();
//         } else {
//           setError("Failed to update user");
//         }
//       } catch (error) {
//         console.error("Error updating user: ", error);
//         setError("Failed to update user");
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8082/deleteHoliday/${id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (response.ok) {
//         const updatedResponse = await fetch(
//           `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
//         );
//         const updatedUser = await updatedResponse.json();
//         setUsers(updatedUser);
//         setSnackbarMessage("User deleted successfully");
//         setSnackbarOpen(true);
//         setUserIdToDelete(null);
//       } else {
//         console.error("Failed to delete user");
//       }
//     } catch (error) {
//       console.error("Error deleting user: ", error);
//     }
//   };

//   const PopTypography = styled(Typography)`
//     @keyframes pop {
//       0% {
//         transform: scale(1);
//       }
//       50% {
//         transform: scale(1.1);
//       }
//       100% {
//         transform: scale(1);
//       }
//     }
//   `;

//   return (
//     <div>
//       <PopTypography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           color: "#fff",
//           textAlign: "center",
//           backgroundColor: "#24A0ED",
//           borderRadius: "150px",
//           padding: "10px",
//           marginBottom: "20px",
//         }}
//       >
//         Add Holiday
//       </PopTypography>
//          {/* Calendar display */}
//          <div style={{ marginTop: "20px", width:"600px"}}>
//         <Calendar
//           events={Users.map(user => ({
//             id: user.id,
//             title: user.holidayName,
//             startDate: new Date(user.date),
//             endDate: new Date(new Date(user.date).setHours(new Date(user.date).getHours() + 1)), // 1 hour events
//             color: '#24A0ED',
//           }))}
//         />
//       </div>
//       <Grid container spacing={2} className="textField-root" sx={{marginTop:'10px'}}>
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ marginTop: 3, whiteSpace: "nowrap" }}
//         >
//           Total Holiday : {Users.length}
//         </Typography>

//         <Grid item xs={12} sm={1.6}>
//           <TextField
//             label="Search Holiday"
//             variant="outlined"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//         </Grid>

//         <Grid item xs={12} sm={1.6}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleClickOpen}
//             sx={{ marginTop: 1 }}
//           >
//             Add
//           </Button>
//         </Grid>
//       </Grid>

//       <Dialog open={open} onClose={handleClose}>
//         <DialogTitle>Add New Holiday</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Holiday Name"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={holidayName}
//             onChange={handleChange}
//             error={!!error}
//             helperText={error}
//             className="textField-root"
//           />
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Holiday Date"
//             type="date"
//             fullWidth
//             variant="outlined"
//             value={date}
//             onChange={handleDateChange}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             error={!!error}
//             helperText={error}
//             className="textField-root"
//           />
//           <TextField
//             select
//             label="Holiday Day"
//             value={day}
//             onChange={handleDayChange}
//             fullWidth
//             variant="outlined"
//           >
//             {days.map((day) => (
//               <MenuItem key={day} value={day}>
//                 {day}
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} color="primary">
//             Submit
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog open={editOpen} onClose={handleEditClose}>
//         <DialogTitle>Edit User</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Holiday Name"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={editUser.holidayName}
//             onChange={handleEditChange}
//             error={!!error}
//             helperText={error}
//             className="textField-root"
//           />
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Holiday Date"
//             type="date"
//             fullWidth
//             variant="outlined"
//             value={editUser.date}
//             onChange={handleEditDateChange}
//             InputLabelProps={{
//               shrink: true,
//             }}
//             error={!!error}
//             helperText={error}
//             className="textField-root"
//           />
//           <TextField
//             select
//             label="Holiday Day"
//             value={editUser.day}
//             onChange={handleEditDayChange}
//             fullWidth
//             variant="outlined"
//           >
//             {days.map((day) => (
//               <MenuItem key={day} value={day}>
//                 {day}
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleEditClose} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={() => handleUpdate(editUser.id)} color="primary">
//             Update
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={() => setSnackbarOpen(false)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={() => setSnackbarOpen(false)} severity="success">
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>

//       <AlertDialog
//         open={confirmOpen}
//         onClose={() => setConfirmOpen(false)}
//         onConfirm={() => handleDelete(userIdToDelete)}
//       />
//       <TableContainer>
//         <Table sx={{ minWidth: 250, justifyContent: "center", marginTop: 3 }}>
//           <TableHead>
//             <TableRow>
//               <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
//                 User ID
//               </TableCell>
//               <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
//                 Holiday Name
//               </TableCell>
//               <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
//                 Holiday Date
//               </TableCell>
//               <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
//                 Holiday Day
//               </TableCell>
//               <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredUsers.map((user) => (
//               <TableRow key={user.id}>
//                 <TableCell sx={{ padding: "4px" }}>{user.id}</TableCell>
//                 <TableCell sx={{ padding: "4px" }}>{user.holidayName}</TableCell>
//                 <TableCell sx={{ padding: "4px" }}>{user.date}</TableCell>
//                 <TableCell sx={{ padding: "4px" }}>{user.day}</TableCell>
//                 <TableCell sx={{ padding: "4px" }}>
//                   <Button
//                     onClick={() => handleEditClickOpen(user.id)}
//                     color="primary"
//                     variant="contained"
//                     style={{ marginRight: "10px" }}
//                   >
//                     Update
//                   </Button>
//                   <Button
//                     onClick={() => {
//                       setUserIdToDelete(user.id);
//                       setConfirmOpen(true);
//                     }}
//                     color="error"
//                     variant="contained"
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default ManageHoliday;

import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Grid,
  Paper,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import MuiAlert from "@mui/material/Alert";
import Calendar from 'react-awesome-calendar';  // Import the calendar
import { Edit, Delete } from '@mui/icons-material'; // Import Material Icons

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const AlertDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this Holiday?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this Holiday cannot be recovered.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        color="primary"
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const ManageHoliday = () => {
  const [open, setOpen] = useState(false);
  const [holidayName, setNewUser] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [Users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState({ id: null, holidayName: "", date: "", day: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const getInstituteCode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
        );
        const result = await response.json();
        setUsers(result);
      } catch (error) {
        console.error("Error fetching Users: ", error);
      }
    };
    fetchUsers();
  }, [getInstituteCode()]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(Users);
    } else {
      setFilteredUsers(
        Users.filter((user) =>
          user.holidayName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, Users]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(""); 
    setDate(""); 
    setDay(""); 
  };

  const handleChange = (event) => {
    setNewUser(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  const handleSubmit = async () => {
    if (holidayName.trim() === "") {
      setError("User name cannot be empty");
    } else if (!date) {
      setError("Date cannot be empty");
    } else if (!day) {
      setError("Day cannot be empty");
    } else if (Users.map((u) => u.holidayName).includes(holidayName.trim())) {
      setError("User already exists");
    } else {
      try {
        const response = await fetch(
          `http://localhost:8082/addHoliday?institutecode=${getInstituteCode()}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              holidayName: holidayName.trim(),
              date: date,
              day: day
            }),
          }
        );
  
        if (response.ok) {
          setSnackbarMessage("User added successfully");
          setSnackbarOpen(true);
  
          const updatedResponse = await fetch(
            `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
          );
          const updatedUser = await updatedResponse.json();
          setUsers(updatedUser);
          setNewUser("");
          setDate("");
          setDay("");
          setError("");
          handleClose();
        } else {
          setError("Failed to add holidayName");
        }
      } catch (error) {
        console.error("Error adding holidayName: ", error);
        setError("Failed to add holidayName");
      }
    }
  };

  const handleEditClickOpen = async (id) => {
    try {
      const response = await fetch(`http://localhost:8082/getHolidayById/${id}`);
      const result = await response.json();
      setEditUser(result);
      setEditOpen(true);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditUser({ id: null, holidayName: "", date: "", day: "" });
    setError("");
  };

  const handleEditChange = (event) => {
    setEditUser({ ...editUser, holidayName: event.target.value });
  };

  const handleEditDateChange = (event) => {
    setEditUser({ ...editUser, date: event.target.value });
  };

  const handleEditDayChange = (event) => {
    setEditUser({ ...editUser, day: event.target.value });
  };

  const handleUpdate = async (id) => {
    if (editUser.holidayName.trim() === "") {
      setError("User name cannot be empty");
    } else if (!editUser.date) {
      setError("Date cannot be empty");
    } else if (!editUser.day) {
      setError("Day cannot be empty");
    } else {
      try {
        const response = await fetch(
          `http://localhost:8082/updateHoliday/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              holidayName: editUser.holidayName.trim(),
              date: editUser.date,
              day: editUser.day,
              institutecode: getInstituteCode(),
            }),
          }
        );
        if (response.ok) {
          const updatedResponse = await fetch(
            `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
          );
          const updatedUser = await updatedResponse.json();
          setUsers(updatedUser);
          setSnackbarMessage("User updated successfully");
          setSnackbarOpen(true);
          handleEditClose();
        } else {
          setError("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating user: ", error);
        setError("Failed to update user");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8082/deleteHoliday/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedResponse = await fetch(
          `http://localhost:8082/getAllHolidays?institutecode=${getInstituteCode()}`
        );
        const updatedUser = await updatedResponse.json();
        setUsers(updatedUser);
        setSnackbarMessage("User deleted successfully");
        setSnackbarOpen(true);
        setUserIdToDelete(null);
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
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
      <Grid container spacing={2} style={{ marginTop: "20px" }}>
  {/* Left Side - Calendar */}
  <Grid item xs={4}  >
    <Paper elevation={3} style={{padding:"20px"}}> 
      <Calendar
        events={Users.map(user => ({
          id: user.id,
          title: user.holidayName,
          startDate: new Date(user.date),
          endDate: new Date(new Date(user.date).setHours(new Date(user.date).getHours() + 1)),
          color: '#24A0ED',
        }))}
        // Ensures full width on smaller screens
      />
    </Paper>
  </Grid>

  {/* Right Side - User Management */}
  <Grid item xs={8} >
    <Paper elevation={3} style={{ padding: "20px", width: "100%" }}> 
      <Typography variant="h6" gutterBottom sx={{ marginTop: 3, whiteSpace: "nowrap" }}>
        Total Holiday : {Users.length}
      </Typography>

      <Grid container spacing={2} className="textField-root">
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Holiday"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            fullWidth
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <TableContainer>
        <Table sx={{ minWidth: 300, marginTop: 3, width: "100%" }}> {/* Ensures full width */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>ID</TableCell>
              <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Holiday Name</TableCell>
              <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Holiday Date</TableCell>
              <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Holiday Day</TableCell>
              <TableCell sx={{ padding: "4px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ padding: "4px" }}>{user.id}</TableCell>
                <TableCell sx={{ padding: "4px" }}>{user.holidayName}</TableCell>
                <TableCell sx={{ padding: "4px" }}>{user.date}</TableCell>
                <TableCell sx={{ padding: "4px" }}>{user.day}</TableCell>
                <TableCell sx={{ padding: "4px" }}>
                  <Button onClick={() => handleEditClickOpen(user.id)} color="success">
                    <Edit />
                  </Button>
                  <Button onClick={() => { setUserIdToDelete(user.id); setConfirmOpen(true); }} color="error">
                    <Delete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </Grid>
</Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Holiday</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Holiday Name"
            type="text"
            fullWidth
            variant="outlined"
            value={holidayName}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Holiday Date"
            type="date"
            fullWidth
            variant="outlined"
            value={date}
            onChange={handleDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
          <TextField
            select
            label="Holiday Day"
            value={day}
            onChange={handleDayChange}
            fullWidth
            variant="outlined"
          >
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Holiday Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editUser.holidayName}
            onChange={handleEditChange}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
          <TextField
            autoFocus
            margin="dense"
            label="Holiday Date"
            type="date"
            fullWidth
            variant="outlined"
            value={editUser.date}
            onChange={handleEditDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
          <TextField
            select
            label="Holiday Day"
            value={editUser.day}
            onChange={handleEditDayChange}
            fullWidth
            variant="outlined"
          >
            {days.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleUpdate(editUser.id)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => handleDelete(userIdToDelete)}
      />
    </div>
  );
};

export default ManageHoliday;
