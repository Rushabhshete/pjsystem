import React, { useState, useEffect } from "react";
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
  Box,
  Container,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";

const ConfirmDialog = ({ open, onClose, onConfirm, courseName }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Deletion</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete the course "{courseName}"?
      </DialogContentText>
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

const UpdateDialog = ({
  open,
  onClose,
  onUpdate,
  courseName,
  setUpdateCourseName,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Update Course</DialogTitle>
    <DialogContent>
      <Grid item className="textField-root">
        <TextField
          autoFocus
          margin="dense"
          id="course-name"
          label="Course Name"
          type="text"
          fullWidth
          variant="outlined"
          value={courseName}
          onChange={(e) => setUpdateCourseName(e.target.value)}
        />
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
      <Button onClick={onUpdate} color="error">
        Update
      </Button>
    </DialogActions>
  </Dialog>
);

const AddCourseDialog = ({
  open,
  onClose,
  onAdd,
  courseName,
  setCourseName,
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Add New Course</DialogTitle>
    <DialogContent>
      <Grid item className="textField-root">
        <TextField
          autoFocus
          margin="dense"
          id="new-course-name"
          label="Course Name"
          type="text"
          fullWidth
          variant="outlined"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Cancel
      </Button>
      <Button onClick={onAdd} color="primary">
        Add
      </Button>
    </DialogActions>
  </Dialog>
);

const StyledTableHeader = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateCourseName, setUpdateCourseName] = useState("");
  const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }

      const response = await axios.get(
        `http://13.233.43.240:8085/getAllCourse?institutecode=${institutecode}`
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error.response || error.message);
    }
  };

  const handleAddCourse = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }

      await axios.post(
        `http://13.233.43.240:8085/AddCourse?institutecode=${institutecode}`,
        { cname: courseName }
      );
      toast.success("Course Added Successfully");
      console.log("Course added successfully");
      setCourseName(""); // Clear the input field
      fetchCourses(); // Refresh the course list
      handleCloseAddCourseDialog(); // Close the dialog
    } catch (error) {
      console.error("Error adding course:", error.response || error.message);
    }
  };

  const handleOpenDialog = (id) => {
    setSelectedCourseId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedCourseId(null);
  };

  const confirmDeleteCourse = async () => {
    try {
      await axios.delete(
        `http://13.233.43.240:8085/deleteById/${selectedCourseId}`
      );
      toast.success("Course Delete Successfully");
      console.log("Course deleted successfully");
      fetchCourses(); // Refresh the course list
      handleCloseDialog(); // Close the dialog
    } catch (error) {
      console.error("Error deleting course:", error.response || error.message);
    }
  };

  const handleOpenUpdateDialog = (course) => {
    setUpdateCourseName(course.cname);
    setSelectedCourseId(course.id);
    setOpenUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedCourseId(null);
    setUpdateCourseName("");
  };

  const handleUpdate = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }

      // Send institutecode as a query parameter
      await axios.put(
        `http://13.233.43.240:8085/updateCourse/${selectedCourseId}?institutecode=${institutecode}`,
        {
          cname: updateCourseName, // Only send course name in the request body
        }
       
      );
      toast.success("Course Updated Successfully");
      console.log("Course updated successfully");
      fetchCourses(); // Refresh the course list
      handleCloseUpdateDialog(); // Close the dialog
    } catch (error) {
      console.error("Error updating course:", error.response || error.message);
    }
  };

  const handleOpenAddCourseDialog = () => {
    setOpenAddCourseDialog(true);
  };

  const handleCloseAddCourseDialog = () => {
    setOpenAddCourseDialog(false);
    setCourseName("");
  };

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) =>
    course.cname.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <Typography
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
        Add Course / Exam
      </Typography>

      <Grid container spacing={2} className="textField-root">
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}
        >
          Total Courses: {filteredCourses.length}
        </Typography>

        <Grid item xs={12} sm={1.6} className="textField-root">
          <TextField
            label="Search Course..."
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={1.6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddCourseDialog}
            sx={{ marginTop: 1 }}
          >
            Add
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer sx={{ width: "100%" }}>
          <Table size="small" aria-label="course table" sx={{ width: "100%" }}>
            <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
              <TableRow>
                <StyledTableHeader>ID</StyledTableHeader>
                <StyledTableHeader>Course Name</StyledTableHeader>
                <StyledTableHeader>Action Required</StyledTableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.cname}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenUpdateDialog(course)}
                      sx={{ mr: 1 }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDialog(course.id)}
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

      <ConfirmDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={confirmDeleteCourse}
        courseName={
          courses.find((course) => course.id === selectedCourseId)?.cname || ""
        }
      />

      <UpdateDialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        onUpdate={handleUpdate}
        courseName={updateCourseName}
        setUpdateCourseName={setUpdateCourseName}
      />

      <AddCourseDialog
        open={openAddCourseDialog}
        onClose={handleCloseAddCourseDialog}
        onAdd={handleAddCourse}
        courseName={courseName}
        setCourseName={setCourseName}
      />
    </div>
  );
};

export default AddCourse;
