import React, { useEffect, useState } from 'react';
import { Table, TableBody,  Container, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel, Box, Grid, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import UserService from "./UserService";
//import '../Css/Datatable.css';

const Datatable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [error, setError] = useState('');
  // const [searchTerm, setSearchTerm] = useState('');
  // const [formData, setFormData] = useState({
  //   registrationDate: '',
  // });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserById = async (id) => {
    try {
      const response = await UserService.getUserById(id);
      setSelectedUser(response.data);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this row?");
    if (confirmation) {
      try {
        await UserService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleUpdate = async (id) => {
    if (selectedUser) {
      try {
        await UserService.updateUser(selectedUser.id, selectedUser);
        await fetchUsers();
        setShowUpdateModal(false);
        setShowInfoModal(false);
        setSelectedUser(null);
      } catch (error) {
        setError('Error updating user: ' + error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleShowInfo = async (id) => {
    try {
      const response = await UserService.getUserById(id);
      setSelectedUser(response.data);
      setShowInfoModal(true);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
    }
  };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  return (
    <div className="container1">
      <div className="headertable1">
        <h2>Fees Invoice List</h2>
      </div>
      <br /><br/>
      <TableContainer component={Paper}>
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Medium</TableCell>
              <TableCell>Division</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Total Fees Amount</TableCell>
              <TableCell>Pending Fees Amount</TableCell>
              <TableCell>Fees Status</TableCell>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.standard}</TableCell>
                <TableCell>{user.medium}</TableCell>
                <TableCell>{user.division}</TableCell>
                <TableCell>{user.studentName}</TableCell>
                <TableCell>{user.rollNo}</TableCell>
                <TableCell>{user.feesAmount}</TableCell>
                <TableCell>{user.totalFeesAmount}</TableCell>
                <TableCell>{user.pendingFeesAmount}</TableCell>
                <TableCell>{user.feesStatus}</TableCell>
                <TableCell>{user.transactionId}</TableCell>
                <TableCell>
                  <Button variant="contained" color="info" onClick={() => handleShowInfo(user.id)}>Info</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Modal */}
      {selectedUser && (
         <Container maxWidth="sm">
        <Modal open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <Box sx={{ ...modalStyle }}>
            <h2>Update User</h2>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <TextField
                  label="Standard"
                  name="standard"
                  value={selectedUser.standard}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Medium</InputLabel>
                  <Select
                    name="medium"
                    value={selectedUser.medium}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Marathi">Marathi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Division</InputLabel>
                  <Select
                    name="division"
                    value={selectedUser.division}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Student Name"
                  name="studentName"
                  value={selectedUser.studentName}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Roll No"
                  name="rollNo"
                  value={selectedUser.rollNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Tuition Fee"
                  name="tuitionFee"
                  type="number"
                  value={selectedUser.tuitionFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Practical Fee"
                  name="practicalFee"
                  type="number"
                  value={selectedUser.practicalFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Admission Fee"
                  name="admissionFee"
                  type="number"
                  value={selectedUser.admissionFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Exam Fees"
                  name="examFees"
                  type="number"
                  value={selectedUser.examFees}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Uniform Fee"
                  name="uniformFee"
                  type="number"
                  value={selectedUser.uniformFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Transport Bus Fee"
                  name="transportBusFee"
                  type="number"
                  value={selectedUser.transportBusFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Hostel Fee"
                  name="hostelFee"
                  type="number"
                  value={selectedUser.hostelFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Building Fund Fee"
                  name="buildingFundFee"
                  type="number"
                  value={selectedUser.buildingFundFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Computer Class Fee"
                  name="computerClassFee"
                  type="number"
                  value={selectedUser.computerClassFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Library Fees"
                  name="libraryFees"
                  type="number"
                  value={selectedUser.libraryFees}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Sport Fees"
                  name="sportFees"
                  type="number"
                  value={selectedUser.sportFees}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Late Fee Charges"
                  name="lateFeeCharges"
                  type="number"
                  value={selectedUser.lateFeeCharges}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Total Fees Amount"
                  name="totalFeesAmount"
                  type="number"
                  value={selectedUser.totalFeesAmount}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Discount"
                  name="discount"
                  type="number"
                  value={selectedUser.discount}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Discounted Amount"
                  name="discountedAmount"
                  type="number"
                  value={selectedUser.discountedAmount}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="GST%"
                  name="gst"
                  type="number"
                  value={selectedUser.gst}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="GST Amount"
                  name="GSTAmount"
                  type="number"
                  value={selectedUser.GSTAmount}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Net Fee Amount"
                  name="netfeeamount"
                  type="number"
                  value={selectedUser.netfeeamount}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Paid Amount"
                  name="feesAmount"
                  type="number"
                  value={selectedUser.feesAmount}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Pending Fees Amount"
                  name="pendingFeesAmount"
                  type="number"
                  value={selectedUser.pendingFeesAmount}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Fees Status</InputLabel>
                  <Select
                    name="feesStatus"
                    value={selectedUser.feesStatus}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Complete">Complete</MenuItem>
                    <MenuItem value="Incomplete">Incomplete</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth>
                  <InputLabel>Fees Collection Type</InputLabel>
                  <Select
                    name="feesCollectionType"
                    value={selectedUser.feesCollectionType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Transaction ID"
                  name="transactionId"
                  value={selectedUser.transactionId}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Payment Date"
                  type="date"
                  name="registrationDate"
                  value={selectedUser.registrationDate}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="GST No"
                  name="gstNo"
                  value={selectedUser.gstNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            {error && <div className="error">{error}</div>}
            <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
            <Button variant="contained" color="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
          </Box>
        </Modal>
        </Container>
      )}

      {/* Info Modal */}
      {selectedUser && (
        <Dialog open={showInfoModal} onClose={() => setShowInfoModal(false)}>
          <DialogTitle>Student Information</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Standard:</strong> {selectedUser.standard}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Medium:</strong> {selectedUser.medium}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Division:</strong> {selectedUser.division}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Student Name:</strong> {selectedUser.studentName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Roll No:</strong> {selectedUser.rollNo}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Tuition Fee:</strong> {selectedUser.tuitionFee}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Practical Fee:</strong> {selectedUser.practicalFee}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Admission Fee:</strong> {selectedUser.admissionFee}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Exam Fees:</strong> {selectedUser.examFees}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Uniform Fee:</strong> {selectedUser.uniformFee}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Transport Bus Fee:</strong> {selectedUser.transportBusFee}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Hostel Fee:</strong> {selectedUser.hostelFee}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Building Fund Fee:</strong> {selectedUser.buildingFundFee}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Library Fees:</strong> {selectedUser.libraryFees}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Sport Fees:</strong> {selectedUser.sportFees}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Late Fee Charges:</strong> {selectedUser.lateFeeCharges}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Total Fees Amount:</strong> {selectedUser.totalFeesAmount}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Discount:</strong> {selectedUser.discount}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Discounted Amount:</strong> {selectedUser.discountedAmount}</Typography>
              </Grid>
              {/* <Grid item xs={12}>
          <Typography variant="body1"><strong>GST%:</strong> {selectedUser.gst}</Typography>
        </Grid> */}
        <Grid item xs={12}>
          <Typography variant="body1"><strong>GST Amount:</strong> {selectedUser.gstamount}</Typography>
        </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Net Fee Amount:</strong> {selectedUser.netfeeamount}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Paid Amount:</strong> {selectedUser.feesAmount}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Pending Fees Amount:</strong> {selectedUser.pendingFeesAmount}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Fees Status:</strong> {selectedUser.feesStatus}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Fees Collection Type:</strong> {selectedUser.feesCollectionType}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Transaction ID:</strong> {selectedUser.transactionId}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>GST No:</strong> {selectedUser.gstNo}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1"><strong>Payment Date:</strong> {selectedUser.registrationDate}</Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowInfoModal(false)} color="secondary">Close</Button>
            <Button onClick={() => fetchUserById(selectedUser.id)} color="primary">Update</Button>
            <Button onClick={() => handleDelete(selectedUser.id)} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Datatable;
