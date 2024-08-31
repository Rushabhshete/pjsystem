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
import { useNavigate } from "react-router-dom";
// Define the CreateAccount component
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
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [isSaveSuccessful, setIsSaveSuccessful] = useState(false);
  const [institutecode, setInstituteCode] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    if (!formData.registrationnumber) {
      formErrors.registrationnumber = "Registration number is required.";
    }
    return formErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0 && termsAccepted) {
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
          subscriptionyear: formData.subscriptionyear,
          subscriptstartDate: formData.subscriptstartDate,
          subscriptendDate: formData.subscriptendDate,
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

  const handleTermsOpen = () => {
    setShowTerms(true);
  };

  const handleTermsClose = () => {
    setShowTerms(false);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowTerms(false);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(institutecode);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    navigate("/systems");
  };

  return (
    <form
      onSubmit={handleSave}
      style={{ marginLeft: "100px", marginRight: "100px" }}
    >
      <Typography variant="h4" gutterBottom textAlign="center">
        Add Institute
      </Typography>

      <Grid container spacing={2}>
        {/* Email, Phone Number, Mobile Number */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Email Address"
            name="emailaddress"
            value={formData.emailaddress}
            onChange={handleChange}
            fullWidth
            error={!!errors.emailaddress}
            helperText={errors.emailaddress}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Phone Number"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            fullWidth
            error={!!errors.phonenumber}
            helperText={errors.phonenumber}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Mobile Number"
            name="mobilenumber"
            value={formData.mobilenumber}
            onChange={handleChange}
            fullWidth
            error={!!errors.mobilenumber}
            helperText={errors.mobilenumber}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>

        {/* Password, Confirm Password, Institute Name */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Confirm Password"
            name="confirmpassword"
            type="password"
            value={formData.confirmpassword}
            onChange={handleChange}
            fullWidth
            error={!!errors.confirmpassword}
            helperText={errors.confirmpassword}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Institute Name"
            name="institutename"
            value={formData.institutename}
            onChange={handleChange}
            fullWidth
            error={!!errors.institutename}
            helperText={errors.institutename}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Aadhar"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
            fullWidth
            error={!!errors.aadhar}
            helperText={errors.aadhar}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Pan Card"
            name="pancard"
            value={formData.pancard}
            onChange={handleChange}
            fullWidth
            error={!!errors.pan}
            helperText={errors.pan}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>

        {/* Website, Address (Full Width), Landmark */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Website"
            name="websitename"
            value={formData.websitename}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Landmark"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        {/* Country, State, District */}
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <TextField
              select
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={!!errors.state}
            >
              {states.map((state, index) => (
                <MenuItem key={index} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
          
            <TextField
              select
              label="District"
              
              name="district"
              value={formData.district}
              onChange={handleChange}
              error={!!errors.district}
            >
              {districts.map((district, index) => (
                <MenuItem key={index} value={district}>
                  {district}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        {/* City, Registration Number */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <TextField
              select
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!errors.city}
            >
              {cities.map((city, index) => (
                <MenuItem key={index} value={city}>
                  {city}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Registration Number"
            name="registrationnumber"
            value={formData.registrationnumber}
            onChange={handleChange}
            fullWidth
            error={!!errors.registrationnumber}
            helperText={errors.registrationnumber}
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>

        {/* Plan, Subscription Year, Subscription Start Date */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="plan-label">Plan *</InputLabel>
            <TextField
              select
              label="Plan"
              labelId="plan-label"
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              InputProps={{
                endAdornment: <span style={{ color: "red" }}>*</span>,
              }}
            >
              <MenuItem value="Demo/free">Demo/free</MenuItem>
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            InputLabelProps={{ shrink: true }}
            label="Subscription Start Date"
            name="subscriptstartDate"
            value={formData.subscriptstartDate}
            onChange={handleChange}
            type="date"
            fullWidth
            InputProps={{
              endAdornment: <span style={{ color: "red" }}>*</span>,
            }}
          />
        </Grid>
      </Grid>

      <Paper
        align="center"
        elevation={3}
        style={{ padding: "16px", align: "center" }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {" "}
          Select the Systems
        </Typography>
        <Grid container spacing={2}>
          {/* Checkboxes for Management Systems */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
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
          <Grid item xs={12}>
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
      <Grid item xs={12}>
        <Button onClick={handleTermsOpen} color="primary">
          Before submitting the form read the terms and conditions = click here
        </Button>
      </Grid>

      {/* Submit Button */}
      <Grid item xs={12}>
        <Button variant="contained" type="submit" fullWidth>
          Save
        </Button>
      </Grid>

      {/* Dialog for Terms and Conditions */}
      <Dialog
        open={showTerms}
        onClose={handleTermsClose}
        PaperProps={{ style: { padding: "20px", backgroundColor: "#f5f5f5" } }}
      >
        <DialogTitle style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          Terms and Conditions
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" style={{ lineHeight: "1.5" }}>
            <ul>
              <li>
                Term 1: All users must be at least 18 years old to access our
                services.
              </li>
              <li>
                Term 2: Users agree to provide accurate information during
                registration.
              </li>
              <li>
                Term 3: We reserve the right to suspend or terminate accounts
                for any violations.
              </li>
              <li>
                Term 4: All content and intellectual property are owned by the
                company.
              </li>
              <li>
                Term 5: By using our services, you agree to receive
                communications from us.
              </li>
            </ul>
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                color="primary"
              />
            }
            label={
              <span style={{ fontWeight: "normal", fontSize: "0.875rem" }}>
                I agree to the terms and conditions
              </span>
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleTermsClose}
            color="primary"
            style={{ textTransform: "none" }}
          >
            Close
          </Button>
          <Button
            onClick={handleTermsAccept}
            color="primary"
            style={{
              textTransform: "none",
              backgroundColor: "#3f51b5",
              color: "#fff",
            }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Image Section */}
      <Grid item xs={12} mt={2}>
        <ImageUploadButton
          variant="contained"
          onClick={() => document.getElementById("image-upload").click()}
        >
          Upload Image
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
          Submit
        </Button>
      )}
      <Modal open={isPopupOpen} onClose={handleClosePopup}>
        <Box sx={{ padding: 4, backgroundColor: "white", borderRadius: 2 }}>
          <Typography variant="h6">Institute Code: {institutecode}</Typography>
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
    </form>
  );
};

const states = ["Maharashtra"];
const districts = [
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal",
];
const cities = [
  "Pune",
  "Aundh",
  "Hinjewadi",
  "Kharadi",
  "Hadapsar",
  "Wakad",
  "Viman Nagar",
  "Pimpri-Chinchwad",
  "Loni Kalbhor",
  "Bavdhan",
  "Shivajinagar",
  "Kothrud",
  "Nigdi",
  "Dhankawadi",
  "Wanawadi",
  "Sangamner",
  "Kasarwadi",
  "Bhosari",
  "Yerawada",
  "Bavdhan",
  "Dapodi",
  "Kothrud",
  "Chinchwad",
  "Hinjewadi",
  "Kharadi",
  "Wagholi",
  "Pimpri",
  "Moshi",
  "Ravet",
  "Alandi",
];

export default CreateAccount;
