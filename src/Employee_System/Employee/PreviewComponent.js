
import React from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PreviewComponent = ({ formData }) => {
  const navigate = useNavigate();

  // Filter out fields that should not be displayed
  const filteredFormData = Object.fromEntries(
    Object.entries(formData).filter(
      ([key]) => !['idProofFile', 'resumeFile', 'addressProofFile', 'experienceLetterFile', 'empFile'].includes(key)
    )
  );

  const handleDownloadPdf = () => {
    const pdf = new jsPDF();

    // Add the heading "Employee Form"
    pdf.setFontSize(18);
    pdf.text('Employee Form', pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Place employee photo at the top of the first page
    if (formData.empFile) {
      const image = new Image();
      image.src = formData.empFile;
      image.onload = () => {
        pdf.addImage(image, 'JPEG', pdf.internal.pageSize.getWidth() / 2 - 25, 30, 50, 50); // Center image horizontally
        pdf.autoTable({
          startY: 90, // Start table below the image
          head: [['Field', 'Value']],
          body: Object.entries(filteredFormData).map(([key, value]) => [
            formatFieldName(key),
            value
          ]),
          theme: 'grid',
          headStyles: { fontSize: 12 },
          bodyStyles: { fontSize: 10 },
          styles: { cellPadding: 2 },
        });
        pdf.save("preview.pdf");
      };
    } else {
      // No employee photo, directly generate table
      pdf.autoTable({
        startY: 30, // Start table below the heading
        head: [['Field', 'Value']],
        body: Object.entries(filteredFormData).map(([key, value]) => [
          formatFieldName(key),
          value
        ]),
        theme: 'grid',
        headStyles: { fontSize: 12 },
        bodyStyles: { fontSize: 10 },
        styles: { cellPadding: 2 },
      });
      pdf.save("preview.pdf");
    }
  };

  const handleBackClick = () => {
    navigate('/layout/dashboard');
  };

  // Helper function to format field names
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('Permanentpin Code', 'Permanent Pincode')
      .replace('Employeecategory', 'Employee Category') // Added replacement for Employeecategory
      .replace('Permanentcity', 'Permanent City')
      .replace('Permanentlandmark', 'Permanent Landmark')
      .replace('Permanentstate', 'Permanent State')
      .replace('Permanentdistrict', 'Permanent District')
      .replace('Enddate', 'End Date')
  };

  return (
    <Container component="main" maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Preview Uploaded Files
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography variant="subtitle1">Employee Photo:</Typography>
                {formData.empFile && (
                  <img src={formData.empFile} alt="Employee" style={{ width: '100px', height: '80px', marginBottom: '10px' }} />
                )}
              </Grid>
            </Grid>
          </Grid>
          {Object.entries(filteredFormData).map(([key, value]) => (
            key !== 'empFile' && // Exclude empFile from displaying again
            <Grid item xs={12} sm={6} key={key}>
              <Typography variant="body1" component="p">
                <strong>{formatFieldName(key)}:</strong> {value}
              </Typography>
            </Grid>
          ))}
        </Grid>
        <Grid container justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleDownloadPdf} style={{ marginTop: '20px' }}>
            Download as PDF
          </Button>
          <Button variant="contained" color="secondary" onClick={handleBackClick} style={{ marginTop: '20px', marginLeft: '10px' }}>
            Back to Dashboard
          </Button>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PreviewComponent;