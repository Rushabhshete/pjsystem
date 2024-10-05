import React, { useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// import "./AstricRed.css";

const UploadDocuments = ({ emailAddress }) => {
  const [formData, setFormData] = useState({
    studentphoto: null,
    studentSign: null,
    aadharcard: null,
    pancard: null,
    castevalidationphoto: null,
    castecertificate: null,
    leavingcertificate: null,
    domicile: null,
    birthcertificate: null,
    disabilitycertificate: null,
  });

  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [previews, setPreviews] = useState({
    studentphoto: null,
    studentSign: null,
  });

  const handleInputChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file && file.type !== "image/jpeg") {
      setError("Only JPEG files are allowed.");
      return;
    }

    setFormData({ ...formData, [name]: file });
    setError("");

    if (name === "studentphoto" || name === "studentSign") {
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prevPreviews) => ({ ...prevPreviews, [name]: previewUrl }));
    }

    console.log(`Selected file for ${name}:`, file);
  };

  const handleUpload = async (type) => {
    const uploadEndpoints = {
      studentphoto: `http://localhost:8080/saveStudentPhoto/${emailAddress}`,
      studentSign: `http://localhost:8080/studentSign/${emailAddress}`,
      aadharcard: `http://localhost:8080/aadharcard/${emailAddress}`,
      pancard: `http://localhost:8080/savepancardPhoto/${emailAddress}`,
      castevalidationphoto: `http://localhost:8080/saveCastevalidationPhoto/${emailAddress}`,
      castecertificate: `http://localhost:8080/savecastecertificatePhoto/${emailAddress}`,
      leavingcertificate: `http://localhost:8080/saveleavingcertificatePhoto/${emailAddress}`,
      domicile: `http://localhost:8080/savedomicilecertificatePhoto/${emailAddress}`,
      birthcertificate: `http://localhost:8080/savebirthcertificatPhoto/${emailAddress}`,
      disabilitycertificate: `http://localhost:8080/disabilitycertificate/${emailAddress}`,
    };

    const file = formData[type];
    if (!file) {
      setError(`No file selected for ${type}.`);
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append(type, file);

    try {
      console.log(`Uploading ${type} to ${uploadEndpoints[type]}`);
      const response = await axios.post(uploadEndpoints[type], uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`${type} uploaded successfully`, response.data);
      setUploadStatus(`${type} uploaded successfully`);
      //toast.success(`${type} uploaded successfully`); // Display toast notification
    } catch (error) {
      console.error(`Error uploading ${type}`, error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      setError(`Error uploading ${type}. Please try again.`);
    }
  };

  return (
    <Paper
      elevation={3}
      style={{ padding: "20px", maxWidth: "1000px", margin: "20px auto" }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Upload Documents
      </Typography>
      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}
      {uploadStatus && (
        <Typography color="primary" align="center" gutterBottom>
          {uploadStatus}
        </Typography>
      )}
      <form>
        <Grid container spacing={2}>
          {Object.keys(formData).map((key) => (
            <Grid item xs={12} key={key}>
              <input
                type="file"
                name={key}
                accept="image/jpeg"
                onChange={handleInputChange}
                required
                InputLabelProps={{ className: "required-asterisk" }}
              />
              {key === "studentphoto" && previews.studentphoto && (
                <img
                  src={previews.studentphoto}
                  alt="Student"
                  style={{ height: "100px", width: "150px", marginTop: "10px" }}
                />
              )}
              {key === "studentSign" && previews.studentSign && (
                <img
                  src={previews.studentSign}
                  alt="Student Sign Preview"
                  style={{ height: "50px", width: "200px", marginTop: "10px" }}
                />
              )}
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleUpload(key)}
                disabled={!formData[key]}
              >
                Upload {key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            </Grid>
          ))}
        </Grid>
      </form>
    </Paper>
  );
};

export default UploadDocuments;
