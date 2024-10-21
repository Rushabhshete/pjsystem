// import React, { useState } from 'react';
// import { Button, TextField, Typography, Grid, Container, FormHelperText, Snackbar, Alert } from '@mui/material';
// import axios from 'axios';

// const Upload = ({ email, setFormData }) => {
//   const [localFormData, setLocalFormData] = useState({
//     idProof: null,
//     resume: null,
//     addressProof: null,
//     employeePhoto: null,
//     experienceLetter: null,
//   });

//   const [imagePreviewUrlEmp, setImagePreviewUrlEmp] = useState(null);
//   const [imagePreviewUrlIdProof, setImagePreviewUrlIdProof] = useState(null);
//   const [error, setError] = useState("");
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//   const fileTypeMapping = {
//     employeePhoto: 'Employee Photo',
//     idProof: 'ID Proof',
//     resume: 'Resume',
//     addressProof: 'Address Proof',
//     experienceLetter: 'Experience Letter'
//   };

//   const handleChange = (e) => {
//     const { name, files } = e.target;
//     const selectedFile = files[0];
//     const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

//     if (name === 'resume' || name === 'addressProof' || name === 'experienceLetter') {
//       if (selectedFile) {
//         if (selectedFile.type === 'application/pdf') {
//           if (selectedFile.size <= MAX_FILE_SIZE) {
//             setLocalFormData((prevData) => ({
//               ...prevData,
//               [name]: selectedFile
//             }));
//             setError("");
//           } else {
//             e.target.value = null;
//             setError('The selected file exceeds the size limit of 1 MB.');
//             setSnackbar({ open: true, message: 'The selected file exceeds the size limit of 1 MB.', severity: 'error' });
//           }
//         } else {
//           e.target.value = null;
//           setError('Please select a PDF file for Resume, Address Proof, and Experience Letter.');
//           setSnackbar({ open: true, message: 'Please select a PDF file for Resume, Address Proof, and Experience Letter.', severity: 'error' });
//         }
//       }
//     } else if (name === 'employeePhoto' || name === 'idProof') {
//       if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg')) {
//         setLocalFormData((prevData) => ({
//           ...prevData,
//           [name]: selectedFile
//         }));
//         if (name === 'employeePhoto') {
//           setImagePreviewUrlEmp(URL.createObjectURL(selectedFile));
//         } else if (name === 'idProof') {
//           setImagePreviewUrlIdProof(URL.createObjectURL(selectedFile));
//         }
//         setError("");
//       } else {
//         e.target.value = null;
//         setError('Please select a JPEG file.');
//         setSnackbar({ open: true, message: 'Please select a JPEG file.', severity: 'error' });
//       }
//     }
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: URL.createObjectURL(selectedFile)
//     }));
//   };

//   const handleUpload = async (type) => {
//     const uploadEndpoints = {
//       idProof: `http://localhost:8082/${email}/uploadIdProof`,
//       resume: `http://localhost:8082/${email}/uploadResume`,
//       addressProof: `http://localhost:8082/${email}/uploadAddressProof`,
//       employeePhoto: `http://localhost:8082/${email}/uploadImage`,
//       experienceLetter: `http://localhost:8082/${email}/uploadExperienceLetter`
//     };

//     const file = localFormData[type];
//     if (!file) {
//       setError(`No file selected for ${fileTypeMapping[type]}.`);
//       setSnackbar({ open: true, message: `No file selected for ${fileTypeMapping[type]}.`, severity: 'error' });
//       return;
//     }

//     const uploadFormData = new FormData();
//     uploadFormData.append(type, file);

//     try {
//       console.log(`Uploading ${fileTypeMapping[type]} to ${uploadEndpoints[type]}`);
//       const response = await axios.post(uploadEndpoints[type], uploadFormData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         timeout: 60000, // 60 seconds
//       });
//       console.log(`${fileTypeMapping[type]} uploaded successfully`, response.data);
//       setSnackbar({ open: true, message: `${fileTypeMapping[type]} uploaded successfully`, severity: 'success' });
//       setError("");
//     } catch (error) {
//       console.error(`Error uploading ${fileTypeMapping[type]}`, error);
//       if (error.response) {
//         console.error("Error response data:", error.response.data);
//         console.error("Error response status:", error.response.status);
//         console.error("Error response headers:", error.response.headers);
//       }
//       setError(`Error uploading ${fileTypeMapping[type]}. Please try again.`);
//       setSnackbar({ open: true, message: `Error uploading ${fileTypeMapping[type]}. Please try again.`, severity: 'error' });
//     }
//   };

//   return (
//     <Container component="main" maxWidth="md">
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//       <Typography variant="h5" component="h3" gutterBottom style={{marginBottom:'30px'}}>
//         Document Uploads
//       </Typography>
//       <form>
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               required
//               type="file"
//               accept=".jpeg"
//               name="employeePhoto"
//               onChange={handleChange}
//               helperText="Employee Photo (JPEG, max 1MB)"
//             />
//             {imagePreviewUrlEmp && (
//               <img src={imagePreviewUrlEmp} alt="Employee" style={{ marginTop: '10px', width: '100px', height: '80px', marginBottom: '10px' }} />
//             )}
//             <br/>
//             <Button variant="contained" color="primary" onClick={() => handleUpload('employeePhoto')} style={{}}>
//               Upload
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               required
//               type="file"
//               accept=".jpeg"
//               name="idProof"
//               onChange={handleChange}
//               helperText="ID Proof (JPEG, max 1MB)"
//             />
//             {imagePreviewUrlIdProof && (
//               <img src={imagePreviewUrlIdProof} alt="ID Proof" style={{ marginTop: '10px', width: '100px', height: '80px', marginBottom: '10px' }} />
//             )}
//             <br/>
//             <Button variant="contained" color="primary" onClick={() => handleUpload('idProof')}>
//               Upload
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               required
//               type="file"
//               accept=".pdf"
//               name="resume"
//               onChange={handleChange}
//               helperText="Resume (PDF, max 1MB)"
//             />
//             <Button variant="contained" color="primary" onClick={() => handleUpload('resume')}>
//               Upload
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               required
//               type="file"
//               accept=".pdf"
//               name="addressProof"
//               onChange={handleChange}
//               helperText="Address Proof (PDF, max 1MB)"
//             />
//             <Button variant="contained" color="primary" onClick={() => handleUpload('addressProof')} >
//               Upload
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <TextField
//               required
//               type="file"
//               accept=".pdf"
//               name="experienceLetter"
//               onChange={handleChange}
//               helperText="Experience Letter (PDF, max 1MB)"
//             />
//             <Button variant="contained" color="primary" onClick={() => handleUpload('experienceLetter')} >
//               Upload
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       {error && (
//         <FormHelperText error>{error}</FormHelperText>
//       )}
//     </Container>
//   );
// };

// export default Upload;

import React, { useState } from 'react';
import { Button, TextField, Typography, Grid, Container, FormHelperText, Snackbar, Alert, CircularProgress } from '@mui/material'; // Added CircularProgress for loading animation
import axios from 'axios';

const Upload = ({ email, setFormData }) => {
  const [localFormData, setLocalFormData] = useState({
    idProof: null,
    resume: null,
    addressProof: null,
    employeePhoto: null,
    experienceLetter: null,
  });

  const [imagePreviewUrlEmp, setImagePreviewUrlEmp] = useState(null);
  const [imagePreviewUrlIdProof, setImagePreviewUrlIdProof] = useState(null);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // New state to track loading status for each file
  const [loading, setLoading] = useState({
    idProof: false,
    resume: false,
    addressProof: false,
    employeePhoto: false,
    experienceLetter: false,
  });

  const fileTypeMapping = {
    employeePhoto: 'Employee Photo',
    idProof: 'ID Proof',
    resume: 'Resume',
    addressProof: 'Address Proof',
    experienceLetter: 'Experience Letter'
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    const selectedFile = files[0];
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

    if (name === 'resume' || name === 'addressProof' || name === 'experienceLetter') {
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
    } else if (name === 'employeePhoto' || name === 'idProof') {
      if (selectedFile && (selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/jpg')) {
        setLocalFormData((prevData) => ({
          ...prevData,
          [name]: selectedFile
        }));
        if (name === 'employeePhoto') {
          setImagePreviewUrlEmp(URL.createObjectURL(selectedFile));
        } else if (name === 'idProof') {
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
      idProof: `http://localhost:8082/${email}/uploadIdProof`,
      resume: `http://localhost:8082/${email}/uploadResume`,
      addressProof: `http://localhost:8082/${email}/uploadAddressProof`,
      employeePhoto: `http://localhost:8082/${email}/uploadImage`,
      experienceLetter: `http://localhost:8082/${email}/uploadExperienceLetter`
    };

    const file = localFormData[type];
    if (!file) {
      setError(`No file selected for ${fileTypeMapping[type]}.`);
      setSnackbar({ open: true, message: `No file selected for ${fileTypeMapping[type]}.`, severity: 'error' });
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append(type, file);

    // Set loading state to true for the file type being uploaded
    setLoading((prevLoading) => ({
      ...prevLoading,
      [type]: true
    }));

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
    } finally {
      // Set loading state to false after the upload is done
      setLoading((prevLoading) => ({
        ...prevLoading,
        [type]: false
      }));
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
      <Typography variant="h5" component="h3" gutterBottom style={{ marginBottom: '30px' }}>
        Document Uploads
      </Typography>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".jpeg"
              name="employeePhoto"
              onChange={handleChange}
              helperText="Employee Photo (JPEG, max 1MB)"
            />
            {imagePreviewUrlEmp && (
              <img src={imagePreviewUrlEmp} alt="Employee" style={{ marginTop: '10px', width: '100px', height: '80px', marginBottom: '10px' }} />
            )}
            <br />
            {/* Show loading spinner during upload */}
            {loading.employeePhoto ? <CircularProgress size={24} /> : (
              <Button variant="contained" color="primary" onClick={() => handleUpload('employeePhoto')} style={{}}>
                Upload
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".jpeg"
              name="idProof"
              onChange={handleChange}
              helperText="ID Proof (JPEG, max 1MB)"
            />
            {imagePreviewUrlIdProof && (
              <img src={imagePreviewUrlIdProof} alt="ID Proof" style={{ marginTop: '10px', width: '100px', height: '80px', marginBottom: '10px' }} />
            )}
            <br />
            {/* Show loading spinner during upload */}
            {loading.idProof ? <CircularProgress size={24} /> : (
              <Button variant="contained" color="primary" onClick={() => handleUpload('idProof')}>
                Upload
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".pdf"
              name="resume"
              onChange={handleChange}
              helperText="Resume (PDF, max 1MB)"
            />
            {/* Show loading spinner during upload */}
            {loading.resume ? <CircularProgress size={24} /> : (
              <Button variant="contained" color="primary" onClick={() => handleUpload('resume')}>
                Upload
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".pdf"
              name="addressProof"
              onChange={handleChange}
              helperText="Address Proof (PDF, max 1MB)"
            />
            {/* Show loading spinner during upload */}
            {loading.addressProof ? <CircularProgress size={24} /> : (
              <Button variant="contained" color="primary" onClick={() => handleUpload('addressProof')}>
                Upload
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              type="file"
              accept=".pdf"
              name="experienceLetter"
              onChange={handleChange}
              helperText="Experience Letter (PDF, max 1MB)"
            />
            {/* Show loading spinner during upload */}
            {loading.experienceLetter ? <CircularProgress size={24} /> : (
              <Button variant="contained" color="primary" onClick={() => handleUpload('experienceLetter')}>
                Upload
              </Button>
            )}
          </Grid>
        </Grid>
        <FormHelperText error>{error}</FormHelperText>
      </form>
    </Container>
  );
};

export default Upload;
