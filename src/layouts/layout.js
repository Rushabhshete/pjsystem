import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';
import {Box,Typography} from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flexGrow: 1, mt: '40px' }}>
        <Sidebar />
        <Box component="main" sx={{flexGrow: 1, p: 3}}>
    
            <Outlet /> {/* This will render the nested routes */}
            <Typography variant="body2" align="center" sx={{ marginTop: 5 }}>
  Pjsofttech Pvt. Ltd.{' '}
  <Typography component="span" variant="body2" sx={{ color: 'red' }}>
  © All Rights Reserved
  </Typography>
</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
  