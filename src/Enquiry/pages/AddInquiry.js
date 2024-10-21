import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { stateOptions } from "./EnquiryDropdown";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  FormControl,
  Grid,
  Snackbar,
  Alert,
  useTheme,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import SaveIcon from "@mui/icons-material/Save";

export default function AddEnquiry() {
  const [examOptions, setExamOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [conductedBy, setConductedBy] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [Enquiry, setInquiries] = useState({
    name: "",
    mobile: "",
    email: "",
    source_by: "",
    status1: "",
    exam: "",
    conduct_by: "",
    remark: "",
    enquiryDate: "",
    callBackDate: "",
    callBackTime: "",
    dob: "",
    gender: "",
    motherTongue: "",
    address: "",
    landmark: "",
    state: "",
    district: "",
    fatherProfession: "",
    educationQualification: "",
    annualIncome: "",
    photo: null,
  });
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [emailError, setEmailError] = useState("");
  const theme = useTheme();

  const handleAddClick = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setDistricts(stateOptions[selectedState]);
    setInquiries({ ...Enquiry, state: selectedState, district: "" });
  };

  const handleFileChange = (e) => {
    setInquiries({ ...Enquiry, photo: e.target.files[0] });
  };

  const onInputChange = (e) => {
    setInquiries({ ...Enquiry, [e.target.name]: e.target.value });
    const inputValue = e.target.value;
    if (e.target.name === "mobile") {
      if (inputValue.length === 10) {
        setError("");
      } else {
        setError("Phone number should not exceed 10 digits");
      }
    }
    if (e.target.name === "email") {
      setEmailError(
        validateEmail(e.target.value)
          ? ""
          : "Please enter a valid email address."
      );
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [examsResponse, sourcesResponse, conductsResponse] =
          await Promise.all([
            axios.get(
              `http://localhost:8086/getAllExam?institutecode=${localStorage.getItem(
                "institutecode"
              )}`
            ),
            axios.get(
              `http://localhost:8086/getAllSource?institutecode=${localStorage.getItem(
                "institutecode"
              )}`
            ),
            axios.get(
              `http://localhost:8086/get/getAllConductModels?institutecode=${localStorage.getItem(
                "institutecode"
              )}`
            ),
          ]);

        setExamOptions(examsResponse.data);
        setSourceOptions(sourcesResponse.data);
        setConductedBy(conductsResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFields = () => {
    if (
      !Enquiry.name ||
      !Enquiry.mobile ||
      !Enquiry.email ||
      !Enquiry.exam ||
      !Enquiry.source_by ||
      !Enquiry.conduct_by ||
      !Enquiry.status1 ||
      !Enquiry.enquiryDate
    ) {
      setErrorMessage("Fill all the necessary fields");
      return false;
    }

    if (!validateEmail(Enquiry.email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }

    if (Enquiry.status1 === "Call Back") {
      if (!Enquiry.callBackDate || !Enquiry.callBackTime) {
        setErrorMessage("Please fill in the call back date and time");
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validate fields before submitting
    if (!validateFields()) {
      setOpenSnackbar(true);
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      for (const key in Enquiry) {
        formData.append(key, Enquiry[key]);
      }

      // Get institutecode from localStorage to append it to the FormData
      formData.append("institutecode", localStorage.getItem("institutecode"));

      // Send the form data to the API endpoint
      await axios.post(`http://localhost:8086/save/enquiry`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
        // Show success alert
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Enquiry Added Successfully",
        });
      navigate("/layout/Enquiry-manager/report");
    } catch (error) {
      console.error(
        "There was an error adding the Enquiry!",
        error.response ? error.response.data : error.message
      );
      setOpenSnackbar(true);
       // Show error alert
       Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add the enquiry. Please try again.",
      });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    //navigate("/layout/report");
  };
  return (
    <div maxWidth="false" sx={{ padding: 2, width: "100%" }}>
      <Box mt={1} textAlign="center" sx={{ width: "100%" }}>
        <Grid container spacing={2} className="textField-root">
          <Grid item xs={12} sm={4}>
            {" "}
            {/* Set minHeight here */}
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              value={Enquiry.name}
              onChange={onInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone No."
              variant="outlined"
              name="mobile"
              value={Enquiry.mobile}
              onChange={onInputChange}
              fullWidth
              inputProps={{ maxLength: 10 }}
              error={!!error}
              helperText={error}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={Enquiry.email}
              onChange={onInputChange}
              fullWidth
              error={Boolean(emailError)}
              helperText={emailError}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                name="exam"
                value={Enquiry.exam}
                onChange={onInputChange}
                label="Exam"
                sx={{ textAlign: "left" }}
              >
                {examOptions.map((option, index) => (
                  <MenuItem key={index} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                name="source_by"
                value={Enquiry.source_by}
                onChange={onInputChange}
                label="Source By"
                sx={{ textAlign: "left" }}
              >
                {sourceOptions.map((option, index) => (
                  <MenuItem key={index} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                name="conduct_by"
                value={Enquiry.conduct_by}
                onChange={onInputChange}
                label={"Conducts"}
                sx={{ textAlign: "left" }}
              >
                {conductedBy.map((option, index) => (
                  <MenuItem key={index} value={option.name}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                select
                label={"Status"}
                name="status1"
                value={Enquiry.status1}
                onChange={onInputChange}
                sx={{ textAlign: "left" }}
              >
                <MenuItem value="Call Back">Call Back</MenuItem>
                <MenuItem value="Interested">Interested</MenuItem>
                <MenuItem value="Not Interested">Not Interested</MenuItem>
                <MenuItem value="DND">DND</MenuItem>
                <MenuItem value="Ringing">Ringing</MenuItem>
                <MenuItem value="Switch Off">Switch Off</MenuItem>
                <MenuItem value="Waiting">Waiting</MenuItem>
                <MenuItem value="Converted">Converted</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          {Enquiry.status1 === "Call Back" && (
            <>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Select Date"
                  type="date"
                  variant="outlined"
                  name="callBackDate"
                  value={Enquiry.callBackDate}
                  onChange={onInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Select Time"
                  type="time"
                  variant="outlined"
                  name="callBackTime"
                  value={Enquiry.callBackTime}
                  onChange={onInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 60 }} // Ignore seconds by setting step to 60
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} sm={4}>
            <TextField
              label="Enquiry Date"
              type="date"
              variant="outlined"
              name="enquiryDate"
              value={Enquiry.enquiryDate}
              onChange={onInputChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={4} className="textField-root">
            <TextField
              label="Remark"
              variant="outlined"
              name="remark"
              value={Enquiry.remark}
              onChange={onInputChange}
              fullWidth
              sx={{ "& .MuiInputBase-root": { minHeight: "50px" } }}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "flex-start" }}
          >
            <IconButton
              onClick={handleAddClick}
              style={{ color: showAdditionalFields ? "red" : "green" }} // Red for remove, green for add
            >
              {showAdditionalFields ? <RemoveIcon /> : <AddIcon />}{" "}
              {/* Toggle between Add and Remove icon */}
            </IconButton>
          </Grid>

          {/* Additional Fields */}
          {showAdditionalFields && (
            <>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="date"
                  name="dob"
                  value={Enquiry.dob}
                  onChange={onInputChange}
                  fullWidth
                  label="DOB"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    name="gender"
                    select
                    value={Enquiry.gender}
                    onChange={onInputChange}
                    label="Gender"
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Mother Tongue"
                  name="motherTongue"
                  value={Enquiry.motherTongue}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Address"
                  name="address"
                  value={Enquiry.address}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Landmark"
                  name="landmark"
                  value={Enquiry.landmark}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    name="state"
                    select
                    value={selectedState}
                    onChange={handleStateChange}
                    label="State"
                  >
                    <MenuItem value="All">Select State</MenuItem>
                    {Object.keys(stateOptions).map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    name="district"
                    value={Enquiry.district}
                    onChange={onInputChange}
                    label="District"
                    disabled={!districts.length}
                    select
                  >
                    <MenuItem value="All">Select District</MenuItem>
                    {districts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Father's Profession"
                  name="fatherProfession"
                  value={Enquiry.fatherProfession}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              {/* <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    name="educationQualification"
                    value={Enquiry.educationQualification}
                    onChange={onInputChange}
                    label="Education Qualification"
                    select
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="10th">10th</MenuItem>
                    <MenuItem value="12th">12th</MenuItem>
                    <MenuItem value="Graduate">Graduate</MenuItem>
                    <MenuItem value="Post-Graduate">Post-Graduate</MenuItem>
                  </TextField>
                </FormControl>
              </Grid> */}

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Education Qualification"
                  name="educationQualification"
                  value={Enquiry.educationQualification}
                  onChange={onInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    name="annualIncome"
                    value={Enquiry.annualIncome}
                    onChange={onInputChange}
                    label="Annual Income"
                    select
                  >
                    <MenuItem value="">
                      <em>Select Income</em>
                    </MenuItem>
                    <MenuItem value="0-1L">0 - 1 Lakh</MenuItem>
                    <MenuItem value="1-5L">1 - 5 Lakhs</MenuItem>
                    <MenuItem value="5-10L">5 - 10 Lakhs</MenuItem>
                    <MenuItem value="10L+">10 Lakh+</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  type="file"
                  name="photo"
                  accept="image/*"
                  fullWidth
                  onChange={handleFileChange}
                  label="Upload Photo"
                  InputLabelProps={{ shrink: true }} // This ensures the label stays above the field when a file is chosen
                />
              </Grid>
            </>
          )}
        </Grid>

        {/* Adjusting button grid layout */}
        <Grid
          mt={1}
          gap={2}
          item
          xs={12}
          sm={6}
          display="flex"
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SaveIcon />}
            onClick={onSubmit}
          >
            Save
          </Button>
          {/* <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/layout/report")}
          >
            Submit
          </Button> */}
        </Grid>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: { backgroundColor: "red" },
        }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Fill the necessary fields!
        </Alert>
      </Snackbar>

      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Enquiry added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}
