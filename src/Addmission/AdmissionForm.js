import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert2
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const AdmissionForm = () => {
  const institutecode = localStorage.getItem("institutecode");
  const [formData, setFormData] = useState({
    name: "",
    mobile2: "",
    date: "",
    courses: "",
    duration: "",
    institutecode: institutecode || "",
    transactionid: "",
    totalFees: "",
    remark: "",
    dueDate: "",
    medium: "",
    paymentMode: "",
    paidFees: "",
    guideName: "",
    sourceBy: "",
    mobile1: "",
    // feesReceipt: null,
    studentPhoto: null,
    paymentMethod: "",
    pendingFees: "",
  });
  const [courses, setCourses] = useState([]);
  const [source, setSources] = useState([]);
  const [guide, setGuide] = useState([]);
  const [touched, setTouched] = useState({});
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isFormSaved, setIsFormSaved] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
        );
        setGuide(response.data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };

    if (institutecode) {
      fetchGuide();
    }
  }, [institutecode]);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
        );
        setSources(response.data);
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    if (institutecode) {
      fetchSources();
    }
  }, [institutecode]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/getAllCourse?institutecode=${institutecode}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (institutecode) {
      fetchCourses();
    }
  }, [institutecode]);

  useEffect(() => {
    const calculatependingFees = () => {
      const total = parseFloat(formData.totalFees) || 0;
      const paid = parseFloat(formData.paidFees) || 0;
      const pendingFees = total - paid;
      setFormData((prevFormData) => ({
        ...prevFormData,
        pendingFees: pendingFees > 0 ? pendingFees.toString() : "",
      }));
    };

    calculatependingFees();
  }, [formData.totalFees, formData.paidFees]);

  useEffect(() => {
    if (formData.paymentMethod === "Complete") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paidFees: prevFormData.totalFees,
      }));
    } else if (formData.paymentMethod === "Partial") {
      // Handle Partial Payment if needed
    }
  }, [formData.paymentMethod]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event, fieldName) => {
    setFormData({ ...formData, [fieldName]: event.target.files[0] });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { feesReceipt, studentPhoto, ...dataToSubmit } = formData; // exclude files from the initial submission
      await axios.post(
        `http://localhost:8085/saveAdmission?institutecode=${institutecode}`,
        dataToSubmit
      );
       // Show success message using SweetAlert2
       await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Form Submitted successfully!',
        confirmButtonText: 'OK',
      });
      setIsFormSubmitted(true); // mark form as submitted
      setIsFormSaved(true); // mark form as saved
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to Submitting Form. Please try again.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleFinalSubmit = () => {
    navigate("/layout/Admission-manager");
  };

  const handleFileUpload = async (fieldName, endpoint) => {
    const file = formData[fieldName];

    if (!file) {
      Swal.fire("No file selected");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(fieldName, file);

    try {
      await axios.post(endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire(`${fieldName} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      Swal.fire(`Only JPG and JPEG files are allowed for ${fieldName}`);
    }
  };

  const calculateBalance = () => {
    if (formData.paymentMethod === "Pending") {
      // If the payment method is "Pending", set paidFees to 0
      return formData.totalFees; // Balance will be the total fees since nothing is paid
    }

    if (formData.paymentMethod === "Partial") {
      // For partial payments, subtract paid fees from total fees
      return formData.totalFees - formData.paidFees;
    }

    return 0; // No balance for other payment methods
  };

  const handleBlur = (field) => (event) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateMobileNumber = (value) => {
    return /^\d{10}$/.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  return (
    <>
         <div maxWidth="lg" className="required-asterisk">
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3} className="textField-root">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur("email")}
                required
                error={touched.email && !validateEmail(formData.email)}
                helperText={
                  touched.email && !validateEmail(formData.email)
                    ? "Enter a valid email address"
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="mobile1"
                name="mobile1"
                label="Mobile 1"
                value={formData.mobile1}
                onChange={handleInputChange}
                onBlur={handleBlur("mobile1")}
                required
                error={
                  touched.mobile1 &&
                  (!validateMobileNumber(formData.mobile1) ||
                    formData.mobile1.length !== 10)
                }
                helperText={
                  touched.mobile1 && !validateMobileNumber(formData.mobile1)
                    ? "Mobile number must be 10 digits"
                    : ""
                }
                inputProps={{
                  maxLength: 10, // Limit input to 10 digits
                  pattern: "[0-9]*", // Optional: Restrict input to numbers only
                  inputMode: "numeric", // Optional: Show numeric keyboard on mobile devices
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="mobile2"
                name="mobile2"
                label="Mobile 2"
                value={formData.mobile2}
                onChange={handleInputChange}
                inputProps={{
                  maxLength: 10, // Limit input to 10 digits
                  pattern: "[0-9]*", // Optional: Restrict input to numbers only
                  inputMode: "numeric", // Optional: Show numeric keyboard on mobile devices
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="courses"
                name="courses"
                label="Courses"
                value={formData.courses}
                onChange={handleInputChange}
                select
                required
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.cname}>
                    {course.cname}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="medium"
                name="medium"
                label="Medium"
                value={formData.medium}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="duration"
                name="duration"
                label="Duration"
                value={formData.duration}
                onChange={handleInputChange}
                select
                required
              >
                <MenuItem value="1 Months">1 Months</MenuItem>
                <MenuItem value="2 Months">2 Months</MenuItem>
                <MenuItem value="3 Months">3 Months</MenuItem>
                <MenuItem value="4 Months">4 Months</MenuItem>
                <MenuItem value="6 Months">6 Months</MenuItem>
                <MenuItem value="12 Months">12 Months</MenuItem>
                <MenuItem value="24 Months">24 Months</MenuItem>
                <MenuItem value="36 Months">36 Months</MenuItem>
                <MenuItem value="48 Months">48 Months</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="totalFees"
                name="totalFees"
                label="Total Fees"
                value={formData.totalFees}
                onChange={handleInputChange}
              />
            </Grid>{" "}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="paymentMethod"
                name="paymentMethod"
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                select
                required
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="paidFees"
                name="paidFees"
                label="Fees Paying"
                value={formData.paidFees }
                onChange={handleInputChange}
                required
                disabled={formData.paymentMethod === "Pending"} // Disable input if paymentMethod is "Pending"
              />
            </Grid>
            {formData.paymentMethod === "Pending" ||
            formData.paymentMethod === "Partial" ? (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  id="pendingFees"
                  name="pendingFees"
                  label="Pending Fees"
                  value={calculateBalance() || 0}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ) : null}
            {formData.paymentMethod === "Partial" ||
            formData.paymentMethod === "Complete" ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    id="paymentMode"
                    name="paymentMode"
                    label="Payment Mode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    disabled={formData.paymentMethod === "Pending"}
                    select
                    required
                  >
                    <MenuItem value="Cheque">Cheque</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  </TextField>
                </Grid>
                {formData.paymentMode !== "Cash" ? (
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      id="transactionid"
                      name="transactionid"
                      label="Transaction ID"
                      value={
                        formData.paymentMethod === "Pending"
                          ? "Pending"
                          : formData.transactionid
                      }
                      onChange={handleInputChange}
                      disabled={formData.paymentMethod === "Pending"}
                    />
                  </Grid>
                ) : null}
              </>
            ) : null}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="sourceBy"
                name="sourceBy"
                label="Source By"
                value={formData.sourceBy}
                onChange={handleInputChange}
                select
                required
              >
                {source.map((src) => (
                  <MenuItem key={src.id} value={src.sourceBy}>
                    {src.sourceBy}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="guideName"
                name="guideName"
                label="Conduct By"
                value={formData.guideName}
                onChange={handleInputChange}
                select
                required
              >
                {guide.map((g) => (
                  <MenuItem key={g.id} value={g.guideName}>
                    {g.guideName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="date"
                name="date"
                label="Date"
                value={formData.date}
                onChange={handleInputChange}
                type="date"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {formData.paymentMethod === "Pending" ||
            formData.paymentMethod === "Partial" ? (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  id="dueDate"
                  name="dueDate"
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  type="date"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            ) : null}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="remark"
                name="remark"
                label="Remark"
                value={formData.remark}
                onChange={handleInputChange}
                rows={4}
              />
            </Grid>
            <Grid
              container
              spacing={3}
              style={{ marginTop: "10px", justifyContent: "center" }}
            >
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Save Data
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={1}
              justifyContent="space-evenly"
              display="flex"
              alignItems="center" // Align items vertically in the center
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {" "}
                {/* Add flexbox styling here */}
                <Button
                  variant="contained"
                  component="label"
                  style={{ marginRight: "10px", marginTop: "20px" }}
                  //color={errors.studentPhoto ? "error" : "primary"} // Change button color if there's an error
                >
                  Upload Student Photo
                  <Typography
                    variant="body1"
                    color="error"
                    sx={{ display: "inline-block", marginLeft: 1 }}
                  >
                    * {/* Asterisk to indicate required field */}
                  </Typography>
                  <input
                    type="file"
                    hidden
                    onChange={(event) =>
                      handleFileChange(event, "studentPhoto")
                    }
                  />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "20px" }}
                  onClick={() =>
                    handleFileUpload(
                      "studentPhoto",
                      `http://localhost:8085/saveStudentPhoto/${formData.email}`
                    )
                  }
                  disabled={!isFormSubmitted}
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
            {isFormSaved && (
              <Grid
                container
                justifyContent="center"
                spacing={3}
                style={{ marginTop: "10px" }}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleFinalSubmit}
                    color="primary"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
        </form>
      </div>
    </>
  );
};

export default AdmissionForm;
