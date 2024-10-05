import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography, Container, Card, CardContent, MenuItem, Snackbar, SnackbarContent } from '@mui/material';
import axios from 'axios';
//import '../Css/Standardform.css';

const StandardForm = () => {
  const [formData, setFormData] = useState({
    tuitionFee: '',
    admissionFee: '',
    practicalFee: '',
    standard: '',
    medium: '',
    division: '',
    computerClassFee: '',
    examFees: '',
    uniformFee: '',
    transportBusFee: '',
    hostelFee: '',
    buildingFundFee: '',
    libraryFees: '',
    sportFees: '',
    gst: '',
    totalFeesAmount: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [mediums, setMediums] = useState([]);
  const institutecode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    fetchMediums();
  }, []);

  const fetchMediums = async () => {
    try {
      const response = await axios.get(`http://localhost:8083/getAllMediums?institutecode=${institutecode()}`);
      setMediums(response.data); // Assuming response.data is an array of mediums
    } catch (error) {
      console.error('Error fetching mediums:', error);
    }
  };

  const calculateTotalFees = (updatedData) => {
    return (
      parseFloat(updatedData.tuitionFee || 0) +
      parseFloat(updatedData.admissionFee || 0) +
      parseFloat(updatedData.practicalFee || 0) +
      parseFloat(updatedData.computerClassFee || 0) +
      parseFloat(updatedData.examFees || 0) +
      parseFloat(updatedData.uniformFee || 0) +
      parseFloat(updatedData.transportBusFee || 0) +
      parseFloat(updatedData.hostelFee || 0) +
      parseFloat(updatedData.buildingFundFee || 0) +
      parseFloat(updatedData.libraryFees || 0) +
      parseFloat(updatedData.sportFees || 0) +
      parseFloat(updatedData.gst || 0)
    ).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      };
      return {
        ...updatedData,
        totalFeesAmount: calculateTotalFees(updatedData)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8083/saveStandered?institutecode=${institutecode()}`, formData);
      console.log('Form submitted successfully:', response.data);
      setSnackbarMessage('Form submitted successfully');
      setOpenSnackbar(true);
      // Optionally, you can reset the form after successful submission
      setFormData({
        tuitionFee: '',
        admissionFee: '',
        practicalFee: '',
        standard: '',
        medium: '',
        division: '',
        computerClassFee: '',
        examFees: '',
        uniformFee: '',
        transportBusFee: '',
        hostelFee: '',
        buildingFundFee: '',
        libraryFees: '',
        sportFees: '',
        gst: '',
        totalFeesAmount: ''
      });
    } catch (error) {
      console.error('Error submitting the form:', error);
      setSnackbarMessage('Error submitting the form');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" align="center" gutterBottom>
              Fees Form
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Standard"
                  name="standard"
                  value={formData.standard}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Medium"
                  name="medium"
                  value={formData.medium}
                  onChange={handleChange}
                  variant="outlined"
                  required
                >
                  {mediums.map((medium) => (
                    <MenuItem key={medium.mediumID} value={medium.mediumName}>
                      {medium.mediumName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tuition Fee"
                  name="tuitionFee"
                  type="number"
                  value={formData.tuitionFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Admission Fee"
                  name="admissionFee"
                  type="number"
                  value={formData.admissionFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Practical Fee"
                  name="practicalFee"
                  type="number"
                  value={formData.practicalFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Computer Class Fee"
                  name="computerClassFee"
                  type="number"
                  value={formData.computerClassFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Exam Fees"
                  name="examFees"
                  type="number"
                  value={formData.examFees}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Uniform Fee"
                  name="uniformFee"
                  type="number"
                  value={formData.uniformFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Transport Bus Fee"
                  name="transportBusFee"
                  type="number"
                  value={formData.transportBusFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Hostel Fee"
                  name="hostelFee"
                  type="number"
                  value={formData.hostelFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Building Fund Fee"
                  name="buildingFundFee"
                  type="number"
                  value={formData.buildingFundFee}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Library Fees"
                  name="libraryFees"
                  type="number"
                  value={formData.libraryFees}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Sport Fees"
                  name="sportFees"
                  type="number"
                  value={formData.sportFees}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="GST"
                  type="number"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Total Fees Amount"
                  type="number"
                  name="totalFeesAmount"
                  value={formData.totalFeesAmount}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          style={{ backgroundColor: 'orange' }}
          message={snackbarMessage}
        />
      </Snackbar>
    </Container>
  );
};

export default StandardForm;
