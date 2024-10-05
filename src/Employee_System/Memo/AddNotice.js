import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AddNotice() {
  const [noticeName, setNoticeName] = useState('');
  const [noticeDescription, setNoticeDescription] = useState('');
  const [notices, setNotices] = useState([]);
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().split('T')[0]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const institutecode = localStorage.getItem("institutecode")
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/notices/getallByInstitutecode?institutecode=${institutecode}`);
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // New function to convert notices to CSV and trigger download
  const downloadCSV = () => {
    const csvRows = [];
    const headers = ['Notice ID', 'Notice Name', 'Description', 'Created At'];
    csvRows.push(headers.join(','));

    // Add the data rows
    notices.forEach(notice => {
      const values = [notice.nid, notice.noticeName, notice.noticeDescription, notice.createdAt];
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'notices.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddNotice = async () => {
    const newNotice = { noticeName, noticeDescription, createdAt, institutecode };

    try {
      await axios.post(`http://localhost:8082/notices/addnotice?institutecode=${institutecode}`, newNotice);
      toast.success("Notice sent successfully!");
      fetchNotices(); // Refresh the notice list
      setNoticeName('');
      setNoticeDescription('');
    } catch (error) {
      console.error("Error creating notice:", error);
      toast.error("Failed to send notice.");
    }
  };

  const handleDeleteNotice = async () => {
    if (noticeToDelete) {
      try {
        await axios.delete(`http://localhost:8082/notices/deleteNotice/${noticeToDelete}`);
        toast.success("Notice deleted successfully!");
        fetchNotices(); // Refresh the notice list
        setOpenConfirmDialog(false);
        setNoticeToDelete(null);
      } catch (error) {
        console.error("Error deleting notice:", error);
        toast.error("Failed to delete notice.");
      }
    }
  };

  const handleEditNotice = (notice) => {
    setSelectedNotice(notice);
    setNoticeName(notice.noticeName);
    setNoticeDescription(notice.noticeDescription);
    setCreatedAt(notice.createdAt.split('T')[0]);
    setOpenEditDialog(true);
  };

  const handleUpdateNotice = async () => {
    const updatedNotice = { id: selectedNotice.nid, noticeName, noticeDescription, createdAt, institutecode };

    try {
      await axios.put(`http://localhost:8082/notices/updateNotice/${selectedNotice.nid}`, updatedNotice);
      toast.success("Notice updated successfully!");
      fetchNotices(); // Refresh the notice list
      setOpenEditDialog(false);
      setSelectedNotice(null);
      setNoticeName('');
      setNoticeDescription('');
    } catch (error) {
      console.error("Error updating notice:", error);
      toast.error("Failed to update notice.");
    }
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedNotice(null);
  };

  const openConfirmDialogBox = (id) => {
    setNoticeToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setNoticeToDelete(null);
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
        Add Notice
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          label="Notice Name"
          value={noticeName}
          onChange={(e) => setNoticeName(e.target.value)}
          fullWidth
          margin="normal"
          size="small"
        />
        <TextField
          label="Notice Description"
          value={noticeDescription}
          onChange={(e) => setNoticeDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          size="small"
        />
        <TextField
          label="Created At"
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          fullWidth
          margin="normal"
          size="small"
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddNotice} sx={{ mr: 2 }}>
          Send Notice
        </Button>
        <Button variant="contained" color="secondary" onClick={downloadCSV} sx={{ mr: 2 }}>
          Download CSV
        </Button>
        <Typography>Total Notices: {notices.length}</Typography>
      </Box>

      <TableContainer sx={{ marginTop: '1%' }}>
        <Table size="small" aria-label="exam table" sx={{ width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Notice ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Notice Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notices.map((notice) => (
              <TableRow key={notice.nid}>
                <TableCell>{notice.nid}</TableCell>
                <TableCell>{notice.noticeName}</TableCell>
                <TableCell>{notice.noticeDescription}</TableCell>
                <TableCell>{notice.createdAt}</TableCell>
                <TableCell>
                  <ButtonGroup>
                    <IconButton
                      onClick={() => handleEditNotice(notice)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => openConfirmDialogBox(notice.nid)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Notice</DialogTitle>
        <DialogContent>
          <TextField
            label="Notice Name"
            value={noticeName}
            onChange={(e) => setNoticeName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Notice Description"
            value={noticeDescription}
            onChange={(e) => setNoticeDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Created At"
            type="date"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
          <Button onClick={handleUpdateNotice} color="secondary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this notice?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">Cancel</Button>
          <Button onClick={handleDeleteNotice} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
}
