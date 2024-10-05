
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const fieldLabels = {
  id: "ID",
  dateOfRegistration: "Date of Registration",
  standardOptions:"Standard",
  medium:"Medium",
  firstName: "First Name",
  middleName: "Middle Name",
  surname: "Last Name",
  full_name: "Full Name",
  gender: "Gender",
  bloodGroup: "Blood Group",
  motherTongue: "Mother Tongue",
  maritalStatus: "Marital Status",
  emailAddress: "Email Address",
  religion: "Religion",
  minority: "Minority",
  minorityType: "Minority Type",
  castCategory: "Caste Category",
  casteCertificateNumber: "Caste Certificate Number",
  casteValidation: "Caste Validity",
  casteValidationNumber: "Caste Validity Number",
  subCaste: "Sub Caste",
  dateOfBirth: "Date of Birth",
  age: "Age",
  birthPlace: "Birth Place",
  birthTaluka: "Birth Taluka",
  birthDistrict: "Birth District",
  birthState: "Birth State",
  birthCountry: "Birth Country",
  fathersName: "Father's Name",
  motherName: "Mother Name",
  fatherProfession: "Father's Profession",
  fathersContact: "Father's Contact",
  phoneNumber: "Phone Number",
  whatsappNumber: "WhatsApp Number",
  panNumber: "PAN Number",
  aadharNumber: "Aadhar Number",
  udiseNo: "UDISE Number",
  saralNo: "SARAL Number",
  incomeRanges: "Income",
  nationality: "Nationality",
  othernationality: "Other Nationality",
  sportYesNo: "Sports Participation",
  sportsName: "Sports Name",
  role: "Role",
  levelOfParticipation: "Level of Participation",
  internationaldetail: "International Details",
  noOfYearsPlayed: "Number of Years Played",
  achievement: "Achievement",
  sportsInjuries: "Sports Injuries",
  height: "Height",
  weight: "Weight",
  handicap: "Handicap",
  disabilityType: "Disability Type",
  specialPercentage: "Disability Percentage",
  domicilebool: "Domicile",
  domicileNumber: "Domicile Number",
  earthquake: "Earthquake Affected",
  earthquakeNumber: "Earthquake Affected Certificate Number",
  projectDifferentiated: "Project Affected",
  projectDifferentiatedNumber: "Project Affected Certificate Number",
  scholarship: "Scholarship",
  scholarshipName: "Scholarship Name",
  address: "Address",
  landmark: "Landmark",
  city: "City",
  taluka: "Taluka",
  district: "District",
  state: "State",
  country: "Country",
  pincode: "Pincode",
  permanentAddress: "Permanent Address",
  plandmark: "Landmark (Permanent)",
  pcity: "City (Permanent)",
  ptaluka: "Taluka (Permanent)",
  pdistrict: "District (Permanent)",
  pstate: "State (Permanent)",
  pcountry: "Country (Permanent)",
  ppincode: "Pincode (Permanent)",
  // Add more fields as needed
};

const PreviewPage = ({ formData }) => {
  const { studentphoto, studentSign, exams, emailAddress, ...otherData } =
    formData;
  const [photoUrl, setPhotoUrl] = useState("");
  const [signUrl, setSignUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentPhoto = async () => {
      try {
        const email = encodeURIComponent(emailAddress);
        const url = `http://13.233.43.240:8080/students/email?email=${email}`;

        const response = await axios.get(url);
        if (response.data && response.data.studentphoto) {
          setPhotoUrl(response.data.studentphoto);
        } else {
          console.error("Failed to fetch student photo URL");
        }
      } catch (error) {
        console.error("Error fetching student photo:", error);
      }
    };

    const fetchStudentSign = async () => {
      try {
        const email = encodeURIComponent(emailAddress);
        const url = `http://13.233.43.240:8080/students/email?email=${email}`;

        const response = await axios.get(url);
        if (response.data && response.data.studentSign) {
          setSignUrl(response.data.studentSign);
        } else {
          console.error("Failed to fetch student signature URL");
        }
      } catch (error) {
        console.error("Error fetching student signature:", error);
      }
    };

    if (studentphoto) {
      setPhotoUrl(studentphoto);
    } else {
      fetchStudentPhoto();
    }

    if (studentSign) {
      setSignUrl(studentSign);
    } else {
      fetchStudentSign();
    }
  }, [emailAddress, studentphoto, studentSign]);

  const handleNavigateDashboard = () => {
    navigate("/layout/StudentDashboard");
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Define page width
    const pageWidth = doc.internal.pageSize.width;

    // Calculate text width for center alignment
    const text1 = "PJ PUBLIC SCHOOL - ";
    const text2 = "Madhavbaug Ganpati Mandir Road, Tilak Road, Pune - 411001.";
    const text3 =
      "Tel : 8605090509 Email : PjSoftTech@gmail.com Website : www.PjSoftTech.com";
    const text4 = "APPLICATION FOR REGISTRATION ONLY 2024-2025";

    const textWidth1 =
      (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const textWidth2 =
      (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const textWidth3 =
      (doc.getStringUnitWidth(text3) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    const textWidth4 =
      (doc.getStringUnitWidth(text4) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;

    // Calculate positions for center alignment
    const centerX1 = (pageWidth - textWidth1) / 2;
    const centerX2 = (pageWidth - textWidth2) / 2;
    const centerX3 = (pageWidth - textWidth3) / 2;
    const centerX4 = (pageWidth - textWidth4) / 2;

    // Add centered text
    doc.text(text1, centerX1, 10);
    doc.text(text2, centerX2, 15);
    doc.text(text3, centerX3, 20);
    doc.text(text4, centerX4, 25);

    // Add student photo below the last text
    let yPosition = 35;
    if (photoUrl) {
      const imgWidth = 30; // Set image width
      const imgHeight = 40; // Set image height
      const centerXImage = (pageWidth - imgWidth) / 2; // Calculate center position for the image
      doc.addImage(
        photoUrl,
        "JPEG",
        centerXImage,
        yPosition,
        imgWidth,
        imgHeight
      );
      yPosition += imgHeight + 10; // Update yPosition after adding photo
    }

    // Add student details with a dynamic table
    const studentDetails = [];
    const keys = Object.keys(otherData);
    let row = [];

    keys.forEach((key, index) => {
      const field = fieldLabels[key] || key; // Get field label from fieldLabels or use key if not found
      let value = otherData[key];

      // Convert boolean values to checkboxes
      if (typeof value === "boolean") {
        value = value ? "Yes" : "No";
      } else {
        value = value ? value.toString() : "N/A";
      }

      row.push({ field: `${field}:`, value });

      if (row.length === 2 || index === keys.length - 1) {
        studentDetails.push(row);
        row = [];
      }
    });

    // Add student details table
    doc.autoTable({
      startY: yPosition,
      body: studentDetails.map((row) =>
        row.map(({ field, value }) => [field, value])
      ),
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "strong",
      },
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
      },
      didParseCell: function (data) {
        data.cell.styles.cellWidth = "auto";
      },
    });

    // Update yPosition after adding student details
    yPosition = doc.previousAutoTable.finalY + 10;

    // Add exam details dynamically
    exams.forEach((exam, index) => {
      const examDetails = [];
      Object.entries(exam).forEach(([key, value]) => {
        const field = fieldLabels[key] || key; // Get field label from fieldLabels or use key if not found

        // Convert boolean values to checkboxes
        let detail;
        if (typeof value === "boolean") {
          detail = `${field}: ${value ? "Yes" : "No"}`;
        } else {
          detail = `${field}: ${value ? value.toString() : "N/A"}`;
        }
        examDetails.push([detail]);
      });

      doc.autoTable({
        startY: yPosition,
        head: [[`Exam Details ${index + 1}`]],
        body: examDetails,
        theme: "grid",
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        styles: { fontSize: 10, cellPadding: 2 },
      });

      yPosition = doc.previousAutoTable.finalY + 10;
    });

    // Add student signature below the tables
    if (signUrl) {
      const imgWidth = 50; // Set image width
      const imgHeight = 20; // Set image height
      const centerXImage = (pageWidth - imgWidth) / 2; // Calculate center position for the image
      doc.addImage(
        signUrl,
        "JPEG",
        centerXImage,
        yPosition,
        imgWidth,
        imgHeight
      );
    }

    // Save or output the PDF
    doc.save("formData.pdf");
  };

  return (
    <Container
      component="main"
      maxWidth="lg"
      style={{ marginTop: "100px", overflowY: "auto", maxHeight: "80vh" }}
    >
      <Paper variant="outlined" style={{ padding: "20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center">
              Student Preview
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mb={2}>
              {photoUrl && (
                <Card>
                  <CardMedia
                    component="img"
                    alt="Student Photo"
                    height="200"
                    image={photoUrl}
                  />
                  <CardContent>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      Student Photo
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>
          {Object.entries(otherData).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Typography variant="body1" style={{ marginBottom: "8px" }}>
                <strong>{fieldLabels[key] || key}:</strong>{" "}
                {value ? value.toString() : "N/A"}
              </Typography>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              align="center"
              style={{ marginTop: "20px" }}
            >
              Exam Details
            </Typography>
          </Grid>
          {exams.map((exam, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              style={{
                marginTop: "0px",
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "5px",
                marginLeft: "10px",
              }}
            >
              {Object.entries(exam).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="body1" style={{ marginBottom: "8px" }}>
                    <strong>{fieldLabels[key] || key}:</strong>{" "}
                    {value ? value.toString() : "N/A"}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          ))}

          {signUrl && (
            <Box mt={3} display="flex" justifyContent="center">
              <Card>
                <CardMedia
                  component="img"
                  alt="Student Signature"
                  height="50"
                  image={signUrl}
                  style={{ width: "150px" }}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    align="center"
                    style={{ fontWeight: "bold" }}
                  >
                    Student Sign
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
          <Grid
            item
            xs={12}
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleNavigateDashboard}
            >
              Close Preview
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PreviewPage;
