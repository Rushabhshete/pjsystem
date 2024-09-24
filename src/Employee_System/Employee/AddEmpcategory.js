import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  InputAdornment,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { Edit, Delete, Info } from "@mui/icons-material";
import { Modal, Form } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
// import '../css/asterick.css';
import axios from "axios";
function Category() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8082/categories/all?institutecode=${institutecode}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [institutecode]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowUpdateModal(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedCategory({ ...selectedCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8082/categories/updateCategoryById/${selectedCategory.id}`,
        selectedCategory
      );
      setShowUpdateModal(false);
      await fetchData();
      setSelectedCategory(null);
      // toast.success('Category updated successfully');
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Failed to update category");
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmation && id) {
      try {
        await axios.delete(
          `http://localhost:8082/categories/delete/employeecategory/${id}`
        );
        await fetchData();
        // toast.success('Category deleted successfully');
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Failed to delete category");
        toast.error("Failed to delete category");
      }
    } else {
      console.error("Invalid id:", id);
    }
  };

  const handleInfo = (category) => {
    setSelectedCategory(category);
    setShowInfoModal(true);
  };


  const [formData, setFormData] = useState({
    categoryName: "",
    bonusPercentage: "",
    hraPercentage: "",
    taPercentage: "",
    incentivePercentage: "",
    spiPercentage: "",
    medicalAllowancePercentage: "",
    pfPercentage: "",
    esfPercentage: "",
    professionalTaxPercentage: "",
    incomeTaxPercentage: "",
    totalPaidLeave: "",
    totalUnpaidLeave: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmittable = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8082/categories/addEmployeeCategory?institutecode=${institutecode}`,
        formData
      );
      console.log("Form submitted successfully:", response.data);
      // toast.success('Form submitted successfully');
      fetchData(); // Show success toast
    } catch (error) {
      console.error("Error submitting the form:", error);
      if (error.response) {
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        console.log("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.log("Error request:", error.request);
      } else {
        console.log("Error message:", error.message);
      }
      console.log("Error config:", error.config);
      toast.error("Failed to submit form"); // Show error toast
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "#24A0ED",
          borderRadius: "150px",
          padding: "10px",
          marginBottom: "-12px",
        }}
      >
        Add Employee Category
      </Typography>
      <div
        className="textField-root"
        onSubmit={handleSubmittable}
        style={{ marginTop: "10px" }}
      >
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Category Name"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                variant="outlined"
              />
            </Grid>
           
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="HRA Percentage"
                name="hraPercentage"
                type="number"
                value={formData.hraPercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="TA Percentage"
                name="taPercentage"
                type="number"
                value={formData.taPercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Incentive Percentage"
                name="incentivePercentage"
                type="number"
                value={formData.incentivePercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="SPI Percentage"
                name="spiPercentage"
                type="number"
                value={formData.spiPercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Medical Percentage"
                name="medicalAllowancePercentage"
                type="number"
                value={formData.medicalAllowancePercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="PF Percentage"
                name="pfPercentage"
                type="number"
                value={formData.pfPercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="ESIC Percentage"
                name="esicPercentage"
                type="number"
                value={formData.esicPercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Professional Tax Percentage"
                name="professionalTaxPercentage"
                type="number"
                value={formData.professionalTaxPercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Income Tax Percentage"
                name="incomeTaxPercentage"
                type="number"
                value={formData.incomeTaxPercentage}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Total Paid Leaves"
                name="totalPaidLeave"
                type="number"
                value={formData.totalPaidLeave}
                onChange={handleChange}
                InputLabelProps={{ className: "required-asterisk" }}
                variant="outlined"
              />
            </Grid>
            <Grid container justifyContent="center" alignItems="center" marginTop={3}>
              <Grid item xs={1}>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <ToastContainer />
        </form>
      </div>
      <div>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table>
            <TableHead sx={{ background: "#f2f2f2" }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Category Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    HRA Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    TA Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Incentive Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    SPI Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Medical Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    PF Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    ESIC Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Professional Tax Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Income Tax Percentage
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Total Paid Leaves
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{ category. categoryName}</TableCell>
                  <TableCell>{100 * category. hraPercentage}%</TableCell>
                  <TableCell>{100 * category. taPercentage}%</TableCell>
                  <TableCell>{100 * category. incentivePercentage}%</TableCell>
                  <TableCell>{100 * category. spiPercentage}%</TableCell>
                  <TableCell>{100 * category. medicalAllowancePercentage}%</TableCell>
                  <TableCell>{100 * category. pfPercentage}%</TableCell>
                  <TableCell>{100 * category. esicPercentage}%</TableCell>
                  <TableCell>{100 * category. professionalTaxPercentage}%</TableCell>
                  <TableCell>{100 * category. incomeTaxPercentage}%</TableCell>
                  <TableCell>{ category. totalPaidLeave}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <IconButton
                      onClick={() => handleInfo(category)}
                      sx={{ color: "green" }}
                    >
                      <Info />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(category)}
                      sx={{ color: "blue" }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(category.id)}
                      sx={{ color: "red" }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Update Modal */}
        <Modal
          style={{ marginTop: "100px", marginLeft: "90px" }}
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
              padding: "10px",
              marginRight: "150px",
              marginLeft: "150px",
              marginBottom: "-2px",
              marginTop: "10px",
            }}
          >
            Edit Category
          </Typography>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="text"
                    name="categoryName"
                    label="Category Name"
                    value={selectedCategory?.categoryName || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    label="HRA Percentage"
                    name="hraPercentage"
                    value={selectedCategory?.hraPercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="taPercentage"
                    label="TA Percentage"
                    value={selectedCategory?.taPercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    label="Incentive Percentage"
                    name="incentivePercentage"
                    value={selectedCategory?.incentivePercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="spiPercentage"
                    label="SPI Percentage"
                    value={selectedCategory?.spiPercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    label="Medical Allowance Percentage"
                    name="medicalAllowancePercentage"
                    value={selectedCategory?.medicalAllowancePercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="pfPercentage"
                    label="PF Percentage"
                    value={selectedCategory?.pfPercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="esicPercentage"
                    label="ESIC Percentage"
                    value={selectedCategory?.esicPercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="professionalTaxPercentage"
                    label="Professional Tax Percentage"
                    value={selectedCategory?.professionalTaxPercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="incomeTaxPercentage"
                    label="Income Tax Percentage"
                    value={selectedCategory?.incomeTaxPercentage || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    name="totalPaidLeave"
                    label="Total Paid Leave"
                    value={selectedCategory?.totalPaidLeave || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid container justifyContent="center" spacing={2} mt={2}>
                  <Grid item>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => setShowUpdateModal(false)}
                        style={{ marginRight: "10px" }}
                      >
                        Close
                      </Button>
                      <Button type="submit" color="success" variant="contained">
                        Update
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>{" "}
            </Form>
          </Modal.Body>
        </Modal>

        {/* Info Modal */}
        <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
              padding: "10px",
              marginRight: "150px",
              marginLeft: "150px",
              marginBottom: "-2px",
              marginTop: "10px",
            }}
          >
            Category Information
          </Typography>
          <Modal.Body>
            <Container>
              <Box mt={2}>
                <Typography>
                  <strong>ID:</strong> {selectedCategory?.id}
                </Typography>
                <Typography>
                  <strong>Category Name:</strong>{" "}
                  {selectedCategory?.categoryName}
                </Typography>
                <Typography>
                  <strong>HRA Percentage:</strong>{" "}
                  {selectedCategory?.hraPercentage}
                </Typography>
                <Typography>
                  <strong>TA Percentage:</strong>{" "}
                  {selectedCategory?.taPercentage}
                </Typography>
                <Typography>
                  <strong>Incentive Percentage:</strong>{" "}
                  {selectedCategory?.incentivePercentage}
                </Typography>
                <Typography>
                  <strong>SPI Percentage:</strong>{" "}
                  {selectedCategory?.spiPercentage}
                </Typography>
                <Typography>
                  <strong>Medical Percentage:</strong>{" "}
                  {selectedCategory?.medicalAllowancePercentage}
                </Typography>
                <Typography>
                  <strong>PF Percentage:</strong>{" "}
                  {selectedCategory?.pfPercentage}
                </Typography>
                <Typography>
                  <strong>ESF Percentage:</strong>{" "}
                  {selectedCategory?.esfPercentage}
                </Typography>
                <Typography>
                  <strong>Professional Tax Percentage:</strong>{" "}
                  {selectedCategory?.professionalTaxPercentage}
                </Typography>
                <Typography>
                  <strong>Income Tax Percentage:</strong>{" "}
                  {selectedCategory?.incomeTaxPercentage}
                </Typography>
                <Typography>
                  <strong>Total Paid Leaves:</strong>{" "}
                  {selectedCategory?.totalPaidLeave}
                </Typography>
                <Typography>
                  <strong>Total Unpaid Leaves:</strong>{" "}
                  {selectedCategory?.totalUnpaidLeave}
                </Typography>
              </Box>
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
              variant="contained"
              onClick={() => setShowInfoModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer />
      </div>
    </>
  );
}
export default Category;
