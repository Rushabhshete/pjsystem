import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Grid,
  TextField,
  Box,
  Avatar,
  Container,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import StarIcon from "@mui/icons-material/Star";

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const RootContainer = styled(Container)(({ theme }) => ({
  padding: "20px",
  marginTop: "80px",
  marginLeft: "auto",
  marginRight: "auto",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 170,
  marginBottom: 20,
  marginTop: 10,
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: 20,
  fontWeight: "bold",
  color: "#1976d2",
}));

const SubscriptionSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  borderTop: "1px solid #ddd",
  backgroundImage:
    "linear-gradient(88.8deg, rgb(239, 171, 245) 13.4%, rgb(196, 181, 249) 76.3%)",
}));

const Heading = styled("h6")`
  font-size: 1.25rem;
  margin-bottom: 8px;
`;

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  "& label.Mui-focused": {
    color: "#1976d2",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1976d2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#1976d2",
    },
    "&:hover fieldset": {
      borderColor: "#115293",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
}));

const GridContainer = styled(Grid)(({ theme }) => ({
  paddingBottom: 20,
}));

const CenteredBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const CardContainer = styled(Card)(({ theme }) => ({
  marginBottom: 20,
  padding: "20px",
  animation: `${fadeIn} 0.5s ease-in-out`,
  position: "relative",
}));

const InfoText = styled(Typography)(({ theme }) => ({
  color: "#1976d2",
  fontWeight: "bold",
  marginBottom: "10px",
  textAlign: "center",
}));

const SubText = styled(Typography)(({ theme }) => ({
  color: "#333",
  fontSize: "14px",
  textAlign: "center",
  marginBottom: "5px",
}));

const EditButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "10px",
  right: "10px",
}));

const EditPasswordButton = styled(Button)(({ theme }) => ({
  marginTop: "10px",
}));

const AdminProfile = () => {
  const navigate = useNavigate();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!email) {
          console.error("No email found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://pjsofttech.in:20443/findInstitutesby/email?emailaddress=${email}`
        );
        setEmployeeDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

  const handleEditClick = (field) => {
    setEditingField(field);
    setEditValues({
      // fullName: employeeDetails.fullName,
      // mobileNo: employeeDetails.mobileNo,
      password: "",
      confirmPassword: "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingField(null);
    setSelectedFile(null);
  };


  const handleSave = async () => {
    if (!selectedFile) {
      alert('Please select an image file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('instituteimage', selectedFile);

    try {
      const response = await axios.post(
        `https://pjsofttech.in:20443/updateimage/${email}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert(response.data);
      setEmployeeDetails((prevDetails) => ({
        ...prevDetails,
        instituteimage: URL.createObjectURL(selectedFile), // Update image in the state
      }));
      setOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Failed to update image.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      setSelectedFile(files[0]);
    } else {
      setEditValues({
        ...editValues,
        [name]: value,
      });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!employeeDetails) {
    return <Typography variant="h6">No employee details found</Typography>;
  }
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
  `;
  return (
    <div maxWidth="md">
      <PopTypography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "#24A0ED",
          borderRadius: "150px",
          padding: "10px",
          marginBottom: "40px",
          marginTop: "10px",
          marginLeft: "40px",
          marginRight: "40px",
        }}
      >
        Profile
      </PopTypography>
      <Grid container spacing={4} className="textField-root">
        <Grid item xs={12} md={4}>
          <CardContainer>
            <CenteredBox>
              <StyledAvatar
                alt={employeeDetails.institutename}
                src={employeeDetails.instituteimage}
              />
              <InfoText variant="h5">{employeeDetails.fullName}</InfoText>
              <SubText variant="subtitle1">
                {employeeDetails.department}
              </SubText>
              <SubText>Email: {employeeDetails.emailaddress}</SubText>
              <SubText>Phone: {employeeDetails.mobilenumber}</SubText>
              <SubText>Status: {employeeDetails.status}</SubText>
              <EditPasswordButton
                variant="contained"
                startIcon={<LockIcon />}
                onClick={() => handleEditClick("password")}
              >
                Edit Password
              </EditPasswordButton>
            </CenteredBox>
            <EditButton onClick={() => handleEditClick("profile")}>
              <EditIcon />
            </EditButton>
          </CardContainer>

          <Card
            sx={{
              position: "relative",
              padding: 1,
              textAlign: "center",
              maxWidth: 500,
              background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: 4,
            }}
          >
            {/* Bookmark with Best Seller Star */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 10,
                width: 70,
                height: 70,
                backgroundColor: "#0D47A1",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "gold",
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            >
              <StarIcon sx={{ color: "gold", marginRight: 0.5 }} />
              Best Seller
            </Box>

            <CardContent mt={-11}>
              {/* Title */}
              <Typography
                variant="h4"
                sx={{
                  marginTop: "1",
                  marginBottom: 2,
                  background:
                    "linear-gradient(90deg, #6A82FB 0%, #1E3A8A 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                {employeeDetails.plan}
              </Typography>

              {/* Discounted Price */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  color: "green",
                }}
              >
                ₹149
              </Typography>

              {/* MRP */}
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  textDecoration: "line-through",
                  fontSize: "1rem",
                  marginBottom: 2,
                  color: "red",
                }}
              >
                ₹299
              </Typography>

              {/* Plan Details */}
              {/* <Typography
                variant="h6"
                sx={{
                  marginTop: 2,
                  color: "#1E88E5",
                }}
              >
                Validity: {employeeDetails.subscriptionyear} Year
              </Typography> */}

              {/* Systems Heading */}
              <Typography
                variant="h7"
                sx={{
                  color: "#0D47A1",
                  marginBottom: 2,
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                Subscribed Systems :
              </Typography>

              {/* Enquiry */}
              <Box
                sx={{
                  border: "2px solid #0D47A1",
                  borderRadius: 2,
                  padding: 1,
                  marginTop: 1,
                  color: "#0D47A1",
                  cursor: "pointer",
                  transition: "all 0.3s ease", // Smooth transition for hover effect
                  "&:hover": {
                    backgroundColor: "#0D47A1", // Background color on hover
                    color: "#ffffff", // Text color on hover
                    borderColor: "#ffffff", // Border color on hover
                  },
                }}
                onClick={() => navigate("/layout/dashboard")}
              >
                <Typography variant="body1">Enquiry</Typography>
              </Box>

              {/* Admission */}
              <Box
                sx={{
                  border: "2px solid #0D47A1",
                  borderRadius: 2,
                  padding: 1,
                  marginTop: 1,
                  color: "#0D47A1",
                  cursor: "pointer",
                  transition: "all 0.3s ease", // Smooth transition for hover effect
                  "&:hover": {
                    backgroundColor: "#0D47A1", // Background color on hover
                    color: "#ffffff", // Text color on hover
                    borderColor: "#ffffff", // Border color on hover
                  },
                }}
                onClick={() => navigate("/layout/admission-dashboard")}
              >
                <Typography variant="body1">Admission</Typography>
              </Box>

              {/* Income & Expense */}
              <Box
                sx={{
                  border: "2px solid #0D47A1",
                  borderRadius: 2,
                  padding: 1,
                  marginTop: 1,
                  color: "#0D47A1",
                  cursor: "pointer",
                  transition: "all 0.3s ease", // Smooth transition for hover effect
                  "&:hover": {
                    backgroundColor: "#0D47A1", // Background color on hover
                    color: "#ffffff", // Text color on hover
                    borderColor: "#ffffff", // Border color on hover
                  },
                }}
                onClick={() => navigate("/layout/Income-Expense-dashboard")}
              >
                <Typography variant="body1">Income & Expense</Typography>
              </Box>
              {/* Subscription Dates */}
              <Box
                sx={{
                  marginTop: 3,
                  textAlign: "left",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#0D47A1",
                    fontWeight: "bold",
                  }}
                >
                  Subscription Start Date: {employeeDetails.subscriptstartDate}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#0D47A1",
                    fontWeight: "bold",
                  }}
                >
                  Subscription End Date: {employeeDetails.subscriptendDate}
                </Typography>
              </Box>
              {/* <Box>
      <Typography>pjsofttech@gmail.com</Typography>
    </Box> */}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <CardContainer>
            {/* Institute Code Section */}
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              style={{
                backgroundColor: "#f0f4f8",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Institute Code - {employeeDetails.institutecode}
              </Typography>
            </Grid>

            {/* Basic Information Section */}
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    height: "1px",
                    backgroundColor: "#0D47A1",
                  }}
                />
                <Typography variant="h5" sx={{ margin: "0 10px" }}>
                  <b>BASIC  INFORMATION</b>
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    height: "1px",
                    backgroundColor: "#0D47A1",
                  }}
                />
              </Box>
              <GridContainer container spacing={2} mt={1}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                      Institute Name:
                    </Typography>
                    <Typography variant="h6">
                      {employeeDetails.institutename}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                      Owner's Name:
                    </Typography>
                    <Typography variant="h6">
                      {employeeDetails.ownerName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                      Owner Number :
                    </Typography>
                    <Typography variant="h6">
                      {employeeDetails.phonenumber}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                      Institute Number :
                    </Typography>
                    <Typography variant="h6">
                      {employeeDetails.mobilenumber}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Address:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.address}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Pincode:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.pincode}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Landmark:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.landmark}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    City:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.city}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    State:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.state}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Country:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.country}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Owner's Aadhar:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.aadhar}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Owner's PAN:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.pancard}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center"> 
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Registration Number:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.registrationnumber}
                  </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} >
                 <Box display="flex" alignItems="center">
                 <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Website Name:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.websitename}
                  </Typography>
                 </Box>
                </Grid>
                <Grid item xs={12} sm={6} >
                 <Box display="flex" alignItems="center">
                 <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Plan:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.plan}
                  </Typography>
                 </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Date:
                  </Typography>
                  <Typography variant="h6">
                    {new Date(employeeDetails.createdAt).toLocaleDateString()}
                  </Typography>
                  </Box>
                </Grid>
                
                
                
                
               
                
                
                
                
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                  <Typography variant="h6" style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    GST No.:
                  </Typography>
                  <Typography variant="h6">
                    {employeeDetails.gstNo}
                  </Typography>
                  </Box>
                </Grid>
              </GridContainer>
            </CardContent>
          </CardContainer>
        </Grid>

      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Edit{" "}
          {editingField === "profile"
            ? "Profile Information"
            : editingField === "basic"
              ? "Basic Information"
              : "Password"}
        </DialogTitle>
        <DialogContent>
          {editingField === "profile" || editingField === "basic" ? (
            <>
              <StyledTextField
                margin="dense"
                label="Upload Image"
                type="file"
                name="image"
                onChange={handleChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          ) : (
            <>
              <StyledTextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={editValues.password}
                onChange={handleChange}
                variant="outlined"
              />
              <StyledTextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={editValues.confirmPassword}
                onChange={handleChange}
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default AdminProfile;
