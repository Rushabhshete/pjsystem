import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import axios from "axios";

const PreviewComponent = ({ formData }) => {
  const getInstituteCode = () => localStorage.getItem("institutecode");
  const [employeeDetails, setEmployeeDetails] = useState(null);
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!getInstituteCode()) {
          console.error("No institutecode found in localStorage");
          return;
        }

        const response = await axios.get(
          `https://pjsofttech.in:20443/findInstitutesby/Institutecode?institutecode=${getInstituteCode()}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [getInstituteCode()]);
  const navigate = useNavigate();

  // Filter out fields that should not be displayed
  const filteredFormData = Object.fromEntries(
    Object.entries(formData).filter(
      ([key]) => !['idProofFile', 'resumeFile', 'addressProofFile', 'experienceLetterFile', 'employeePhoto'].includes(key)
    )
  );

  const handleDownloadPdf = () => {
    const pdf = new jsPDF();

    // Add the title "Employee Report" at the top
    const title = 'Employee Report';
    pdf.setFontSize(18);
    pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' }); // Adjusted Y position

    // Add institute image
    const instituteImage = employeeDetails.instituteimage; // Assuming this is a base64 string or URL
    const instituteName = employeeDetails.institutename;

    if (instituteImage) {
        const image = new Image();
        image.src = instituteImage;
        image.onload = () => {
            // Reduce the size of the image
            const imageWidth = 30; // Set the desired width
            const imageHeight = 30; // Set the desired height
            pdf.addImage(image, 'JPEG', pdf.internal.pageSize.getWidth() / 2 - imageWidth / 2, 25, imageWidth, imageHeight); // Adjusted Y position

            // Add institute name below the image
            pdf.setFontSize(14);
            pdf.text(instituteName, pdf.internal.pageSize.getWidth() / 2, 70, { align: 'center' }); // Adjusted Y position

            // Generate table below the institute name
            pdf.autoTable({
                startY: 80, // Start table below the institute name
                head: [['Field', 'Value']],
                body: Object.entries(filteredFormData).map(([key, value]) => [
                    formatFieldName(key),
                    value
                ]),
                theme: 'grid',
                headStyles: {
                    fillColor: [128, 0, 128], // Purple heading color
                    textColor: [255, 255, 255], // White text color
                    fontSize: 12
                },
                bodyStyles: { fontSize: 10 },
                styles: { cellPadding: 2 },
            });

            pdf.save("preview.pdf");
        };
    } else {
        // If no institute image, add institute name directly
        pdf.setFontSize(14);
        pdf.text(instituteName, pdf.internal.pageSize.getWidth() / 2, 40, { align: 'center' }); // Adjusted Y position

        // Generate table directly below the heading
        pdf.autoTable({
            startY: 50, // Start table below the institute name
            head: [['Field', 'Value']],
            body: Object.entries(filteredFormData).map(([key, value]) => [
                formatFieldName(key),
                value
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [128, 0, 128], // Purple heading color
                textColor: [255, 255, 255], // White text color
                fontSize: 12
            },
            bodyStyles: { fontSize: 10 },
            styles: { cellPadding: 2 },
        });

        pdf.save("preview.pdf");
    }
};




  const handleBackClick = () => {
    navigate('/layout/employee-manager');
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
                {formData.employeePhoto && (
                  <img src={formData.employeePhoto} alt="Employee" style={{ width: '100px', height: '90px', marginBottom: '10px', borderRadiu:'50px' }} />
                )}
              </Grid>
            </Grid>
          </Grid>
          {Object.entries(filteredFormData).map(([key, value]) => (
            key !== 'employeePhoto' && // Exclude employeePhoto from displaying again
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