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
  Box
} from "@mui/material";
import { styled } from "@mui/system";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

const StyledTableHeader = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const AddmissionSource = () => {
  const [sourceName, setSourceName] = useState("");
  const [sources, setSources] = useState([]);
  const [filteredSources, setFilteredSources] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState(null);
  const [updateSourceName, setUpdateSourceName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    filterSources();
  }, [sources, searchTerm]);

  const fetchSources = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      const response = await axios.get(
        `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
      );
      setSources(response.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };

  const filterSources = () => {
    const filtered = sources.filter((source) =>
      source.sourceBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSources(filtered);
  };

  const handleAddSource = async () => {
    try {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        throw new Error("No institutecode found in local storage");
      }
      await axios.post(
        `http://localhost:8085/api/sourceBy/saveSourceBy?institutecode=${institutecode}`,
        { sourceBy: sourceName }
      );
      MySwal.fire("Success", "Source Added Successfully", "success");
      setSourceName("");
      fetchSources(); // Refresh the source list
      handleCloseAddDialog(); // Close the dialog
    } catch (error) {
      console.error("Error adding source:", error.response || error.message);
    }
  };

  // const handleUpdateSource = async () => {
  //   try {
  //     const institutecode = localStorage.getItem("institutecode");
  //     if (!institutecode) {
  //       throw new Error("No institutecode found in local storage");
  //     }
  //     await axios.put(
  //       `http://localhost:8085/api/sourceBy/updateSourceBy/${selectedSourceId}`,
  //       {
  //         sourceBy: updateSourceName,
  //         institutecode: institutecode // Include institutecode if required
  //       }
  //     );
  //     toast.success("Source Updated Successfully");
  //     fetchSources(); // Refresh the source list
  //     handleCloseUpdateDialog(); // Close the dialog
  //   } catch (error) {
  //     console.error("Error updating source:", error.response || error.message);
  //   }
  // };

  const handleOpenDeleteConfirmation = (id) => {
    setSelectedSourceId(id);
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
        confirmDeleteSource(id);
      }
    });
  };


  const confirmDeleteSource = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8085/api/sourceBy/deleteSourceBy/${id}`
      );
      MySwal.fire("Deleted!", "Source Deleted Successfully", "success");
      fetchSources(); // Refresh the source list
      handleCloseDeleteDialog(); // Close the dialog
    } catch (error) {
      console.error("Error deleting source:", error.response || error.message);
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSourceName("");
  };

  // const handleOpenUpdateDialog = (source) => {
  //   setUpdateSourceName(source.sourceBy);
  //   setSelectedSourceId(source.id);
  //   setOpenUpdateDialog(true);
  // };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setUpdateSourceName("");
    setSelectedSourceId(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setSelectedSourceId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedSourceId(null);
  };

  return (
    <div>
      
      <Grid container spacing={2} className="textField-root">
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}
        >
          Total Sources: {filteredSources.length}
          </Typography>
         
          <Grid item xs={12} sm={1.6}>
          <TextField
            label="Search Source"
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
            Add Source
          </Button>
        </Grid>
      </Grid>

      <Box mt={2}>
      <TableContainer >
        <Table className="table-root">
          <TableHead >
            <TableRow >
              <TableCell>ID</TableCell>
              <TableCell>Source Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>{source.id}</TableCell>
                <TableCell>{source.sourceBy}</TableCell>
                <TableCell>
                  {/* <Button
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleOpenUpdateDialog(source)}
                    color="primary"
                    sx={{ mr: 1 }}
                    variant="contained"
                  >
                    Update
                  </Button> */}
                  <Button
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDeleteConfirmation(source.id)}
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

      {/* Add Source Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        aria-labelledby="add-source-dialog-title"
        aria-describedby="add-source-dialog-description"
      >
        <DialogTitle id="add-source-dialog-title">Add New Source</DialogTitle>
        <DialogContent>
          <Grid item className="textField-root">
          <TextField
            autoFocus
            margin="dense"
            id="source-name"
            label="Source Name"
            type="text"
            fullWidth
            variant="outlined"
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
          />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSource} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Source Dialog */}
      {/* <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        aria-labelledby="update-source-dialog-title"
        aria-describedby="update-source-dialog-description"
      >
        <DialogTitle id="update-source-dialog-title">Update Source</DialogTitle>
        <DialogContent>
          <Grid item className="textField-root">
          <TextField
            autoFocus
            margin="dense"
            id="update-source-name"
            label="Source Name"
            type="text"
            fullWidth
            variant="outlined"
            value={updateSourceName}
            onChange={(e) => setUpdateSourceName(e.target.value)}
          />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSource} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Delete Source Confirmation Dialog */}
      {/* <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-source-dialog-title"
        aria-describedby="delete-source-dialog-description"
      >
        <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this Source?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this Source cannot be recovered
      </Typography>
    </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSource} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default AddmissionSource;
