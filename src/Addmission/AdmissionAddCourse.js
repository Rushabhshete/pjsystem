import React, { useState, useEffect } from "react";
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
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);
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
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  // const [updateCourseName, setUpdateCourseName] = useState("");
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
        `http://localhost:8085/getAllCourse?institutecode=${institutecode}`
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
        `http://localhost:8085/AddCourse?institutecode=${institutecode}`,
        { cname: courseName }
      );
      MySwal.fire("Success", "Course Added Successfully", "success");
      console.log("Course added successfully");
      setCourseName(""); // Clear the input field
      fetchCourses(); // Refresh the course list
      handleCloseAddCourseDialog(); // Close the dialog
    } catch (error) {
      console.error("Error adding course:", error.response || error.message);
    }
  };

  const handleOpenDeleteConfirmation = (id) => {
    setSelectedCourseId(id);
    MySwal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this course? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDeleteCourse(id);
      }
    });
  };

  const confirmDeleteCourse = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8085/deleteById/${id}`
      );
      MySwal.fire("Deleted!", "Course Deleted Successfully", "success");
      console.log("Course deleted successfully");
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error("Error deleting course:", error.response || error.message);
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
            Add Course 
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer>
          <Table className="table-root">
            <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.cname}</TableCell>
                  <TableCell>
                    {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenUpdateDialog(course)}
                      sx={{ mr: 1 }}
                    >
                      Update
                    </Button> */}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenDeleteConfirmation(course.id)}
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

      {/* <UpdateDialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        onUpdate={handleUpdate}
        courseName={updateCourseName}
        setUpdateCourseName={setUpdateCourseName}
      /> */}

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
