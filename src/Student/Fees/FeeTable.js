import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField
} from '@mui/material';
import StandardService from './Userservices2';
//  import '../Css/Standardtable.css';

const Feetable = () => {
  const [standards, setStandards] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState({});
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    try {
      const response = await StandardService.getAllStandards();
      setStandards(response.data);
    } catch (error) {
      console.error('Error fetching standards:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedStandard({ ...selectedStandard, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await StandardService.updateStandard(selectedStandard.id, selectedStandard);
      setShowUpdateDialog(false);
      fetchStandards();
    } catch (error) {
      console.error('Error updating standard:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await StandardService.deleteStandard(id);
      fetchStandards();
    } catch (error) {
      console.error('Error deleting standard:', error);
    }
  };

  return (
    <div className="container3">
      <h2>Fees List</h2>
      <TableContainer component={Paper}>
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Tuition Fee</TableCell>
              <TableCell>Admission Fee</TableCell>
              <TableCell>Practical Fee</TableCell>
              <TableCell>Computer Class Fee</TableCell>
              <TableCell>Exam Fees</TableCell>
              <TableCell>Uniform Fee</TableCell>
              <TableCell>Transport Bus Fee</TableCell>
              <TableCell>Hostel Fee</TableCell>
              <TableCell>Building Fund Fee</TableCell>
              <TableCell>Library Fees</TableCell>
              <TableCell>Sports Fees</TableCell>
              <TableCell>GST</TableCell>
              {/* <TableCell>totalFeesAmount</TableCell> */}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standards.map((standard) => (
              <TableRow key={standard.id}>
                <TableCell>{standard.id}</TableCell>
                <TableCell>{standard.standard}</TableCell>
                <TableCell>{standard.tuitionFee}</TableCell>
                <TableCell>{standard.admissionFee}</TableCell>
                <TableCell>{standard.practicalFee}</TableCell>
                <TableCell>{standard.computerClassFee}</TableCell>
                <TableCell>{standard.examFees}</TableCell>
                <TableCell>{standard.uniformFee}</TableCell>
                <TableCell>{standard.transportBusFee}</TableCell>
                <TableCell>{standard.hostelFee}</TableCell>
                <TableCell>{standard.buildingFundFee}</TableCell>
                <TableCell>{standard.libraryFees}</TableCell>
                <TableCell>{standard.sportFees}</TableCell>
                <TableCell>{standard.gst}</TableCell>
                {/* <TableCell>{standard.totalFeesAmount}</TableCell> */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setSelectedStandard(standard);
                      setShowUpdateDialog(true);
                    }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(standard.id)}
                    style={{ marginTop: '10px' }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showUpdateDialog} onClose={() => setShowUpdateDialog(false)}  sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '90%' } }}>
        <DialogTitle>Update Fees</DialogTitle>
        <DialogContent>
          <form className="update-form">
            {[
              'standard', 'tuitionFee', 'admissionFee', 'practicalFee', 'computerClassFee',
              'examFees', 'uniformFee', 'transportBusFee', 'hostelFee', 'buildingFundFee',
              'libraryFees', 'sportFees', 'gst',
            ].map((key) => (
              <TextField
                key={key}
                margin="dense"
                label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                type="text"
                name={key}
                value={selectedStandard[key] || ''}
                onChange={handleInputChange}
                fullWidth
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateDialog(false)} color="primary">
            Close
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Feetable;
