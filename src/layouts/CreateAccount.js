import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Modal,
  Box,
} from "@mui/material";
import PolicyPopup from "./PolicyPopup ";
import { policies } from "./policies";
import { useNavigate } from "react-router-dom";
import indianStatesAndDistricts from "./indianStatesAndDistricts";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    emailaddress: "",
    phonenumber: "",
    password: "",
    confirmpassword: "",
    institutename: "",
    institutecode: "",
    mobilenumber: "",
    websitename: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    district: "",
    registrationnumber: "",
    aadhar: "",
    pancard: "",
    loa: "",
    status: "",
    mou: "",
    instituteimage: null,
    country: "India",
    publicid: "",
    employeemanagementsystem: false,
    studentmanagementsystem: false,
    feesmanagementsystem: false,
    incomeandexpense: false,
    enquirymanagementsystem: false,
    admissionmanagementsystem: false,
    plan: "",
    subscriptionyear: "",
    subscriptstartDate: "",
    subscriptendDate: "",
    gstNo: "",
    pincode: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [imageUpload, setImageUpload] = useState(null);
  const [isSaveSuccessful, setIsSaveSuccessful] = useState(false);
  const [institutecode, setInstituteCode] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState([]);
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.emailaddress.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
      formErrors.emailaddress =
        "Email must be in the format: example@gmail.com";
    }
    if (!formData.phonenumber.match(/^\d{10}$/)) {
      formErrors.phonenumber = "Phone number must be 10 digits.";
    }
    if (!formData.mobilenumber.match(/^\d{10}$/)) {
      formErrors.mobilenumber = "Mobile number must be 10 digits.";
    }
    if (formData.aadhar.length !== 12 || isNaN(formData.aadhar)) {
      formErrors.aadhar = "Aadhar number must be 12 digits.";
    }
    if (formData.password !== formData.confirmpassword) {
      formErrors.confirmpassword = "Confirm password does not match.";
    }
    if (!formData.institutename) {
      formErrors.institutename = "Institute name is required.";
    }
    if (!formData.city) {
      formErrors.city = "City is required.";
    }
    if (!formData.state) {
      formErrors.state = "State is required.";
    }
    if (!formData.district) {
      formErrors.district = "District is required.";
    }
   
    return formErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0 ) {
      try {
        // Prepare data for submission
        const dataToSubmit = {
          emailaddress: formData.emailaddress,
          phonenumber: formData.phonenumber,
          password: formData.password,
          institutename: formData.institutename,
          aadhar: formData.aadhar,
          mobilenumber: formData.mobilenumber,
          registrationnumber: formData.registrationnumber,
          state: formData.state,
          district: formData.district,
          city: formData.city,
          employeemanagementsystem: formData.employeemanagementsystem,
          studentmanagementsystem: formData.studentmanagementsystem,
          feesmanagementsystem: formData.feesmanagementsystem,
          incomeandexpense: formData.incomeandexpense,
          enquirymanagementsystem: formData.enquirymanagementsystem,
          admissionmanagementsystem: formData.admissionmanagementsystem,
          plan: formData.plan,
          //subscriptionyear: formData.subscriptionyear,
          subscriptstartDate: formData.subscriptstartDate,
          //subscriptendDate: formData.subscriptendDate,
          pincode:formData.pincode,
        gstNo:formData.gstNo
        };
        setIsSaveSuccessful(true);
        const response = await axios.post(
          "http://localhost:8081/saveinstitude",
          dataToSubmit
        );

        // Alert the user about form submission success
        alert("Form Submitted Successfully");
        console.log("Institute saved successfully:", response.data);

        // Save email to localStorage for image upload
        localStorage.setItem("email", formData.emailaddress);
      } catch (error) {
        console.error("Error saving institute:", error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  const handleClickOpen = (policy) => {
    setSelectedPolicy(policy);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const handleImageUpload = async () => {
    const email = localStorage.getItem("email");

    if (email && imageUpload) {
      const formDataImage = new FormData();
      formDataImage.append("instituteimage", imageUpload);

      try {
        const response = await axios.post(
          `http://localhost:8081/uploadimage/${email}`,
          formDataImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Alert the user about image upload success
        alert("Image Uploaded Successfully");
        console.log("Image uploaded successfully:", response.data);
        // Clear the image upload state
        setImageUpload(null);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(
          "Error uploading image: " + (error.response?.data || error.message)
        );
      }
    } else {
      alert("Email or file not found!");
    }
  };

  const ImageUploadButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }));

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/findInstitutesby/email?emailaddress=${formData.emailaddress}`
      );

      if (response.data && response.data.institutecode) {
        setInstituteCode(response.data.institutecode);
        setIsPopupOpen(true);
      } else {
        console.error("No institute code found for the provided email.");
      }
    } catch (error) {
      console.error("API call failed", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(institutecode);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    navigate("/systems");
  };

  const state = Object.keys(indianStatesAndDistricts);
  const district = formData.state
    ? indianStatesAndDistricts[formData.state]
    : [];

  return (
    <div
      style={{
        backgroundImage: `url('https://media.idownloadblog.com/wp-content/uploads/2016/02/Twitter-GIF.gif')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        minHeight: '100vh',
        color: '#ffffff' // Optional: Set text color for contrast
      }}
    >
      <form
        onSubmit={handleSave}
        style={{ marginLeft: "100px", marginRight: "100px" }}
      >
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
              backgroundColor: "gold",
            }}
          />
          <Typography variant="h4" sx={{ margin: "0 10px", color: "gold" }}>
            <b>Create Account</b>
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              height: "1px",
              backgroundColor: "gold",
            }}
          />
        </Box>
        <Paper
          align="center"
          elevation={3}
          style={{
            padding: "20px",
            align: "center",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Grid container spacing={2}>
            {/* Email, Phone Number, Mobile Number */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="Firm / Institute Name"
                name="institutename"
                value={formData.institutename}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.institutename}
                helperText={errors.institutename}
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Owner's Email Address"
                name="emailaddress"
                value={formData.emailaddress}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.emailaddress}
                helperText={errors.emailaddress}
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Admin Phone Number"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.phonenumber}
                helperText={errors.phonenumber}
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Firm / Institute Mobile Number"
                name="mobilenumber"
                value={formData.mobilenumber}
                onChange={handleChange}
                fullWidth
                required
                error={!!errors.mobilenumber}
                helperText={errors.mobilenumber}
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>

            {/* Password, Confirm Password, Institute Name */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Confirm Password"
                name="confirmpassword"
                type="password"
                value={formData.confirmpassword}
                onChange={handleChange}
                fullWidth
                error={!!errors.confirmpassword}
                helperText={errors.confirmpassword}
                required
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                label="Owner's Aadhar No."
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                fullWidth
                error={!!errors.aadhar}
                helperText={errors.aadhar}
                required
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Owner's Pan No."
                name="pancard"
                value={formData.pancard}
                onChange={handleChange}
                fullWidth
                error={!!errors.pan}
                helperText={errors.pan}
                required
                InputLabelProps={{
                  className: "required-asterisk",
                }}
              />
            </Grid>

            {/* Website, Address (Full Width), Landmark */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="Website Link"
                name="websitename"
                value={formData.websitename}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="GST No."
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  InputLabelProps={{
                    className: "required-asterisk",
                  }}
                >
                  <MenuItem value="Demo/free">Demo/free</MenuItem>
                  <MenuItem value="Basic">Basic</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Firm / Institute Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                // rows={4}
                fullWidth
                InputLabelProps={{ className: "required-asterisk" }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Country, State, District */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <MenuItem value="India">India</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  InputLabelProps={{ className: "required-asterisk" }}
                  required
                >
                  {state.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                  InputLabelProps={{ className: "required-asterisk" }}
                  required
                >
                  {district.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            {/* City, Registration Number */}
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth required>
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  InputLabelProps={{ className: "required-asterisk" }}
                  required
                ></TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Pincode"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ className: "required-asterisk" }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={3}>
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Subscription Start Date"
            name="subscriptstartDate"
            value={formData.subscriptstartDate}
            onChange={handleChange}
            type="date"
            fullWidth
            InputLabelProps={{
              className: "required-asterisk"
            }}
          />
        </Grid> */}
          </Grid>

          <Paper
            align="center"
            elevation={3}
            style={{ padding: "16px", align: "center", marginTop: "10px" ,backgroundColor:"#003366" }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", color:"gold"}} >
              {" "}
              Select the Systems 
            </Typography>
            <Grid container spacing={2}>
              {/* Checkboxes for Management Systems */}
              <Grid item xs={12}>
                <Grid container spacing={2} sx={{color:"white"}}>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.employeemanagementsystem}
                          onChange={handleChange}
                          name="employeemanagementsystem"
                          color="primary"

                        />
                      }
                      label="Employee Management System"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.studentmanagementsystem}
                          onChange={handleChange}
                          name="studentmanagementsystem"
                          color="primary"
                        />
                      }
                      label="Student Management System"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.feesmanagementsystem}
                          onChange={handleChange}
                          name="feesmanagementsystem"
                          color="primary"
                        />
                      }
                      label="Fees Management System"
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Income and Expense, Enquiry, Admission */}
              <Grid item xs={12} sx={{color:"white"}}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.incomeandexpense}
                          onChange={handleChange}
                          name="incomeandexpense"
                          color="primary"
                        />
                      }
                      label="Income and Expense Management"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.enquirymanagementsystem}
                          onChange={handleChange}
                          name="enquirymanagementsystem"
                          color="primary"
                        />
                      }
                      label="Enquiry Management System"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.admissionmanagementsystem}
                          onChange={handleChange}
                          name="admissionmanagementsystem"
                          color="primary"
                        />
                      }
                      label="Admission Management System"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>

          {/* Terms and Conditions */}

          <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ marginTop: "24px" }}
          >
            <Grid item>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography
                    variant="body1"
                    align="center"
                    onClick={() => handleClickOpen(policies.privacyPolicy)}
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    Privacy Policy
                  </Typography>
                }
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography
                    variant="body1"
                    align="center"
                    onClick={() => handleClickOpen(policies.termsConditions)}
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    Terms & Conditions
                  </Typography>
                }
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography
                    variant="body1"
                    align="center"
                    onClick={() => handleClickOpen(policies.dataProductPolicy)}
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    Data & Product Policy
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          {/* Dialog for Policy Information */}
          {selectedPolicy && (
            <PolicyPopup
              open={open}
              onClose={handleClose}
              policy={selectedPolicy}
            />
          )}

          {/* Submit Button */}
          <Grid item xs={12} >
            <Button variant="contained" type="submit" fullWidth sx={{backgroundColor:"#003366",color:"gold"}} >
              Create Account
            </Button>
          </Grid>

          {/* Dialog for Terms and Conditions */}
        
           
          {/* Upload Image Section */}
          <Grid item xs={12} mt={2}>
            <ImageUploadButton
              variant="contained"
              onClick={() => document.getElementById("image-upload").click()}
              sx={{backgroundColor:"#003366",color:"gold"}}
            >
              Upload Image / Logo
            </ImageUploadButton>
          </Grid>
          <input
            type="file"
            id="image-upload"
            style={{ display: "none" }}
            onChange={(e) => {
              setImageUpload(e.target.files[0]);
            }}
          />
          <Grid item xs={12}>
            {imageUpload && (
              <Button variant="contained" onClick={handleImageUpload} mt={2}>
                Confirm Image Upload
              </Button>
            )}
          </Grid>
          {isSaveSuccessful && (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Get Your Institute Code
            </Button>
          )}
          <Modal open={isPopupOpen} onClose={handleClosePopup}>
          <Box sx={{ padding: 4, backgroundColor: "white", borderRadius: 2 }}>
  <Typography variant="h6">
    Institute Code: {institutecode}
  </Typography>
  <Typography variant="body2" sx={{ color: "red", marginTop: 1 }}>
    Write Down Institute Code, do not forget, cannot recover
  </Typography>
  <Button variant="outlined" onClick={handleCopy}>
    Copy
  </Button>
  <Button
    variant="contained"
    color="secondary"
    onClick={handleClosePopup}
  >
    Close
  </Button>
</Box>

          </Modal>
        </Paper>
      </form>
    </div>
  );
};

export default CreateAccount;
