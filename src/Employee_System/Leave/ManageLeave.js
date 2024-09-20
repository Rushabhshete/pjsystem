
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Select, MenuItem, FormControl, Grid, useTheme, useMediaQuery, Typography
} from '@mui/material';
import { IconButton } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getAllLeaveRequests, updateLeaveRequestStatus, deleteLeaveRequest,
  last7DaysLeaves, last30DaysLeaves, last365DaysLeaves, rejectLeaveRequest
} from '../Leave/LeaveService'; // Ensure the correct import path

const ManageLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchLeaveRequests();
  }, [filter]);

  const fetchLeaveRequests = () => {
    let fetchFunction;

    switch (filter) {
      case 'last7Days':
        fetchFunction = last7DaysLeaves;
        break;
      case 'last30Days':
        fetchFunction = last30DaysLeaves;
        break;
      case 'last365Days':
        fetchFunction = last365DaysLeaves;
        break;
      case 'all':
      default:
        fetchFunction = getAllLeaveRequests;
    }

    fetchFunction()
      .then(response => {
        console.log('Fetched data:', response.data); // Debug log
        setLeaveRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching leave requests:', error);
      });
  };

  const handleUpdateStatus = (id, status) => {
    const selectedRequest = leaveRequests.find(request => request.id === id);
    const updatedRequest = { ...selectedRequest, status };
    updateLeaveRequestStatus(id, updatedRequest)
      .then(response => {
        setLeaveRequests(leaveRequests.map(request => request.id === response.data.id ? response.data : request));
      })
      .catch(error => console.error('Error updating leave request:', error));
  };

  const handleRejectStatus = (id) => {
    const selectedRequest = leaveRequests.find(request => request.id === id);
    const updatedRequest = { ...selectedRequest, status: 'Rejected' };
    rejectLeaveRequest(id, updatedRequest)
      .then(response => {
        setLeaveRequests(leaveRequests.map(request => request.id === response.data.id ? response.data : request));
      })
      .catch(error => console.error('Error rejecting leave request:', error));
  };

  const handleDeleteRequest = (id) => {
    // Display a confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this leave data?");
  
    if (confirmDelete) {
      // If the user confirms, proceed with the deletion
      deleteLeaveRequest(id)
        .then(() => {
          setLeaveRequests(leaveRequests.filter(request => request.id !== id));
        })
        .catch(error => console.error('Error deleting leave request:', error));
    }
  };
  
  return (
    <div style={{ padding: '20px', }}>
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
        Manage Leave
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="last7Days">Last 7 Days</MenuItem>
              <MenuItem value="last30Days">Last 30 Days</MenuItem>
              <MenuItem value="last365Days">Last Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{backgroundColor:'#f2f2f2'}}>
                <TableRow>
                  <TableCell sx={{fontWeight:'bold'}}>Name</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Employee ID</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Category Name</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>From Date</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>To Date</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Reason</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Status</TableCell>
                  <TableCell sx={{fontWeight:'bold'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map(request => (
                  <TableRow key={request.id}>
                    <TableCell>{request.fullName}</TableCell>
                    <TableCell>{request.empID}</TableCell>
                    <TableCell>{request.categoryName}</TableCell>
                    <TableCell>{request.fromDate}</TableCell>
                    <TableCell>{request.toDate}</TableCell>
                    <TableCell>{request.reasondescription}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                                          {/* Approve Button */}
                        <IconButton
                          aria-label="approve"
                          color="primary"
                          onClick={() => handleUpdateStatus(request.id, 'Approved')}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>

                        {/* Reject Button */}
                        <IconButton
                          aria-label="reject"
                          color="error"
                          onClick={() => handleRejectStatus(request.id)}
                        >
                          <HighlightOffIcon />
                        </IconButton>

                        {/* Delete Button */}
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => handleDeleteRequest(request.id)}
                        >
                          <DeleteIcon />
                        </IconButton>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default ManageLeave;
