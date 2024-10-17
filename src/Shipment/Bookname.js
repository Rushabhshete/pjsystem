// src/components/BookName.js
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff', // White background for the form
}));

const BookName = () => {
  const [formData, setFormData] = useState({
    bookName: '',
    institutecode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log(formData);
  };

  return (
    <div>
      <FormContainer>
        <Typography variant="h4" gutterBottom align="center">
          Add Book Name
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Book Name"
                name="bookName"
                value={formData.bookName}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Institute Code"
                name="institutecode"
                value={formData.institutecode}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormContainer>
    </div>
  );
};

export default BookName;
