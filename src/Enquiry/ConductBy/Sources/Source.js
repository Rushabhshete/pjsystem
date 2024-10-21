// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Grid,
//   Box,
//   Container,
//   Snackbar,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { ToastContainer } from "react-toastify";
// import { toast } from "react-toastify";



// // Confirm Delete Dialog
// const ConfirmDialog = ({ open, onClose, onConfirm, sourceName }) => (
//   <Dialog open={open} onClose={onClose}>
//     <DialogTitle color="blue" textAlign={"center"}>
//       Confirm Deletion
//     </DialogTitle>
//     <DialogContent>
//       <Typography>Are you sure you want to delete this Source?</Typography>
//       <Typography color="red" fontWeight={200} variant="body2">
//         *On clicking Confirm, this Source cannot be recovered
//       </Typography>
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={onClose} color="primary">
//         Cancel
//       </Button>
//       <Button onClick={onConfirm} color="error">
//         Confirm
//       </Button>
//     </DialogActions>
//   </Dialog>
// );
// // Add/Update Source Dialog
// const SourceDialog = ({ open, onClose, source, onSave, isUpdate }) => {
//   const [name, setName] = useState(source ? source.name : "");
//   useEffect(() => {
//     if (source) setName(source.name);
//   }, [source]);
//   const handleSave = () => {
//     onSave({ ...source, name });
//     onClose();
//   };
//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>{isUpdate ? "Update Source" : "Add New Source"}</DialogTitle>
//       <DialogContent>
//         <Grid item className="textField-root" style={{marginTop:'10px'}}>
//         <TextField
//           label="Source Name"
//           variant="outlined"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           fullWidth
//         />
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={handleSave} color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
// const Source = () => {
//   const [sources, setSources] = useState([]);
//   const [filteredSources, setFilteredSources] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [sourceToDelete, setSourceToDelete] = useState(null);
//   const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
//   const [currentSource, setCurrentSource] = useState(null);
//   const [isUpdate, setIsUpdate] = useState(false);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const institutecode = localStorage.getItem("institutecode") || "";
//   useEffect(() => {
//     loadSources();
//   }, [institutecode]);
//   useEffect(() => {
//     filterSources();
//   }, [searchTerm, sources]);
//   const loadSources = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8086/getAllSource?institutecode=${institutecode}`
//       );
//       setSources(response.data);
//       setFilteredSources(response.data); // Initially set filtered sources to all sources
//     } catch (error) {
//       console.error("Error fetching sources:", error);
//     }
//   };
//   const filterSources = () => {
//     const filtered = sources.filter((source) =>
//       source.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredSources(filtered);
//   };
//   const handleOpenConfirmDialog = (source) => {
//     setSourceToDelete(source);
//     setConfirmDialogOpen(true);
//   };
//   const handleCloseConfirmDialog = () => {
//     setConfirmDialogOpen(false);
//     setSourceToDelete(null);
//   };
//   const confirmDeleteSource = async () => {
//     try {
//       await axios.delete(
//         `http://localhost:8086/delete/source/${sourceToDelete.id}`
//       );
//       toast.success("Source Deleted Successfully");
//       loadSources();
//       handleCloseConfirmDialog();
//     } catch (error) {
//       console.error("Error deleting source:", error);
//     }
//   };
//   const handleOpenSourceDialog = (source = null, isUpdate = false) => {
//     setCurrentSource(source);
//     setIsUpdate(isUpdate);
//     setSourceDialogOpen(true);
//   };
//   const handleCloseSourceDialog = () => {
//     setSourceDialogOpen(false);
//     setCurrentSource(null);
//   };
//   const handleSaveSource = async (source) => {
//     try {
//       if (isUpdate) {
//         await axios.put(
//           `http://localhost:8086/update/source/${source.id}`,
//           source
//         );
//         // setSnackbarMessage("Source updated successfully");
//         toast.success("Source Updated Successfully");
//       } else {
//         await axios.post(
//           `http://localhost:8086/save/source?institutecode=${institutecode}`,
//           source
//         );
//         toast.success("Source Added Successfully");
//         // setSnackbarMessage("Source added successfully");
//       }
//       // setSnackbarOpen(true);
//       loadSources();
//     } catch (error) {
//       console.error("Error saving source:", error);
//       setSnackbarMessage("Error saving source");
//       setSnackbarOpen(true);
//     }
//   };
//   const PopTypography = styled(Typography)`
//   @keyframes pop {
//     0% {
//       transform: scale(1);
//     }
//     50% {
//       transform: scale(1.1);
//     }
//     100% {
//       transform: scale(1);
//     }
//   }
// `;
//   return (
//     <div>
//       <ToastContainer
//       autoClose={1000} // Toast will close automatically after 5 seconds
//       position="top-right" // Position of the toast
//       hideProgressBar={false} // Show or hide the progress bar
//       newestOnTop={false}
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover/>
//     {/* <PopTypography
//       variant="h5"
//       gutterBottom
//       sx={{
//         fontWeight: "bold",
//         color: "#fff",
//         textAlign: "center",
//         backgroundColor: "#24A0ED",
//         borderRadius: "150px",
//         padding: "10px",
//         marginBottom: "20px",
//       }}
//     >
//           Source List
//           </PopTypography> */}
//       <Grid container spacing={2} className="textField-root">
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ marginTop: 3, whiteSpace: "nowrap" }}
//         >
//                 Total Sources: {filteredSources.length}
//                 </Typography>{" "}
//         {/* Dropdown Fields */}
//         <Grid item xs={12} sm={1.6}>
//           <TextField
//               label="Search Source"
//               variant="outlined"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               fullWidth
          
//             />
//           </Grid>
//           <Grid item xs={6} sm={2}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => handleOpenSourceDialog(null, false)}
//               sx={{ marginTop: 1 }}
//             >
//               Add
//             </Button>
//           </Grid>
//         </Grid>
//         <Box mt={2}>
//           <TableContainer sx={{ width: "100%" }}>
//             <Table size="small" aria-label="source table" sx={{ width: "100%" }}>
//               <TableHead sx={{ backgroundColor: "#F2F2F2" }}>
//                 <TableRow>
//                   <TableCell>
//                     <strong>Id</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Source Name</strong>
//                   </TableCell>
//                   <TableCell>
//                     <strong>Actions</strong>
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredSources.map((source, index) => (
//                   <TableRow key={source.id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{source.name}</TableCell>
//                     <TableCell>
//                       {/* <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => handleOpenSourceDialog(source, true)}
//                         size="small"
//                         sx={{ marginRight: "10px" }}
//                       >
//                         Update
//                       </Button> */}
//                       <Button
//                         color="error"
//                         onClick={() => handleOpenConfirmDialog(source)}
//                         size="small"
//                         variant="contained"
//                       >
//                         Delete
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//         <ConfirmDialog
//           open={confirmDialogOpen}
//           onClose={handleCloseConfirmDialog}
//           onConfirm={confirmDeleteSource}
//           sourceName={sourceToDelete?.name}
//         />
//         <SourceDialog
//           open={sourceDialogOpen}
//           onClose={handleCloseSourceDialog}
//           source={currentSource}
//           onSave={handleSaveSource}
//           isUpdate={isUpdate}
//         />
//         {/* <Snackbar
//           open={snackbarOpen}
//           autoHideDuration={2000}
//           onClose={() => setSnackbarOpen(false)}
//           message={snackbarMessage}
//           anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//           ContentProps={{
//             sx: { backgroundColor: snackbarMessage === "Error saving source" ? "red" : "green" },
//           }}
//         /> */}
  
//     </div>
//   );
// };
// export default Source;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import Swal from "sweetalert2"; // Import SweetAlert2
import DeleteIcon from "@mui/icons-material/Delete";

// Confirm Delete Dialog (using SweetAlert2)
const confirmDelete = async (source, onDelete) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this Source!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!"
  });

  if (result.isConfirmed) {
    onDelete(source);
    Swal.fire("Deleted!", "Your source has been deleted.", "success");
  }
};

// Add/Update Source Dialog
const SourceDialog = ({ open, onClose, source, onSave, isUpdate }) => {
  const [name, setName] = useState(source ? source.name : "");
  
  useEffect(() => {
    if (source) setName(source.name);
  }, [source]);
  
  const handleSave = () => {
    onSave({ ...source, name });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isUpdate ? "Update Source" : "Add New Source"}</DialogTitle>
      <DialogContent>
        <Grid item className="textField-root" style={{ marginTop: '10px' }}>
          <TextField
            label="Source Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const Source = () => {
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceDialogOpen, setSourceDialogOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const institutecode = localStorage.getItem("institutecode") || "";

  useEffect(() => {
    loadSources();
  }, [institutecode]);

  useEffect(() => {
    filterSources();
  }, [searchTerm, sources]);

  const loadSources = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/getAllSource?institutecode=${institutecode}`
      );
      setSources(response.data);
      setFilteredSources(response.data); // Initially set filtered sources to all sources
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const filterSources = () => {
    const filtered = sources.filter((source) =>
      source.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSources(filtered);
  };

  const handleDeleteSource = async (source) => {
    try {
      await axios.delete(`http://localhost:8086/delete/source/${source.id}`);
      loadSources();
    } catch (error) {
      console.error("Error deleting source:", error);
    }
  };

  const handleOpenSourceDialog = (source = null, isUpdate = false) => {
    setCurrentSource(source);
    setIsUpdate(isUpdate);
    setSourceDialogOpen(true);
  };

  const handleCloseSourceDialog = () => {
    setSourceDialogOpen(false);
    setCurrentSource(null);
  };

  const handleSaveSource = async (source) => {
    try {
      if (isUpdate) {
        await axios.put(`http://localhost:8086/update/source/${source.id}`, source);
        Swal.fire("Updated!", "Source updated successfully", "success");
      } else {
        await axios.post(
          `http://localhost:8086/save/source?institutecode=${institutecode}`,
          source
        );
        Swal.fire("Added!", "Source added successfully", "success");
      }
      loadSources();
    } catch (error) {
      Swal.fire("Error", "Error saving source", "error");
      console.error("Error saving source:", error);
    }
  };

  return (
    <div>
      <Grid container spacing={2} className="textField-root">
        <Typography variant="h6" gutterBottom sx={{ marginTop: 3, whiteSpace: "nowrap" }}>
          Total Sources: {filteredSources.length}
        </Typography>
        
        {/* Search and Add */}
        <Grid item xs={12} sm={1.6}>
          <TextField
            label="Search Source"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenSourceDialog(null, false)}
            sx={{ marginTop: 1 }}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer >
          <Table className="table-root">
            <TableHead >
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Source Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSources.map((source, index) => (
                <TableRow key={source.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{source.name}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => confirmDelete(source, handleDeleteSource)}
                      size="small"
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <SourceDialog
        open={sourceDialogOpen}
        onClose={handleCloseSourceDialog}
        source={currentSource}
        onSave={handleSaveSource}
        isUpdate={isUpdate}
      />
    </div>
  );
};

export default Source;
