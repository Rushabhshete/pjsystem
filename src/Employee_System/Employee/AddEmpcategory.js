import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, Typography, Grid, InputAdornment, MenuItem, FormControl } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { styled } from '@mui/system';
function Category() {
  const [departments, setDepartments] = useState([]);
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

  
  useEffect(() => {
    fetchDepartments();
  }, [institutecode]);


  
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Handle error fetching departments (e.g., show error message)
    }
  };

  const [formData, setFormData] = useState({
    categoryName: '',
    department:'',
    bonusPercentage: '',
    hraPercentage: '',
    taPercentage: '',
    incentivePercentage: '',
    spiPercentage: '',
    medicalAllowancePercentage: '',
    pfPercentage: '',
    esfPercentage: '',
    professionalTaxPercentage: '',
    incomeTaxPercentage: '',
    totalPaidLeave:'',
    totalUnpaidLeave:''
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8082/categories/addEmployeeCategory?institutecode=${institutecode}`, formData);
      console.log('Form submitted successfully:', response.data);
      toast.success('Form submitted successfully'); // Show success toast
    } catch (error) {
      console.error('Error submitting the form:', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
        console.log('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      console.log('Error config:', error.config);
      toast.error('Failed to submit form'); // Show error toast
    }
  };

  const PopTypography = styled(Typography)`
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  animation: pop 2s ease;
`;
  return (
    <>
     <PopTypography
      variant="h5"
      gutterBottom
      sx={{
        marginRight:'110px',
        marginLeft:'110px',
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#24A0ED',
        borderRadius: '150px',
        padding: '10px',
        marginBottom: '-2px'
      }}
    >
      Add Employee Category 
      </PopTypography>
    <Container maxWidth="md" className='textField-root' sx={{border:"1px solid grey", width:"fit-content", marginTop:"30px" , padding:"20px" }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Category Name"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <TextField
              required
              name="department"
              value={formData.department}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              label="Department"
              select
            >
              {departments.map((option) => (
                <MenuItem key={option.id} value={option.department}>
                  {option.department}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="HRA Percentage"
              name="hraPercentage"
              type="number"
              value={formData.hraPercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="TA Percentage"
              name="taPercentage"
              type="number"
              value={formData.taPercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Incentive Percentage"
              name="incentivePercentage"
              type="number"
              value={formData.incentivePercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="SPI Percentage"
              name="spiPercentage"
              type="number"
              value={formData.spiPercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Medical Percentage"
              name="medicalAllowancePercentage"
              type="number"
              value={formData.medicalAllowancePercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="PF Percentage"
              name="pfPercentage"
              type="number"
              value={formData.pfPercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="ESF Percentage"
              name="esfPercentage"
              type="number"
              value={formData.esfPercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Professional Tax Percentage"
              name="professionalTaxPercentage"
              type="number"
              value={formData.professionalTaxPercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Income Tax Percentage"
              name="incomeTaxPercentage"
              type="number"
              value={formData.incomeTaxPercentage}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Total Paid Leaves"
              name="totalPaidLeave"
              type="number"
              value={formData.totalPaidLeave}
              onChange={handleChange}
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sx={{marginLeft:'380px'}}>
            <Box display="flex" justifyContent="space-between">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Container>
    </>
  );
}
export default Category;