import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderCollapse: 'collapse',
  '& th': {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: '10px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  '& td': {
    borderBottom: '1px solid #e0e0e0',
    padding: '10px',
    color: '#555',
  },
  '& tr:hover': {
    backgroundColor: '#f9f9f9',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const Type = () => {
  const [formData, setFormData] = useState({
    typeName: '',
    institutecode: 'MIT', // Hardcoded value as per your requirement
  });

  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.post(`http://localhost:8090/createType?institutecode=${formData.institutecode}`, {
        typeName: formData.typeName,
      });
      setFormData({ typeName: '', institutecode: 'MIT' });
      setSuccessMessage('Type created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchTypes();
    } catch (error) {
      setError(error.response ? error.response.data : 'An error occurred');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTypes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8090/getAllTypes', {
        params: { institutecode: 'MIT' },
      });
      if (Array.isArray(response.data)) {
        setTypes(response.data);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      setError(error.response ? error.response.data : 'An error occurred');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData({
      typeName: type.typeName,
      institutecode: type.institutecode,
    });
  };

  const handleUpdateType = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await axios.put(`http://localhost:8090/updateType/${selectedType.id}`, formData);
      setSelectedType(null);
      setFormData({ typeName: '', institutecode: 'MIT' });
      setSuccessMessage('Type updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchTypes();
    } catch (error) {
      setError(error.response ? error.response.data : 'An error occurred');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteType = async (id) => {
    if (window.confirm('Are you sure you want to delete this type?')) {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        await axios.delete(`http://localhost:8090/deleteType/${id}`);
        setSuccessMessage('Type deleted successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchTypes();
      } catch (error) {
        setError(error.response ? error.response.data : 'An error occurred');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      {isLoading && (
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </Box>
      )}
      <FormContainer>
        <Typography variant="h4" gutterBottom align="center">
          Type Management
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Add Type
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Type Name"
                name="typeName"
                value={formData.typeName}
                onChange={handleChange}
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Institute Code"
                name="institutecode"
                value={formData.institutecode}
                variant="outlined"
                disabled // Disabled since it's hardcoded
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
          Types
        </Typography>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Type Name</TableCell>
              <TableCell>Institute Code</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.typeName}</TableCell>
                <TableCell>{type.institutecode}</TableCell>
                <TableCell align="center">
                  <ActionButton
                    onClick={() => handleTypeSelect(type)}
                    variant="outlined"
                    color="primary"
                  >
                    Edit
                  </ActionButton>
                  <ActionButton
                    onClick={() => handleDeleteType(type.id)}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
        {selectedType && (
          <Grid container spacing={2} sx={{ marginTop: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Edit Type
              </Typography>
              <form onSubmit={handleUpdateType}>
                <TextField
                  fullWidth
                  label="Type Name"
                  name="typeName"
                  value={formData.typeName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
                <TextField
                  fullWidth
                  label="Institute Code"
                  name="institutecode"
                  value={formData.institutecode}
                  variant="outlined"
                  disabled // Disabled since it's hardcoded
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Update
                </Button>
              </form>
            </Grid>
          </Grid>
        )}
      </FormContainer>

      {/* Snackbar for success and error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarSeverity === 'error' ? error : successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Type;
