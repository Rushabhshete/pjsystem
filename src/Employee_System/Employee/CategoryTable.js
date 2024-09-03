import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit, Delete, Info } from '@mui/icons-material';
import { Modal, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { textAlign, styled } from '@mui/system';

function CategoryTable() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8082/categories/all?institutecode=${institutecode}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [institutecode]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowUpdateModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedCategory({ ...selectedCategory, [name]: value });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8082/categories/updateCategoryById/${selectedCategory.id}&institutecode=${institutecode}`, selectedCategory);
      setShowUpdateModal(false);
      await fetchData();
      setSelectedCategory(null);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
      toast.error('Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this category?");
    if (confirmation && id) {
      try {
        await axios.delete(`http://localhost:8082/categories/delete/employeecategory/${id}&institutecode=${institutecode}`);
        await fetchData();
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        setError('Failed to delete category');
        toast.error('Failed to delete category');
      }
    } else {
      console.error('Invalid id:', id);
    }
  };

  const handleInfo = (category) => {
    setSelectedCategory(category);
    setShowInfoModal(true);
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
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#24A0ED',
        borderRadius: '150px',
        padding: '10px',
        marginBottom: '-2px'
      }}
    >
      Category Table 
      </PopTypography>
    <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper} sx={{ width: '100%', maxWidth: '1200px', marginTop: "20px" }}>
        <Table>
          <TableHead  sx={{ background: '#f2f2f2'}}>
            <TableRow>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">ID</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">Category Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">Department</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">HRA Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">TA Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">Incentive Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">SPI Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">Medical Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">PF Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">ESF Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">Professional Tax Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">Income Tax Percentage</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight="bold">Total Paid Leaves</Typography></TableCell>
              <TableCell sx={{textAlign:'center'}}><Typography variant="subtitle2" fontWeight="bold">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell>{category.department}</TableCell>
                <TableCell>{category.hraPercentage}</TableCell>
                <TableCell>{category.taPercentage}</TableCell>
                <TableCell>{category.incentivePercentage}</TableCell>
                <TableCell>{category.spiPercentage}</TableCell>
                <TableCell>{category.medicalAllowancePercentage}</TableCell>
                <TableCell>{category.pfPercentage}</TableCell>
                <TableCell>{category.esfPercentage}</TableCell>
                <TableCell>{category.professionalTaxPercentage}</TableCell>
                <TableCell>{category.incomeTaxPercentage}</TableCell>
                <TableCell>{category.totalPaidLeave}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <IconButton onClick={() => handleInfo(category)}sx={{ color: 'green' }}>
                    <Info />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(category)}sx={{ color: 'blue' }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)}sx={{ color: 'red' }}>
                    <Delete />
                  </IconButton>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
      <PopTypography
      variant="h6"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#24A0ED',
        borderRadius: '150px',
        padding: '10px',
        marginRight:'150px',
        marginLeft:'150px',
        marginBottom: '-2px',
        marginTop:'10px'
      }}
    >
     Edit Category
      </PopTypography>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCategoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                value={selectedCategory?.categoryName || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formHraPercentage">
              <Form.Label>HRA Percentage</Form.Label>
              <Form.Control
                type="number"
                name="hraPercentage"
                value={selectedCategory?.hraPercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTaPercentage">
              <Form.Label>TA Percentage</Form.Label>
              <Form.Control
                type="number"
                name="taPercentage"
                value={selectedCategory?.taPercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formIncentivePercentage">
              <Form.Label>Incentive Percentage</Form.Label>
              <Form.Control
                type="number"
                name="incentivePercentage"
                value={selectedCategory?.incentivePercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSpiPercentage">
              <Form.Label>SPI Percentage</Form.Label>
              <Form.Control
                type="number"
                name="spiPercentage"
                value={selectedCategory?.spiPercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMedicalPercentage">
              <Form.Label>Medical Percentage</Form.Label>
              <Form.Control
                type="number"
                name="medicalAllowancePercentage"
                value={selectedCategory?.medicalAllowancePercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPfPercentage">
              <Form.Label>PF Percentage</Form.Label>
              <Form.Control
                type="number"
                name="pfPercentage"
                value={selectedCategory?.pfPercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEsfPercentage">
              <Form.Label>ESF Percentage</Form.Label>
              <Form.Control
                type="number"
                name="esfPercentage"
                value={selectedCategory?.esfPercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formProfessionalTaxPercentage">
              <Form.Label>Professional Tax Percentage</Form.Label>
              <Form.Control
                type="number"
                name="professionalTaxPercentage"
                value={selectedCategory?.professionalTaxPercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formIncomeTaxPercentage">
              <Form.Label>Income Tax Percentage</Form.Label>
              <Form.Control
                type="number"
                name="incomeTaxPercentage"
                value={selectedCategory?.incomeTaxPercentage || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTotalPaidLeave">
              <Form.Label>Total Paid Leave</Form.Label>
              <Form.Control
                type="number"
                name="totalPaidLeave"
                value={selectedCategory?.totalPaidLeave || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTotalUnpaidLeave">
              <Form.Label>Total Unpaid Leave</Form.Label>
              <Form.Control
                type="number"
                name="totalUnpaidLeave"
                value={selectedCategory?.totalUnpaidLeave || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)} style={{ marginRight: '10px' }}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Update
              </Button>
            </Box>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Info Modal */}
      <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
      <PopTypography
      variant="h6"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        backgroundColor: '#24A0ED',
        borderRadius: '150px',
        padding: '10px',
        marginRight:'150px',
        marginLeft:'150px',
        marginBottom: '-2px',
        marginTop:'10px'
      }}
    >
      Category Information
      </PopTypography>
        <Modal.Body>
          <Container>
            <Box mt={2}>
              <Typography><strong>ID:</strong> {selectedCategory?.id}</Typography>
              <Typography><strong>Category Name:</strong> {selectedCategory?.categoryName}</Typography>
              <Typography><strong>HRA Percentage:</strong> {selectedCategory?.hraPercentage}</Typography>
              <Typography><strong>TA Percentage:</strong> {selectedCategory?.taPercentage}</Typography>
              <Typography><strong>Incentive Percentage:</strong> {selectedCategory?.incentivePercentage}</Typography>
              <Typography><strong>SPI Percentage:</strong> {selectedCategory?.spiPercentage}</Typography>
              <Typography><strong>Medical Percentage:</strong> {selectedCategory?.medicalAllowancePercentage}</Typography>
              <Typography><strong>PF Percentage:</strong> {selectedCategory?.pfPercentage}</Typography>
              <Typography><strong>ESF Percentage:</strong> {selectedCategory?.esfPercentage}</Typography>
              <Typography><strong>Professional Tax Percentage:</strong> {selectedCategory?.professionalTaxPercentage}</Typography>
              <Typography><strong>Income Tax Percentage:</strong> {selectedCategory?.incomeTaxPercentage}</Typography>
              <Typography><strong>Total Paid Leaves:</strong> {selectedCategory?.totalPaidLeave}</Typography>
              <Typography><strong>Total Unpaid Leaves:</strong> {selectedCategory?.totalUnpaidLeave}</Typography>
            </Box>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInfoModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
    </>
  );
}

export default CategoryTable;