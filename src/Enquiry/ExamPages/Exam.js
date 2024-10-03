import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
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
  Container,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";

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

const ConfirmDialog = ({ open, onClose, onConfirm, examName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this Exam?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this Exam/Course cannot be recovered
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const Exam = () => {
  const { id } = useParams(); // Make sure id is correctly used
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  // const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [exam, setExam] = useState({ name: "" });
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");

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
        `http://13.233.43.240:8086/getAllExam?institutecode=${institutecode}`
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

  const handleOpenConfirmDialog = (exam) => {
    setExamToDelete(exam);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setExamToDelete(null);
  };

  const confirmDeleteExam = async () => {
    try {
      await axios.delete(`http://13.233.43.240:8086/deleteExam/${examToDelete.id}`);
      loadExams();
      // setSnackbarMessage("Exam deleted successfully");
      // setSnackbarColor("green");
      toast.success("Exam Deleted Successfully");
      setOpenConfirmDialog(false);
    } catch (error) {
      console.error("Error deleting exam:", error);
      setSnackbarMessage("Error deleting exam");
      setSnackbarColor("red");
    }
  };

  const handleOpenAddDialog = () => {
    setExam({ name: "" });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // const handleOpenUpdateDialog = (exam) => {
  //   setExam(exam);
  //   setOpenUpdateDialog(true);
  // };

  // const handleCloseUpdateDialog = () => {
  //   setOpenUpdateDialog(false);
  // };

  const onAddExamSubmit = async (e) => {
    e.preventDefault();
    if (!exam.name) {
      setSnackbarMessage("Fill all the necessary fields");
      setSnackbarColor("red");
      return;
    }

    try {
      await axios.post(
        `http://13.233.43.240:8086/saveExam?institutecode=${institutecode}`,
        exam
      );
      // setSnackbarMessage("Exam added successfully!");
      toast.success("Exam Added Successfully");
      // setSnackbarColor("green");
      handleCloseAddDialog();
      loadExams();
    } catch (error) {
      console.error("There was an error adding the exam!", error);
    }
  };

  // const onUpdateExamSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!exam.name) {
  //     setSnackbarMessage("Exam name is required");
  //     setSnackbarColor("red");
  //     return;
  //   }

  //   try {
  //     if (!exam.id) { // Ensure that the exam ID is set
  //       throw new Error("No exam ID found");
  //     }

  //     await axios.put(`http://13.233.43.240:8086/updateExam/${exam.id}`, exam, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     // setSnackbarMessage("Exam updated successfully");
  //     toast.success("Exam Updated Successfully");
  //     // setSnackbarColor("green");
  //     handleCloseUpdateDialog();
  //     loadExams();
  //   } catch (error) {
  //     console.error("Error updating exam:", error);
  //     setSnackbarMessage(`Error updating exam: ${error.response?.data?.message || error.message}`);
  //     setSnackbarColor("red");
  //   }
  // };

  return (
    <div>
      <ToastContainer
      autoClose={1000} // Toast will close automatically after 5 seconds
      position="top-right" // Position of the toast
      hideProgressBar={false} // Show or hide the progress bar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
    <PopTypography
      variant="h5"
      gutterBottom
      sx={{
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        backgroundColor: "#24A0ED",
        borderRadius: "150px",
        padding: "10px",
        marginBottom: "20px",
      }}
    >
          Exams / Course List
          </PopTypography>
      <Grid container spacing={2} className="textField-root">
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}
        >
                Total Exams: {filteredExams.length}
                </Typography>{" "}
        {/* Dropdown Fields */}
        <Grid item xs={12} sm={1.6}>
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
              Add 
            </Button>
          </Grid>
        </Grid>

        <Box mt={2}>
          <TableContainer sx={{ width: "100%" }}>
            <Table size="small" aria-label="exam table" sx={{ width: "100%" }}>
              <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
                <TableRow>
                  <TableCell><strong>Id</strong></TableCell>
                  <TableCell><strong>Exam Name</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExams.map((exam, index) => (
                  <TableRow key={exam.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{exam.name}</TableCell>
                    <TableCell>
                      {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenUpdateDialog(exam)}
                        size="small"
                        sx={{ marginRight: "10px" }}
                      >
                        Update
                      </Button> */}
                      <Button
                        color="error"
                        onClick={() => handleOpenConfirmDialog(exam)}
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
          <DialogContent > 
            <DialogContentText>
              Add new exam.
            </DialogContentText>
            <form onSubmit={onAddExamSubmit} >
              <Grid item className="textField-root"> 
              <TextField
                autoFocus
                margin="dense"
                label="Exam Name"
                fullWidth
                variant="outlined"
                value={exam.name}
                onChange={(e) => setExam({ ...exam, name: e.target.value })}
              />
              </Grid>
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

        {/* Update Exam Dialog */}
        {/* <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Exam</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the details of the exam.
            </DialogContentText>
            <form onSubmit={onUpdateExamSubmit}>
              <Grid item className="textField-root">
              <TextField
                autoFocus
                margin="dense"
                label="Exam Name"
                fullWidth
                variant="outlined"
                value={exam.name}
                onChange={(e) => setExam({ ...exam, name: e.target.value })}
              />
              </Grid>
              
              <DialogActions>
                <Button onClick={handleCloseUpdateDialog} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Update
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog> */}

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          onConfirm={confirmDeleteExam}
          examName={examToDelete?.name || ""}
        />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarMessage !== ""}
          autoHideDuration={6000}
          onClose={() => setSnackbarMessage("")}
          message={snackbarMessage}
          action={
            <Button color="inherit" onClick={() => setSnackbarMessage("")}>
              Close
            </Button>
          }
          sx={{
            backgroundColor: snackbarColor,
            color: "#fff",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />

    </div>
  );
};

export default Exam;
