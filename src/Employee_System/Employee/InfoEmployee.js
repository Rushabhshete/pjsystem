import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import jsPDF from "jspdf";
import { Worker, Viewer } from "@react-pdf-viewer/core"; // Import PDF Viewer components
import { zoomPlugin } from "@react-pdf-viewer/zoom"; // Import zoom plugin
import "@react-pdf-viewer/core/lib/styles/index.css"; // Required styles
import "@react-pdf-viewer/zoom/lib/styles/index.css"; // Zoom plugin styles
import axios from "axios";
const InfoEmployee = ({ user, onClose }) => {
  const [documentToView, setDocumentToView] = useState(null); // Stores the document URL
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [documentType, setDocumentType] = useState(null); // Stores the type (pdf or image)
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );
  const handleViewDocument = (url, type) => {
    setDocumentToView(url); // Set the URL of the document to view
    setDocumentType(type); // Set the type of document (image/pdf)
    setOpenDocumentDialog(true); // Open the dialog
  };
  const zoomPluginInstance = zoomPlugin(); // Create zoom plugin instance

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!institutecode) {
          console.error("No institutecode found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [institutecode]);

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // Extract the file name from the URL
    link.click();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const instituteName = employeeDetails.institutename;
    const imgData = employeeDetails.instituteimage; // Assuming it's a base64 string or URL

    // Set properties for PDF document
    const margin = { top: 15, left: 15, right: 15 };
    const startY = 10; // Initial y position for title and image

    // Add institute image
    if (imgData) {
      doc.addImage(
        imgData,
        "JPEG",
        (doc.internal.pageSize.getWidth() - 60) / 2,
        startY,
        60,
        30
      ); // Adjust image size and position
    }

    // Add title
    const title = "Employee Report";
    doc.setFontSize(18);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, startY + 30, {
      align: "center",
    }); // Position the title below the image

    // Add institute name
    doc.setFontSize(14);
    doc.text(instituteName, doc.internal.pageSize.getWidth() / 2, startY + 40, {
      align: "center",
    }); // Position the institute name below the title

    // Define user information
    const userInfo = [
      { label: "Id:", value: user?.empID },
      { label: "Full Name:", value: user?.fullName },
      { label: "Gender:", value: user?.gender },
      { label: "DOB:", value: user?.dob },
      { label: "Blood Group:", value: user?.bloodGroup },
      { label: "Email:", value: user?.email },
      { label: "Current Address:", value: user?.currentAddress },
      { label: "Permanent Address:", value: user?.permanentAddress },
      { label: "Pincode:", value: user?.pinCode },
      { label: "Permanent Pincode:", value: user?.permanentpinCode },
      { label: "Landmark:", value: user?.landmark },
      { label: "Permanent Landmark:", value: user?.permanentlandmark },
      { label: "District:", value: user?.district },
      { label: "Permanent District:", value: user?.permanentdistrict },
      { label: "City:", value: user?.city },
      { label: "Taluka:", value: user?.taluka },
      { label: "Permanent City:", value: user?.permanentcity },
      { label: "Permanent Taluka:", value: user?.permanenttaluka },
      { label: "State:", value: user?.state },
      { label: "Permanent State:", value: user?.permanentstate },
      { label: "Country:", value: user?.country },
      { label: "Mobile No:", value: user?.mobileNo },
      { label: "Parent No:", value: user?.parentNo },
      { label: "Department:", value: user?.department },
      { label: "Designation:", value: user?.workDetail },
      { label: "Work Location:", value: user?.workLocation },
      { label: "Duty Type:", value: user?.dutyType },
      { label: "Employee Type:", value: user?.employeeType },
      { label: "Employee Category:", value: user?.employeecategory },
      { label: "Aadhar No:", value: user?.adharNo },
      { label: "Pan No:", value: user?.panNo },
      { label: "Joining Date:", value: user?.joiningDate },
      { label: "End Date:", value: user?.enddate },
      { label: "Salary:", value: user?.salary },
      { label: "CPF No:", value: user?.cpfNo },
      { label: "ESIC No:", value: user?.esicNo },
      {
        label: "Basic Qualification:",
        value: user?.basicQualification,
      },
      {
        label: "Professional Qualification:",
        value: user?.professionalQualification,
      },
      { label: "Shift:", value: user?.shift },
      { label: "Shift Start Time:", value: user?.shiftStartTime },
      { label: "Shift End Time:", value: user?.shiftEndTime },
      { label: "Status:", value: user?.status },
    ];

    // Convert userInfo to data suitable for autotable
    const tableData = userInfo.map(({ label, value }) => [label, value]);

    // Generate table using autotable
    doc.autoTable({
      startY: startY + 60, // Start table below the institute name
      head: [["Field", "Value"]],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [128, 0, 128], // Purple header background
        textColor: [255, 255, 255], // White text color
      },
      margin: { top: startY + 30, left: margin.left, right: margin.right },
      didDrawPage: function (data) {
        // Add footer with page number
        doc.setFontSize(10);
        doc.text(
          "Page " + doc.internal.getNumberOfPages(),
          margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    // Save the PDF
    doc.save("UserInformation.pdf");
  };

  return (
    <div>
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          maxHeight: "90vh", // Limiting height to 90% of viewport height
          overflowY: "auto", // Making content scrollable if it exceeds maxHeight
          bgcolor: "background.paper",
          borderRadius: "5px",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#24A0ED",
            textAlign: "center",
          }}
        >
          Employee Information
        </Typography>
        <hr />
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Full Name:
            </Typography>{" "}
            {user?.fullName}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Email:
            </Typography>{" "}
            {user?.email}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Department:
            </Typography>{" "}
            {user?.department}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Designation:
            </Typography>{" "}
            {user?.workDetail}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Current Address:
            </Typography>{" "}
            {user?.currentAddress}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent Address:
            </Typography>{" "}
            {user?.permanentAddress}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Pincode:
            </Typography>{" "}
            {user?.pinCode}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent Pincode:
            </Typography>{" "}
            {user?.permanentpinCode}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Landmark:
            </Typography>{" "}
            {user?.landmark}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent Landmark:
            </Typography>{" "}
            {user?.permanentlandmark}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              District:
            </Typography>{" "}
            {user?.district}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent District:
            </Typography>{" "}
            {user?.permanentdistrict}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Taluka:
            </Typography>{" "}
            {user?.taluka}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent Taluka:
            </Typography>{" "}
            {user?.permanenttaluka}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              City:
            </Typography>{" "}
            {user?.city}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent City:
            </Typography>{" "}
            {user?.permanentcity}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              State:
            </Typography>{" "}
            {user?.state}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent State:
            </Typography>{" "}
            {user?.permanentstate}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Country:
            </Typography>{" "}
            {user?.country}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Permanent Country:
            </Typography>{" "}
            {user?.permanentCountry}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Mobile No:
            </Typography>{" "}
            {user?.mobileNo}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Parent No:
            </Typography>{" "}
            {user?.parentNo}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Work Location:
            </Typography>{" "}
            {user?.workLocation}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Duty Type:
            </Typography>{" "}
            {user?.dutyType}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Employee Type:
            </Typography>{" "}
            {user?.employeeType}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Employee Category:
            </Typography>{" "}
            {user?.employeecategory}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Gender:
            </Typography>{" "}
            {user?.gender}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              DOB:
            </Typography>{" "}
            {new Date(user?.dob).toLocaleDateString("en-GB")}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Aadhar No:
            </Typography>{" "}
            {user?.adharNo}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Pan No:
            </Typography>{" "}
            {user?.panNo}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Blood Group:
            </Typography>{" "}
            {user?.bloodGroup}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Joining Date:
            </Typography>{" "}
            {new Date(user?.joiningDate).toLocaleDateString("en-GB")}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              End Date:
            </Typography>
            {user?.enddate
              ? new Date(user.enddate).toLocaleDateString("en-GB")
              : ""}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Salary:
            </Typography>{" "}
            {user?.salary}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              CPF No:
            </Typography>{" "}
            {user?.cpfNo}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              ESIC No:
            </Typography>{" "}
            {user?.esicNo}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Basic Qualification:
            </Typography>{" "}
            {user?.basicQualification}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Professional Qualification:
            </Typography>{" "}
            {user?.professionalQualification}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Shift:
            </Typography>{" "}
            {user?.shift}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Shift Start Time:
            </Typography>{" "}
            {user?.shiftStartTime}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Shift End Time:
            </Typography>{" "}
            {user?.shiftEndTime}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Status:
            </Typography>{" "}
            {user?.status}
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Employee Photo:
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleViewDocument(user?.employeePhoto, "image")}
            >
              View
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => handleDownload(user?.employeePhoto)}
            >
              Download
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              ID Proof:
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleViewDocument(user?.idProof, "image")}
            >
              View
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => handleDownload(user?.idProof)}
            >
              Download
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Address Proof:
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleViewDocument(user?.addressProof, "pdf")}
            >
              View
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => handleDownload(user?.addressProof)}
            >
              Download
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Resume:
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleViewDocument(user?.resume, "pdf")}
            >
              View
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => handleDownload(user?.resume)}
            >
              Download
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mr: 1 }}>
              Experience Letter:
            </Typography>
            <Button
              variant="contained"
              onClick={() => handleViewDocument(user?.experienceLetter, "pdf")}
            >
              View
            </Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={() => handleDownload(user?.experienceLetter)}
            >
              Download
            </Button>
          </Grid>
        </Grid>
        <Box mt={2} textAlign="right">
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
          >
            Download
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            sx={{ ml: 2 }}
          >
            Close
          </Button>
        </Box>

        <Button onClick={onClose}>Close</Button>
      </Box>
    </Modal>

<Dialog
  open={openDocumentDialog}
  onClose={() => setOpenDocumentDialog(false)}
  maxWidth="md" // Set maximum width for the dialog
  fullWidth // Ensures the dialog takes up the full width of the screen up to maxWidth
>
  <DialogTitle>Document Viewer</DialogTitle>
  <DialogContent
    dividers
    sx={{
      display: 'flex',
      flexDirection: 'column', // Flexbox column layout
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0, // Remove extra padding to maximize space
      height: '600px', // Fix dialog height to avoid overlap
    }}
  >
    {documentType === "image" && (
      <img
        src={documentToView}
        alt="Document"
        style={{ maxWidth: '100%', maxHeight: '100%' }} // Ensure image scales within the dialog
      />
    )}
    {documentType === "pdf" && (
      <div style={{ flexGrow: 1, width: '100%', height: '100%' }}> {/* Use flexGrow to fill space */}
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <Viewer
            fileUrl={documentToView}
            plugins={[zoomPluginInstance]} // Add zoom plugin here
            onLoadError={(error) => {
              if (error.message.includes("401")) {
                console.error("Unauthorized access to the PDF file");
                alert("You do not have access to view this file.");
              } else {
                console.error("Error loading PDF", error);
              }
            }}
          />
        </Worker>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDocumentDialog(false)} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>

</div>

  );
};

export default InfoEmployee;
