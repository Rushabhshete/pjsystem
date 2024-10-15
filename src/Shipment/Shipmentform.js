// src/components/ShipmentForm.js
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

const ShipmentForm = () => {
  const [formData, setFormData] = useState({
    orderId: '',
    type: '',
    customerName: '',
    customerMobile: '',
    customerAddress: '',
    customerEmail: '',
    orderDate: '',
    dispatchDate: '',
    trackingNo: '',
    sentBy: '',
    vendorName: '',
    bookName: '',
    price: '',
    status: '',
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
    <div maxWidth="false" sx={{ padding: 2, width: "100%" }}>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Order ID"
                name="orderId"
                value={formData.orderId}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Customer Mobile"
                name="customerMobile"
                value={formData.customerMobile}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Customer Address"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Customer Email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                variant="outlined"
                type="email"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Order Date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Dispatch Date"
                name="dispatchDate"
                value={formData.dispatchDate}
                onChange={handleChange}
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tracking No"
                name="trackingNo"
                value={formData.trackingNo}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Sent By"
                name="sentBy"
                value={formData.sentBy}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Vendor Name"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                variant="outlined"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
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

export default ShipmentForm;
