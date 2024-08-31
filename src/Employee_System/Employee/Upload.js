
import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Container, FormHelperText, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Upload = ({ email, setFormData }) => {
  const [localFormData, setLocalFormData] = useState({
    idProofFile: null,
    resumeFile: null,
    addressProofFile: null,
    empFile: null,
    experienceLetterFile: null,
  });

  const [imagePreviewUrlEmp, setImagePreviewUrlEmp] = useState(null);
  const [imagePreviewUrlIdProof, setImagePreviewUrlIdProof] = useState(null);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fileTypeMapping = {
    empFile: 'Employee Photo',
    idProofFile: 'ID Proof',
    resumeFile: 'Resume',
    addressProofFile: 'Address Proof',
    experienceLetterFile: 'Experience Letter'
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    const selectedFile = files[0];
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

    if (name === 'resumeFile' || name === 'addressProofFile' || name === 'experienceLetterFile') {
      if (selectedFile) {
        if (selectedFile.type === 'application/pdf') {
          if (selectedFile.size <= MAX_FILE_SIZE) {
            setLocalFormData((prevData) => ({
              ...prevData,
              [name]: selectedFile
            }));
            setError("");
          } else {
            e.target.value = null;
            setError('The selected file exceeds the size limit of 1 MB.');
            setSnackbar({ open: true, message: 'The selected file exceeds the size limit of 1 MB.', severity: 'error' });
          }
        } else {
          e.target.value = null;
          setError('Please select a PDF file for Resume, Address Proof, and Experience Letter.');
          setSnackbar({ open: true, message: 'Please select a PDF file for Resume, Address Proof, and Experience Letter.', severity: 'error' });
        }
      }
    } else if (name === 'empFile' || name === 'idProofFile') {
      if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg')) {
        setLocalFormData((prevData) => ({
          ...prevData,
          [name]: selectedFile
        }));
        if (name === 'empFile') {
          setImagePreviewUrlEmp(URL.createObjectURL(selectedFile));
        } else if (name === 'idProofFile') {
          setImagePreviewUrlIdProof(URL.createObjectURL(selectedFile));
        }
        setError("");
      } else {
        e.target.value = null;
        setError('Please select a JPEG file.');
        setSnackbar({ open: true, message: 'Please select a JPEG file.', severity: 'error' });
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: URL.createObjectURL(selectedFile)
    }));
  };

  const handleUpload = async (type) => {
    const uploadEndpoints = {
      idProofFile: `http://localhost:8082/${email}/uploadIdProof`,
      resumeFile: `http://localhost:8082/${email}/uploadResume`,
      addressProofFile: `http://localhost:8082/${email}/uploadAddressProof`,
      empFile: `http://localhost:8082/${email}/uploadImage`,
      experienceLetterFile: `http://localhost:8082/${email}/uploadExperienceLetter`
    };

    const file = localFormData[type];
    if (!file) {
      setError(`No file selected for ${fileTypeMapping[type]}.`);
      setSnackbar({ open: true, message: `No file selected for ${fileTypeMapping[type]}.`, severity: 'error' });
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append(type, file);

    try {
      console.log(`Uploading ${fileTypeMapping[type]} to ${uploadEndpoints[type]}`);
      const response = await axios.post(uploadEndpoints[type], uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds
      });
      console.log(`${fileTypeMapping[type]} uploaded successfully`, response.data);
      setSnackbar({ open: true, message: `${fileTypeMapping[type]} uploaded successfully`, severity: 'success' });
      setError("");
    } catch (error) {
      console.error(`Error uploading ${fileTypeMapping[type]}`, error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      setError(`Error uploading ${fileTypeMapping[type]}. Please try again.`);
      setSnackbar({ open: true, message: `Error uploading ${fileTypeMapping[type]}. Please try again.`, severity: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography variant="h5" component="h3" gutterBottom style={{marginBottom:'30px'}}>
        Document Uploads
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".jpeg"
              name="empFile"
              onChange={handleChange}
              helperText="Employee Photo (JPEG, max 1MB)"
            />
            {imagePreviewUrlEmp && (
              <img src={imagePreviewUrlEmp} alt="Employee" style={{ marginTop: '10px', width: '100px', height: '80px', marginBottom: '10px' }} />
            )}
            <br/>
            <Button variant="contained" color="primary" onClick={() => handleUpload('empFile')} style={{}}>
              Upload
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".jpeg"
              name="idProofFile"
              onChange={handleChange}
              helperText="ID Proof (JPEG, max 1MB)"
            />
            {imagePreviewUrlIdProof && (
              <img src={imagePreviewUrlIdProof} alt="ID Proof" style={{ marginTop: '10px', width: '100px', height: '80px', marginBottom: '10px' }} />
            )}
            <br/>
            <Button variant="contained" color="primary" onClick={() => handleUpload('idProofFile')}>
              Upload
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".pdf"
              name="resumeFile"
              onChange={handleChange}
              helperText="Resume (PDF, max 1MB)"
            />
            <Button variant="contained" color="primary" onClick={() => handleUpload('resumeFile')}>
              Upload
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".pdf"
              name="addressProofFile"
              onChange={handleChange}
              helperText="Address Proof (PDF, max 1MB)"
            />
            <Button variant="contained" color="primary" onClick={() => handleUpload('addressProofFile')} >
              Upload
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".pdf"
              name="experienceLetterFile"
              onChange={handleChange}
              helperText="Experience Letter (PDF, max 1MB)"
            />
            <Button variant="contained" color="primary" onClick={() => handleUpload('experienceLetterFile')} >
              Upload
            </Button>
          </Grid>
        </Grid>
      </form>
      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Container>
  );
};

export default Upload;
