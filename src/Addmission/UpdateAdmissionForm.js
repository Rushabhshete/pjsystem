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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateAdmissionForm = ({ admission, onUpdate }) => {
  const [formData, setFormData] = useState(admission);
  const [courses, setCourses] = useState([]);
  const [guides, setGuides] = useState([]);
  const [sources, setSources] = useState([]);
  const [open, setOpen] = useState(true);

  const institutecode = localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(
          `http://13.233.43.240:8085/api/sourceBy/getAll?institutecode=${institutecode}`
        );
        setSources(response.data);
      } catch (error) {
        console.error("Error fetching source:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://13.233.43.240:8085/getAllCourse?institutecode=${institutecode}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchGuides = async () => {
      try {
        const response = await axios.get(
          `http://13.233.43.240:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
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
        balanceAmount: balanceAmount > 0 ? balanceAmount.toString() : "",
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
    } else if (formData.paymentMethod === "Partial") {
      // Handle Partial Payment if needed
    }
  }, [formData.paymentMethod]);
  const handleUpdateAdmission = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://13.233.43.240:8085/updateAdmission/${formData.id}`,
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
  const calculateBalance = () => {
    if (
      formData.paymentMethod === "Partial" ||
      formData.paymentMethod === "Pending"
    ) {
      return formData.totalFees - formData.paidFees;
    }

    return 0; // No balance for other payment methods
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Update Admission</DialogTitle>
      <DialogContent>
        <form onSubmit={handleUpdateAdmission} className="required-asterisk">
          <Grid container spacing={3} marginTop={1}>
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
                required
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
                required
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
            </Grid>
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
                label="Paid Fees"
                value={formData.paidFees}
                onChange={handleInputChange}
                required
              />
            </Grid>{" "}
            {formData.paymentMethod === "Pending" ||
            formData.paymentMethod === "Partial" ? (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  id="balanceAmount"
                  name="balanceAmount"
                  label="Balance Amount"
                  value={calculateBalance()}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ) : null}
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
): null}
          
            
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdateAdmission} color="primary">
          Update
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default UpdateAdmissionForm;
