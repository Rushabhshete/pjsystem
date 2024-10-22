import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, FormControl, Grid, TextField, Typography, IconButton
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getAllLeaveRequests, updateLeaveRequestStatus, deleteLeaveRequest,
  last7DaysLeaves, last30DaysLeaves, last365DaysLeaves, rejectLeaveRequest,
  getLeaveRequestsByCustomDate
} from '../Leave/LeaveService'; // Ensure the correct import path

const ManageLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDateFields, setShowCustomDateFields] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, [filter, startDate, endDate]);

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
      case 'customDate':
        if (startDate && endDate) {
          fetchFunction = () => getLeaveRequestsByCustomDate(startDate, endDate);
        } else {
          return; // Don't fetch if startDate or endDate is empty
        }
        break;
      case 'all':
      default:
        fetchFunction = getAllLeaveRequests;
    }

    fetchFunction()
      .then(response => {
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
    const confirmDelete = window.confirm("Are you sure you want to delete this leave data?");
  
    if (confirmDelete) {
      deleteLeaveRequest(id)
        .then(() => {
          setLeaveRequests(leaveRequests.filter(request => request.id !== id));
        })
        .catch(error => console.error('Error deleting leave request:', error));
    }
  };  

  const handleFilterChange = (value) => {
    setFilter(value);
    setShowCustomDateFields(value === 'customDate');
  };

  // // Filtered leave requests based on the search term, category, and status
  // const filteredLeaveRequests = leaveRequests.filter(request => 
  //   request.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //   (categoryFilter === '' || request.categoryName === categoryFilter) &&
  //   (statusFilter === '' || request.status === statusFilter)
  // );

    // Filtered leave requests based on the search term, category, and status
const filteredLeaveRequests = leaveRequests.filter(request => 
  (request.fullName && request.fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
  (categoryFilter === '' || request.categoryName === categoryFilter) &&
  (statusFilter === '' || request.status === statusFilter)
);


  // Get unique category names for the category filter
  const uniqueCategories = Array.from(new Set(leaveRequests.map(request => request.categoryName)));

  return (
    <>
    {/* <Typography
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
  </Typography> */}
    <div style={{ padding: '20px' }}>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }} className='textField-root'>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <TextField
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              select 
              label="Select"
              size='small'
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="last7Days">Last 7 Days</MenuItem>
              <MenuItem value="last30Days">Last 30 Days</MenuItem>
              <MenuItem value="last365Days">Last Year</MenuItem>
              <MenuItem value="customDate">Custom Date</MenuItem>
            </TextField>
          </FormControl>
        </Grid>

        {showCustomDateFields && (
          <>
            <Grid item xs={3}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                size='small'
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                size='small'
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
          </>
        )}

        <Grid item xs={3}>
          <FormControl fullWidth>
            <TextField
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              displayEmpty
              select 
              size='small'
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {uniqueCategories.map((category, index) => (
                <MenuItem key={index} value={category}>{category}</MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        
        <Grid item xs={3}>
          <FormControl fullWidth>
            <TextField
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              select
              size='small'
              label="Status"
            >
               <MenuItem value="">All Statuses</MenuItem>
               <MenuItem value="Approved">Approved</MenuItem>
               <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Search by Full Name"
            variant="outlined"
            size='small'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <TableContainer >
          <Table className='table-root'>
            <TableHead >
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>From Date</TableCell>
                <TableCell>To Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeaveRequests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>{request.empID}</TableCell>
                  <TableCell>{request.fullName}</TableCell>
                  <TableCell>{request.categoryName}</TableCell>
                  <TableCell>{request.fromDate}</TableCell>
                  <TableCell>{request.toDate}</TableCell>
                  <TableCell>{request.reasondescription}</TableCell>
                  <TableCell sx={{
          fontWeight: 'bold',
          color: request.status === 'Approved' ? '#90ee90' : 
          request.status === 'Pending' ? 'orange' : 
          request.status === 'Rejected' ? 'red' : 'inherit',
        }}>{request.status}</TableCell>
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
    </div>
    </>
  );
};

export default ManageLeave;