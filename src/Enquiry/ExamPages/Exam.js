// import React, { useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import {
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
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
// import { toast, ToastContainer } from "react-toastify";

// const PopTypography = styled(Typography)`
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

// const ConfirmDialog = ({ open, onClose, onConfirm, examName }) => (
//   <Dialog open={open} onClose={onClose}>
//     <DialogTitle color="blue" textAlign={"center"}>
//       Confirm Deletion
//     </DialogTitle>
//     <DialogContent>
//       <Typography>Are you sure you want to delete this Exam?</Typography>
//       <Typography color="red" fontWeight={200} variant="body2">
//         *On clicking Confirm, this Exam/Course cannot be recovered
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

// const Exam = () => {
//   const { id } = useParams(); // Make sure id is correctly used
//   const navigate = useNavigate();

//   const [exams, setExams] = useState([]);
//   const [filteredExams, setFilteredExams] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openAddDialog, setOpenAddDialog] = useState(false);
//   const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
//   const [examToDelete, setExamToDelete] = useState(null);
//   const [exam, setExam] = useState({ name: "" });
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarColor, setSnackbarColor] = useState("");

//   const institutecode = localStorage.getItem("institutecode") || "";

//   useEffect(() => {
//     loadExams();
//   }, [institutecode]);

//   useEffect(() => {
//     filterExams();
//   }, [searchTerm, exams]);

//   const loadExams = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8086/getAllExam?institutecode=${institutecode}`
//       );
//       setExams(response.data);
//       setFilteredExams(response.data);
//     } catch (error) {
//       console.error("Error fetching exams:", error);
//     }
//   };

//   const filterExams = () => {
//     const filtered = exams.filter((exam) =>
//       exam.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredExams(filtered);
//   };

//   const handleOpenConfirmDialog = (exam) => {
//     setExamToDelete(exam);
//     setOpenConfirmDialog(true);
//   };

//   const handleCloseConfirmDialog = () => {
//     setOpenConfirmDialog(false);
//     setExamToDelete(null);
//   };

//   const confirmDeleteExam = async () => {
//     try {
//       await axios.delete(`http://localhost:8086/deleteExam/${examToDelete.id}`);
//       loadExams();
//       toast.success("Exam Deleted Successfully");
//       setOpenConfirmDialog(false);
//     } catch (error) {
//       console.error("Error deleting exam:", error);
//       setSnackbarMessage("Error deleting exam");
//       setSnackbarColor("red");
//     }
//   };

//   const handleOpenAddDialog = () => {
//     setExam({ name: "" });
//     setOpenAddDialog(true);
//   };

//   const handleCloseAddDialog = () => {
//     setOpenAddDialog(false);
//   };

//   const onAddExamSubmit = async (e) => {
//     e.preventDefault();
//     if (!exam.name) {
//       setSnackbarMessage("Fill all the necessary fields");
//       setSnackbarColor("red");
//       return;
//     }

//     try {
//       await axios.post(
//         `http://localhost:8086/saveExam?institutecode=${institutecode}`,
//         exam
//       );
//       // setSnackbarMessage("Exam added successfully!");
//       toast.success("Exam Added Successfully");
//       // setSnackbarColor("green");
//       handleCloseAddDialog();
//       loadExams();
//     } catch (error) {
//       console.error("There was an error adding the exam!", error);
//     }
//   };

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
//       <Grid container spacing={2} className="textField-root">
//         <Typography
//           variant="h6"
//           gutterBottom
//           sx={{ marginTop: 3, whiteSpace: "nowrap" }}
//         >
//                 Total Exams: {filteredExams.length}
//                 </Typography>{" "}
//         {/* Dropdown Fields */}
//         <Grid item xs={12} sm={1.6}>
//             <TextField
//               label="Search Exam"
//               variant="outlined"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               fullWidth
//             />
//           </Grid>

//           <Grid item xs={12} sm={2}>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleOpenAddDialog}
//               sx={{ marginTop: 1 }}
//             >
//               Add
//             </Button>
//           </Grid>
//         </Grid>

//         <Box mt={2}>
//           <TableContainer sx={{ width: "100%" }}>
//             <Table size="small" aria-label="exam table" sx={{ width: "100%" }}>
//               <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
//                 <TableRow>
//                   <TableCell><strong>Id</strong></TableCell>
//                   <TableCell><strong>Exam Name</strong></TableCell>
//                   <TableCell><strong>Actions</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredExams.map((exam, index) => (
//                   <TableRow key={exam.id}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>{exam.name}</TableCell>
//                     <TableCell>
//                       <Button
//                         color="error"
//                         onClick={() => handleOpenConfirmDialog(exam)}
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

//         {/* Add Exam Dialog */}
//         <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
//           <DialogTitle>Add Exam</DialogTitle>
//           <DialogContent >
//             <DialogContentText>
//               Add new exam.
//             </DialogContentText>
//             <form onSubmit={onAddExamSubmit} >
//               <Grid item className="textField-root">
//               <TextField
//                 autoFocus
//                 margin="dense"
//                 label="Exam Name"
//                 fullWidth
//                 variant="outlined"
//                 value={exam.name}
//                 onChange={(e) => setExam({ ...exam, name: e.target.value })}
//               />
//               </Grid>
//               <DialogActions>
//                 <Button onClick={handleCloseAddDialog} color="primary">
//                   Cancel
//                 </Button>
//                 <Button type="submit" color="primary">
//                   Add
//                 </Button>
//               </DialogActions>
//             </form>
//           </DialogContent>
//         </Dialog>

//         {/* Confirm Delete Dialog */}
//         <ConfirmDialog
//           open={openConfirmDialog}
//           onClose={handleCloseConfirmDialog}
//           onConfirm={confirmDeleteExam}
//           examName={examToDelete?.name || ""}
//         />

//         {/* Snackbar for notifications */}
//         <Snackbar
//           open={snackbarMessage !== ""}
//           autoHideDuration={6000}
//           onClose={() => setSnackbarMessage("")}
//           message={snackbarMessage}
//           action={
//             <Button color="inherit" onClick={() => setSnackbarMessage("")}>
//               Close
//             </Button>
//           }
//           sx={{
//             backgroundColor: snackbarColor,
//             color: "#fff",
//             borderRadius: "5px",
//             padding: "10px",
//             boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
//           }}
//         />

//     </div>
//   );
// };

// export default Exam;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const Exam = () => {
  const { id } = useParams(); // Make sure id is correctly used

  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false); // For add exam dialog
  const [exam, setExam] = useState({ name: "" });

  const institutecode = localStorage.getItem("institutecode") || "";

  useEffect(() => {
    loadExams();
  }, [institutecode]);

  useEffect(() => {
    filterExams();
  }, [searchTerm, exams]);

  const loadExams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8086/getAllExam?institutecode=${institutecode}`
      );
      setExams(response.data);
      setFilteredExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const filterExams = () => {
    const filtered = exams.filter((exam) =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExams(filtered);
  };

  const handleDeleteExam = (exam) => {
    MySwal.fire({
      title: "Are you sure?",
      text: `Do you want to delete exam: ${exam.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteExam(exam.id);
      }
    });
  };

  const deleteExam = async (examId) => {
    try {
      await axios.delete(`http://localhost:8086/deleteExam/${examId}`);
      MySwal.fire({
        title: "Deleted!",
        text: "The exam has been deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      loadExams();
    } catch (error) {
      console.error("Error deleting exam:", error);
      MySwal.fire({
        title: "Error!",
        text: "There was an error deleting the exam.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleOpenAddDialog = () => {
    setExam({ name: "" });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const onAddExamSubmit = async (e) => {
    e.preventDefault();
    if (!exam.name) {
      MySwal.fire({
        title: "Error!",
        text: "Please fill out the necessary fields.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await axios.post(
        `http://localhost:8086/saveExam?institutecode=${institutecode}`,
        exam
      );
      MySwal.fire({
        title: "Success!",
        text: "The exam has been added successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      handleCloseAddDialog();
      loadExams();
    } catch (error) {
      console.error("There was an error adding the exam!", error);
      MySwal.fire({
        title: "Error!",
        text: "There was an error adding the exam.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div sx={{marginTop:"10px"}}>
      <Grid container spacing={2}sx={{marginTop:"10px"}}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}
        >
          Total Exams: {filteredExams.length}
        </Typography>

        <Grid item xs={12} sm={1.6} className="textField-root">
          <TextField
            label="Search Exam"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            sx={{ marginTop: 1 }}
          >
            Add Exam/Course 
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer>
          <Table className="table-root">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Exam Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams.map((exam, index) => (
                <TableRow key={exam.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{exam.name}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => handleDeleteExam(exam)}
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

      {/* Add Exam Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add Exam</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new exam.</DialogContentText>
          <form onSubmit={onAddExamSubmit}>
            <TextField
              autoFocus
              margin="dense"
              label="Exam Name"
              fullWidth
              variant="outlined"
              value={exam.name}
              onChange={(e) => setExam({ ...exam, name: e.target.value })}
            />
            <DialogActions>
              <Button onClick={handleCloseAddDialog} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Add
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exam;
