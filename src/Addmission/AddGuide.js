import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

const AddGuide = () => {
  const [guideName, setGuideName] = useState("");
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [updateGuideName, setUpdateGuideName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [guides, searchTerm]);

  const fetchGuides = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      const response = await axios.get(
        `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
      );
      setGuides(response.data);
    } catch (error) {
      console.error("Error fetching guides:", error);
    }
  };

  const filterGuides = () => {
    const filtered = guides.filter((guide) =>
      guide.guideName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGuides(filtered);
  };

  const handleAddGuide = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      await axios.post(
        `http://localhost:8085/api/conductBy/saveConductBy?institutecode=${institutecode}`,
        { guideName }
      );
      MySwal.fire("Success", "Guide Added Successfully", "success");
      setGuideName("");
      fetchGuides(); // Refresh the guide list
      handleCloseAddDialog(); // Close the dialog
    } catch (error) {
      console.error("Error adding guide:", error);
    }
  };

  // const handleUpdateGuide = async () => {
  //   try {
  //     const institutecode = localStorage.getItem("institutecode");
  //     if (!institutecode) {
  //       throw new Error("No institutecode found in local storage");
  //     }
  //     await axios.put(
  //       `http://localhost:8085/api/conductBy/updateConductBy/${selectedGuideId}?institutecode=${institutecode}`,
  //       { guideName: updateGuideName }
  //     );
  //     toast.success("Guid Updated Successfully");
  //     fetchGuides(); // Refresh the guide list
  //     handleCloseUpdateDialog(); // Close the dialog
  //   } catch (error) {
  //     console.error("Error updating guide:", error);
  //   }
  // };

  const handleOpenDeleteConfirmation = (id) => {
    setSelectedGuideId(id);
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
        confirmDeleteGuide(id);
      }
    });
  };

  const confirmDeleteGuide = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8085/api/conductBy/deleteConductBy/${id}`
      );
      MySwal.fire("Deleted!", "Guide Deleted Successfully", "success");
      fetchGuides(); // Refresh the guide list
      handleCloseDeleteDialog(); // Close the dialog
    } catch (error) {
      console.error("Error deleting guide:", error);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setGuideName("");
  };

  // const handleOpenUpdateDialog = (guide) => {
  //   setUpdateGuideName(guide.guideName);
  //   setSelectedGuideId(guide.id);
  //   setOpenUpdateDialog(true);
  // };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setUpdateGuideName("");
    setSelectedGuideId(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedGuideId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedGuideId(null);
  };
 

  return (
    <Container maxWidth="false" sx={{ padding: 2, width: "100%" }}>
     
        <Grid container spacing={2} className="textField-root">
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}
        >
              Total Guides: {filteredGuides.length}
              </Typography>{" "}
        {/* Dropdown Fields */}
        <Grid item xs={12} sm={1.6}>
          <TextField
            label="Search Guide"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={1.6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            sx={{ mt: 1 }}
          >
            Add GUIDE
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
        <TableContainer >
          <Table className="table-root">
            <TableHead >
              <TableRow>
                <TableCell >ID</TableCell>
                <TableCell >Guide Name</TableCell>
                <TableCell >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGuides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell>{guide.id}</TableCell>
                  <TableCell>{guide.guideName}</TableCell>
                  <TableCell>
                    {/* <Button
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenUpdateDialog(guide)}
                      color="primary"
                      sx={{ mr: 1 }}
                      variant="contained"
                    >
                      Update
                    </Button> */}
                    <Button
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleOpenDeleteConfirmation(guide.id)}
                      color="error"
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

      {/* Add Guide Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-guide-dialog-title"
      >
        <DialogTitle id="add-guide-dialog-title">Add New Guide</DialogTitle>
        <DialogContent>
          <Grid item className="textField-root">
            <TextField
              autoFocus
              margin="dense"
              label="Guide Name"
              type="text"
              fullWidth
              value={guideName}
              onChange={(e) => setGuideName(e.target.value)}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddGuide} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Guide Dialog */}
      {/* <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="update-guide-dialog-title"
      >
        <DialogTitle id="update-guide-dialog-title">Update Guide</DialogTitle>
        <DialogContent>
          <Grid item className="textField-root">
            <TextField
              autoFocus
              margin="dense"
              label="Guide Name"
              type="text"
              fullWidth
              value={updateGuideName}
              onChange={(e) => setUpdateGuideName(e.target.value)}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateGuide} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Delete Guide Dialog */}
      {/* <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-guide-dialog-title"
      >
        <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
        <DialogContent>
      <Typography>Are you sure you want to delete this Guide?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this Guide cannot be recovered
      </Typography>
    </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteGuide} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
    </Container>
  );
};

export default AddGuide;
