import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
  Typography,Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

export default function ManageEmpMemo() {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const instituteCode = localStorage.getItem("institutecode");
    fetch(`http://localhost:8082/memos/all?institutecode=${instituteCode}`)
      .then((response) => response.json())
      .then((data) => {
        setMemos(data);
      })
      .catch((error) => {
        console.error("Error fetching memos:", error);
      });
  }, []);

  const handleOpenEditDialog = (memo) => {
    setSelectedMemo(memo);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedMemo(null);
  };

  const handleUpdateMemo = () => {
    // Add your API call logic here to update the memo
    // Example API call:
    const updatedMemo = { ...selectedMemo };
    fetch(`http://localhost:8082/memos/updatememo/${selectedMemo.mid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMemo),
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbarMessage("Memo updated successfully");
        setSnackbarOpen(true);
        fetchData(); // Refresh the data
      })
      .catch((error) => {
        console.error("Error updating memo:", error);
      });

    handleCloseEditDialog();
  };

  const handleOpenDeleteDialog = (memoId) => {
    setConfirmDeleteId(memoId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setConfirmDeleteId(null);
  };

  const handleDeleteMemo = () => {
    fetch(`http://localhost:8082/memos/deletememo/${confirmDeleteId}`, {
      method: "DELETE",
    })
      .then(() => {
        setSnackbarMessage("Memo deleted successfully");
        setSnackbarOpen(true);
        fetchData(); // Refresh the data
        handleCloseDeleteDialog();
      })
      .catch((error) => {
        console.error("Error deleting memo:", error);
      });
  };

  const fetchData = () => {
    const instituteCode = localStorage.getItem("institutecode");
    fetch(`http://localhost:8082/memos/all?institutecode=${instituteCode}`)
      .then((response) => response.json())
      .then((data) => {
        setMemos(data);
      })
      .catch((error) => {
        console.error("Error fetching memos:", error);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
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
        Memo List
      </Typography>
      <Grid>
      <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}
        >
                Total Memos: {memos.length}
                </Typography>
      </Grid>
      <TableContainer>
        <Table size="small" aria-label="exam table" sx={{ width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Memo ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Institute Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Memo Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action Required</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memos.map((memo) => (
              <TableRow key={memo.mid}>
                <TableCell>{memo.mid}</TableCell>
                <TableCell>{memo.createdAt}</TableCell>
                <TableCell>{memo.institutecode}</TableCell>
                <TableCell>{memo.memoName}</TableCell>
                <TableCell>{memo.memoDescription}</TableCell>
                <TableCell>{memo.email}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenEditDialog(memo)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(memo.mid)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Memo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Memo Name"
            type="text"
            value={selectedMemo?.memoName || ""}
            onChange={(e) =>
              setSelectedMemo({ ...selectedMemo, memoName: e.target.value })
            }
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            value={selectedMemo?.memoDescription || ""}
            onChange={(e) =>
              setSelectedMemo({
                ...selectedMemo,
                memoDescription: e.target.value,
              })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateMemo}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle color="blue" textAlign={"center"}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this Exam?</Typography>
          <Typography color="red" fontWeight={200} variant="body2">
            *On clicking Confirm, this Memo cannot be recovered
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteMemo} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}
