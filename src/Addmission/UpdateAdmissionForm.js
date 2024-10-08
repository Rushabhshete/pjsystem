import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  IconButton,
  Typography,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateAdmissionForm = ({ admission, onUpdate }) => {
  const [formData, setFormData] = useState(admission);
  const [courses, setCourses] = useState([]);
  const [guides, setGuides] = useState([]);
  const [sources, setSources] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [open, setOpen] = useState(true);

  const institutecode = localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
        );
        setSources(response.data);
      } catch (error) {
        console.error("Error fetching source:", error);
      }
    };

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

    const fetchGuides = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
        );
        setGuides(response.data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      }
    };

    fetchSources();
    fetchCourses();
    fetchGuides();
  }, [institutecode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const calculateBalanceAmount = () => {
      const total = parseFloat(formData.totalFees) || 0;
      const paid = parseFloat(formData.paidFees) || 0;
      const balanceAmount = total - paid;
      setFormData((prevFormData) => ({
        ...prevFormData,
        balanceAmount: balanceAmount > 0 ? balanceAmount.toString() : "0",
      }));
    };

    calculateBalanceAmount();
  }, [formData.totalFees, formData.paidFees]);

  useEffect(() => {
    if (formData.paymentMethod === "Complete") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        paidFees: prevFormData.totalFees,
      }));
    }
    // Handle Partial Payment if needed
  }, [formData.paymentMethod]);

  const handleUpdateAdmission = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:8085/updateAdmission/${formData.id}`,
        formData
      );
      toast.success("Admission updated successfully!");
      if (onUpdate) {
        onUpdate(formData); // Trigger the onUpdate callback
      }
      handleClose(); // Close the popup on success
    } catch (error) {
      toast.error("Error updating admission.");
      console.error("Error updating admission:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleImageUpload = async () => {
    if (!photoFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("studentPhoto", photoFile);

    try {
      await axios.put(
        `http://localhost:8085/updateStudentImage/${formData.email}`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image uploaded successfully!");
      // Optionally refresh the admission data here if necessary
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      toast.error("Error uploading image. Please try again.");
      console.error("Error uploading image:", error);
    }
  };

  const calculateBalance = () => {
    if (
      formData.paymentMethod === "Partial" ||
      formData.paymentMethod === "Pending"
    ) {
      return formData.balanceAmount;
    }

    return 0; // No balance for other payment methods
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Admission</DialogTitle>
      <DialogContent>
        <form onSubmit={handleUpdateAdmission} className="required-asterisk">
          <Grid container spacing={3} marginTop={1}>
            {/* Full Name */}
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
            {/* Email */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            {/* Mobile 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="mobile1"
                name="mobile1"
                label="Mobile 1"
                value={formData.mobile1}
                onChange={handleInputChange}
                required
              />
            </Grid>
            {/* Mobile 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="mobile2"
                name="mobile2"
                label="Mobile 2"
                value={formData.mobile2}
                onChange={handleInputChange}
              />
            </Grid>
            {/* Courses */}
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
            {/* Medium */}
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
            {/* Duration */}
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
                <MenuItem value="1 Months">1 Month</MenuItem>
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
            {/* Total Fees */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="totalFees"
                name="totalFees"
                label="Total Fees"
                type="number"
                value={formData.totalFees}
                onChange={handleInputChange}
              />
            </Grid>
            {/* Payment Method */}
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
            {/* Paid Fees */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="paidFees"
                name="paidFees"
                label="Paid Fees"
                type="number"
                value={formData.paidFees}
                onChange={handleInputChange}
                required
              />
            </Grid>
            {/* Balance Amount */}
            {(formData.paymentMethod === "Pending" ||
              formData.paymentMethod === "Partial") && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  id="balanceAmount"
                  name="balanceAmount"
                  label="Balance Amount"
                  type="number"
                  value={calculateBalance()}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            )}
            {/* Payment Mode */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="paymentMode"
                name="paymentMode"
                label="Payment Mode"
                value={formData.paymentMode}
                onChange={handleInputChange}
                select
                required
              >
                <MenuItem value="Cheque">Cheque</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
              </TextField>
            </Grid>
            {/* Transaction ID */}
            {formData.paymentMode !== "Cash" && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  id="transactionid"
                  name="transactionid"
                  label="Transaction ID"
                  value={formData.transactionid}
                  onChange={handleInputChange}
                />
              </Grid>
            )}
            {/* Source By */}
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
                {sources.map((src) => (
                  <MenuItem key={src.id} value={src.sourceBy}>
                    {src.sourceBy}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Guide Name */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                name="guideName"
                label="Guide Name"
                value={formData.guideName}
                onChange={handleInputChange}
                select
                required
              >
                {guides.map((g) => (
                  <MenuItem key={g.id} value={g.guideName}>
                    {g.guideName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Date */}
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
            {/* Due Date */}
            {(formData.paymentMethod === "Pending" ||
              formData.paymentMethod === "Partial") && (
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
            )}
            {/* Remark */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="remark"
                name="remark"
                label="Remark"
                value={formData.remark}
                onChange={handleInputChange}
              />
            </Grid>
            {/* Image Upload Section */}
            <Grid item xs={12} sm={6} md={4}>
              <input
                accept="image/jpeg, image/jpg, image/png"
                style={{ display: "none" }}
                id="upload-photo"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-photo">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  sx={{ mr: 2 }}
                >
                  <PhotoCamera />
                </IconButton>
                <Button variant="contained" component="span">
                  Upload Photo
                </Button>
              </label>
              {photoPreview && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                </Typography>
              )}
            </Grid>
            {/* Upload Image Button */}
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleImageUpload}
                disabled={!photoFile}
              >
                Upload Image
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdateAdmission} color="primary" variant="contained">
          Update Admission
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default UpdateAdmissionForm;
