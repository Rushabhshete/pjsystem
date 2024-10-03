import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import { stateOptions } from "./EnquiryDropdown";

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

export default function UpdateEnquiry() {
  const [examOptions, setExamOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [conductedBy, setConductedBy] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [Enquiry, setEnquiry] = useState({
    name: "",
    mobile: "",
    // adminemail:'',
    institutecode: "",
    email: "",
    source_by: "",
    exam: "",
    conduct_by: "",
    status1: "",
    callBackDate: "",
    callBackTime: "",
    remark: "",
    enquiryDate: "",
  });
  // const [adminemail, setAdminemail]=useState(localStorage.getItem('loggedInUserEmail') || '');
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );
  const {
    name,
    mobile,
    email,
    source_by,
    status1,
    exam,
    conduct_by,
    remark,
    enquiryDate,
    callBackDate,
    callBackTime,
    dob,
    gender,
    motherTongue,
    address,
    landmark,
    state,
    district,
    fatherProfession,
    educationQualification,
    annualIncome,
    photo,
  } = Enquiry;
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [districts, setDistricts] = useState([]);
  const onInputChange = (e) => {
    setEnquiry({ ...Enquiry, [e.target.name]: e.target.value });
  };

  const loadExams = async () => {
    try {
      const response = await axios.get(
        `http://13.233.43.240:8086/getAllExam?institutecode=${institutecode}`
      );
      setExamOptions(response.data);
    } catch (error) {
      console.error("Error fetching exam options:", error);
    }
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setSelectedState(selectedState);
    setDistricts(stateOptions[selectedState]);
    setEnquiry({ ...Enquiry, state: selectedState, district: '' });
  };

  const handleFileChange = (e) => {
    setEnquiry({ ...Enquiry, photo: e.target.files[0] });
  };

  const loadSources = async () => {
    try {
      const sources = await axios.get(
        `http://13.233.43.240:8086/getAllSource?institutecode=${institutecode}`
      );
      setSourceOptions(sources.data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  };   

  const loadConducts = async () => {
    try {
      const conducted = await axios.get(
        `http://13.233.43.240:8086/get/getAllConductModels?institutecode=${institutecode}`
      );
      setConductedBy(conducted.data);
    } catch (error) {
      console.error("Error fetching conducts:", error);
    }
  };

  useEffect(() => {
    loadExams();
    loadSources();
    loadConducts();
  }, []);

  useEffect(
    () => {
      const loadUser = async () => {
        try {
          const result = await axios.get(
            `http://13.233.43.240:8086/get/enquiry/${id}`
          );
          setEnquiry(result.data);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      loadUser();
    },
    [id],
    [institutecode]
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://13.233.43.240:8086/updateenquiry/${id}`, Enquiry);
      toast.success("Enquiry Updated Successfully")
      setTimeout(() => {
        navigate("/layout/report"); // Navigate after a delay
      }, 2000); // Adjust time as needed
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const enquiryDateRef = useRef();
  const handleEnquiryDateClick = () => {
    enquiryDateRef.current.focus();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://13.233.43.240:8086/deleteenquiry/${id}`);
      toast.success("Enquiry Deleted Successfully");
      navigate("/layout/report");
      
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!institutecode) {
          console.error("No institutecode found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://13.233.43.240:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [institutecode]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false); // Close the Snackbar
  };

  return (
    <Container maxWidth="false" sx={{ padding: 2, width: "100%" }}>
      <ToastContainer
      autoClose={1000} // Toast will close automatically after 5 seconds
      position="top-right" // Position of the toast
      hideProgressBar={false} // Show or hide the progress bar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
      <Box textAlign="center" sx={{ width: "100%" }}>
        <PopTypography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "#24A0ED",
            borderRadius: "150px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          Update Enquiry
        </PopTypography>
        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={2} className="textField-root">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                name="name"
                value={name}
                onChange={onInputChange}
                fullWidth
                size="small"
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone No."
                variant="outlined"
                name="mobile"
                value={mobile}
                onChange={onInputChange}
                fullWidth
                size="small"
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                name="email"
                value={email}
                onChange={onInputChange}
                fullWidth
                size="small"
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="exam-label">Exam</InputLabel>
                <Select
                  labelId="exam-label"
                  name="exam"
                  value={exam}
                  onChange={onInputChange}
                  label="Exam"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="">
                    <em>Select Exam</em>
                  </MenuItem>
                  {examOptions.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.name}
                      style={{ textAlign: "left" }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="source-label">Source By</InputLabel>
                <Select
                  labelId="source-label"
                  name="source_by"
                  value={source_by}
                  onChange={onInputChange}
                  label="Source By"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="">
                    <em>Select Source</em>
                  </MenuItem>
                  {sourceOptions.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.name}
                      style={{ textAlign: "left" }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="conduct-label">Conducted By</InputLabel>
                <Select
                  labelId="conduct-label"
                  name="conduct_by"
                  value={conduct_by}
                  onChange={onInputChange}
                  label="Conducted By"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="">
                    <em>Select Conduct</em>
                  </MenuItem>
                  {conductedBy.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={option.name}
                      style={{ textAlign: "left" }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status1"
                  value={status1}
                  onChange={onInputChange}
                  label="Status"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        width: 250,
                      },
                    },
                  }}
                  sx={{ textAlign: "left" }}
                >
                  <MenuItem value="Call Back">Call Back</MenuItem>
                  <MenuItem value="Interested">Interested</MenuItem>
                  <MenuItem value="Not Interested">Not Interested</MenuItem>
                  <MenuItem value="DND">DND</MenuItem>
                  <MenuItem value="Ringing">Ringing</MenuItem>
                  <MenuItem value="Switch Off">Switch Off</MenuItem>
                  <MenuItem value="Waiting">Waiting</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {status1 === "Call Back" && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Select Date"
                    type="date"
                    variant="outlined"
                    name="callBackDate"
                    value={callBackDate}
                    onChange={onInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    InputProps={{
                      style: { textAlign: "left" },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Select Time"
                    type="time"
                    variant="outlined"
                    name="callBackTime"
                    value={callBackTime}
                    onChange={onInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    InputProps={{
                      style: { textAlign: "left" },
                    }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Enquiry Date"
                type="date"
                variant="outlined"
                name="enquiryDate"
                value={enquiryDate}
                onChange={onInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
                inputRef={enquiryDateRef}
                onClick={handleEnquiryDateClick}
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Remark"
                variant="outlined"
                name="remark"
                value={remark}
                onChange={onInputChange}
                fullWidth
                size="small"
                multiline
                rows={4}
                InputProps={{
                  style: { textAlign: "left" },
                }}
              />
            </Grid>
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
                <MenuItem value="">
                  Select
                </MenuItem>
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
                <MenuItem value="All">
                  Select State
                </MenuItem>
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
                <MenuItem value="All">
                  Select District
                </MenuItem>
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

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <TextField
                name="educationQualification"
                value={Enquiry.educationQualification}
                onChange={onInputChange}
                label="Education Qualification"
                select
              >
                <MenuItem value="">
                  Select
                </MenuItem>
                <MenuItem value="10th">10th</MenuItem>
                <MenuItem value="12th">12th</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
                <MenuItem value="Post-Graduate">Post-Graduate</MenuItem>
              </TextField>
            </FormControl>
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
    InputLabelProps={{ shrink: true }}  // This ensures the label stays above the field when a file is chosen
  />
</Grid>
          </Grid>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="warning"
              component={Link}
              to="/layout/report"
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Box display="flex" gap={2}>
              <Button
                sx={{ mt: 2, mr: 2 }}
                variant="contained"
                color="error"
                onClick={handleDeleteDialogOpen}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                sx={{ mt: 2, mr: 2 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Snackbar for success messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle align="center" sx={{ backgroundColor: "#f5f5f5" }}>
          <strong style={{ color: "#d32f2f" }}>Delete Enquiry</strong>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            <strong>Are you sure you want to delete this enquiry?</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
