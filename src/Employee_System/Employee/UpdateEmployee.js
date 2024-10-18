import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button,Grid, Typography, MenuItem, FormControl } from "@mui/material";
import {
    BG,
    Gender,
    EmployeeType,
    DutyType,
    ShiftType,
    districts,
  } from "./dropdownData.js";
  import Userservice from "./Userservice";
  import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
const UpdateEmployee = ({ user, onClose }) => {
  const [updatedUser, setUpdatedUser] = useState(user);
  const [users, setUsers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const countries = Country.getAllCountries();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [category, setCategory] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [permanentStates, setPermanentStates] = useState([]);
  const [permanentCities, setPermanentCities] = useState([]);
  const [permanentDistrictList, setPermanentDistrictList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState("");
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );
  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };
  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    setUpdatedUser((prevState) => ({
      ...prevState,
      [fieldName]: file,
    }));
  };

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      setUpdatedUser((prevState) => ({
        ...prevState,
        [name]: value,
        state: "", // Reset state and city
        city: "",
      }));
    } else if (name === "state") {
        setUpdatedUser((prevState) => ({
        ...prevState,
        [name]: value,
        city: "", // Reset city
      }));
    } else if (name === "permanentCountry") {
      setUpdatedUser((prevState) => ({
        ...prevState,
        [name]: value,
        permanentstate: "", // Reset permanent state and city
        permanentcity: "",
      }));
    } else if (name === "permanentstate") {
      setUpdatedUser((prevState) => ({
        ...prevState,
        [name]: value,
        permanentcity: "", // Reset permanent city
      }));
    } else if (name === "dob" || name === "joiningDate" || name === "enddate") {
      setUpdatedUser((prevState) => ({
        ...prevState,
 
        [name]: value, // value should be in the format `YYYY-MM-DD`
      }));
    } else {
      setUpdatedUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleDocuments = async () => {
    if (updatedUser) {
      try {
        await Userservice.updateDocuments(updatedUser.empID, updatedUser);
        await fetchUsers();
        toast.success("File updated successfully"); // Notify success
      } catch (error) {
        setError("Error updating Employee: " + error.message);
        toast.error(`Error updating Employee: ${error.message}`); // Notify error
      }
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await Userservice.getUser();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleUpdate = async () => {
    if (updatedUser) {
      try {
        await Userservice.updateUser(updatedUser.empID, updatedUser);
        await fetchUsers();
        toast.success("Employee updated successfully"); // Notify success
      } catch (error) {
        setError("Error updating Employee: " + error.message);
        toast.error(`Error updating Employee: ${error.message}`); // Notify error
      }
    }
  };

  const handleSubmit = () => {
    // Handle form submit logic here (e.g., API call)
    onClose();
  };

  useEffect(() => {
      if (updatedUser?.country) {
        const selectedCountry = countries.find(
          (country) => country.name === updatedUser?.country
        );
        setStates(
          selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []
        );
      }
    }, [updatedUser?.country, countries]);
  
    useEffect(() => {
      if (updatedUser?.state) {
        const selectedState = states.find(
          (state) => state.name === updatedUser?.state
        );
        setCities(
          selectedState
            ? City.getCitiesOfState(
                selectedState.countryCode,
                selectedState.isoCode
              )
            : []
        );
        // Set districts based on selected state
        setDistrictList(districts[updatedUser.state] || []);
      }
    }, [updatedUser?.state, states]);
  
    useEffect(() => {
      if (updatedUser?.permanentCountry) {
        const selectedCountry = countries.find(
          (country) => country.name === updatedUser?.permanentCountry
        );
        setPermanentStates(
          selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []
        );
      }
    }, [updatedUser?.permanentCountry, countries]);
  
    useEffect(() => {
      if (updatedUser?.permanentstate) {
        const selectedState = permanentStates.find(
          (state) => state.name === updatedUser?.permanentstate
        );
        setPermanentCities(
          selectedState
            ? City.getCitiesOfState(
                selectedState.countryCode,
                selectedState.isoCode
              )
            : []
        );
        // Set permanent districts based on selected state
        setPermanentDistrictList(districts[updatedUser.permanentstate] || []);
      }
    }, [updatedUser?.permanentstate, permanentStates]);

    useEffect(() => {
        fetchDepartments();
      }, [institutecode]);
      const fetchDepartments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`
          );
          setDepartments(response.data);
        } catch (error) {
          console.error("Error fetching departments:", error);
          // Handle error fetching departments (e.g., show error message)
        }
      };
      useEffect(() => {
        fetchUsers();
      }, [institutecode]);
      const loadCategory = async () => {
        try {
          const result = await axios.get(
            `http://localhost:8082/categories/all?institutecode=${institutecode}`
          );
          setCategory(result.data);
        } catch (error) {
          console.error("Error fetching in Category of Employee", error);
        }
      };
      useEffect(() => {
        loadCategory();
      }, [institutecode]);

  return (
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
                Update Employee
              </Typography>
              <hr />
              <br />
              <form>
                <Grid container spacing={3} className="textField-root">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={updatedUser?.fullName || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        name="bloodGroup"
                        value={updatedUser?.bloodGroup}
                        onChange={handleInputChange}
                        label="Blood Group"
                        select
                      >
                        {BG.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        name="gender"
                        value={updatedUser?.gender}
                        onChange={handleInputChange}
                        label="Gender"
                        select
                      >
                        {Gender.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={updatedUser?.email || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="date"
                      label="DOB"
                      name="dob"
                      value={updatedUser?.dob}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="Aadhar No"
                      name="adharNo"
                      value={updatedUser?.adharNo}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Pan No"
                      name="panNo"
                      value={updatedUser?.panNo}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="Mobile No"
                      name="mobileNo"
                      value={updatedUser?.mobileNo}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="Parent No"
                      name="parentNo"
                      value={updatedUser?.parentNo}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        name="country"
                        value={updatedUser?.country}
                        onChange={handleInputChange}
                        label="Country"
                        select
                      >
                        {countries.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        name="state"
                        value={updatedUser?.state}
                        onChange={handleInputChange}
                        label="State"
                        select
                      >
                        {states.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* District */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        name="district"
                        value={updatedUser?.district}
                        onChange={handleInputChange}
                        label="District"
                        select
                      >
                        {districtList.length > 0 ? (
                          districtList.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">
                            <em>Select a state first</em>
                          </MenuItem>
                        )}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* City */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      name="city"
                      value={updatedUser?.city}
                      onChange={handleInputChange}
                      label="City/Village/Nagar"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      name="taluka"
                      value={updatedUser?.taluka}
                      onChange={handleInputChange}
                      label="Taluka"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Pincode"
                      name="pinCode"
                      value={updatedUser?.pinCode}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Landmark"
                      name="landmark"
                      value={updatedUser?.landmark}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Current Address"
                      name="currentAddress"
                      value={updatedUser?.currentAddress}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Permanent Address"
                      name="permanentAddress"
                      value={updatedUser?.permanentAddress}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        name="permanentCountry"
                        value={updatedUser.permanentCountry}
                        onChange={handleInputChange}
                        label="Permanent Country"
                        select
                      >
                        {countries.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        name="permanentstate"
                        value={updatedUser?.permanentstate}
                        onChange={handleInputChange}
                        label="Permanent State"
                        select
                      >
                        {permanentStates.map((option) => (
                          <MenuItem key={option.name} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* Permanent District */}
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        name="permanentdistrict"
                        value={updatedUser?.permanentdistrict}
                        onChange={handleInputChange}
                        label="Permanent District"
                        select
                      >
                        {permanentDistrictList.length > 0 ? (
                          permanentDistrictList.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">
                            <em>Select a state first</em>
                          </MenuItem>
                        )}
                      </TextField>
                    </FormControl>
                  </Grid>
                  {/* Permanent City */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      name="permanentcity"
                      value={updatedUser.permanentcity}
                      onChange={handleInputChange}
                      label="Permanent City/Village/Nagar"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      name="permanenttaluka"
                      value={updatedUser?.permanenttaluka}
                      onChange={handleInputChange}
                      label="Permanent Taluka"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Permanent Pincode"
                      name="permanentpinCode"
                      value={updatedUser?.permanentpinCode}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Permanent Landmark"
                      name="permanentlandmark"
                      value={updatedUser?.permanentlandmark}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
  <TextField
    type="date"
    label="Joining Date"
    name="joiningDate"
    value={updatedUser?.joiningDate || ''}  // Ensure a value is provided
    onChange={handleInputChange}
    fullWidth
    InputLabelProps={{ shrink: true }}  // Ensure the label shrinks properly
  />
</Grid>

                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        required
                        name="department"
                        value={updatedUser?.department}
                        onChange={handleInputChange}
                        label="Department"
                        select
                      >
                        {departments.map((option) => (
                          <MenuItem key={option.id} value={option.department}>
                            {option.department}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        name="employeecategory"
                        value={updatedUser?.employeecategory}
                        onChange={handleInputChange}
                        label="Category"
                        select
                      >
                        {category.map((option) => (
                          <MenuItem key={option} value={option.categoryName}>
                            {option.categoryName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Work Location"
                      name="workLocation"
                      value={updatedUser?.workLocation || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Designation"
                      name="workDetail"
                      value={updatedUser?.workDetail || ""}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        name="dutyType"
                        value={updatedUser?.dutyType}
                        onChange={handleInputChange}
                        label="Duty Type"
                        select
                      >
                        {DutyType.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        name="employeeType"
                        value={updatedUser?.employeeType}
                        onChange={handleInputChange}
                        label="Employee Type"
                        select
                      >
                        {EmployeeType.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="Salary"
                      name="salary"
                      value={updatedUser?.salary}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="CPF No"
                      name="cpfNo"
                      value={updatedUser?.cpfNo}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="number"
                      label="ESIC No"
                      name="esicNo"
                      value={updatedUser?.esicNo}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="text"
                      label="Basic Qualification"
                      name="basicQualification"
                      value={updatedUser?.basicQualification}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="text"
                      label="Professional Qualification"
                      name="professionalQualification"
                      value={updatedUser?.professionalQualification}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <TextField
                        name="shift"
                        value={updatedUser?.shift}
                        onChange={handleInputChange}
                        label="Shift"
                        select
                      >
                        {ShiftType.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="time"
                      label="Shift Start Time"
                      name="shiftStartTime"
                      value={updatedUser?.shiftStartTime}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      type="time"
                      label="Shift End Time"
                      name="shiftEndTime"
                      value={updatedUser?.shiftEndTime}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 2, ml: 45 }}>
                    <Button variant="contained" onClick={handleUpdate}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <hr />
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "#24A0ED",
                        textAlign: "center",
                      }}
                    >
                      Update Documents
                    </Typography>
                    <hr />
                  </Grid>

                  <br />
                  <Grid item xs={12} sm={4}>
  <TextField
    required
    type="file"
    accept=".jpeg"
    name="idProof"
    onChange={(e) => handleFileChange(e, "idProof")}
    helperText="ID Proof (JPEG, max 1MB)"
  />
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleDocuments("idProof")}
  >
    Update
  </Button>
</Grid>

<Grid item xs={12} sm={4}>
  <TextField
    required
    type="file"
    accept=".jpeg"
    name="employeePhoto"
    onChange={(e) => handleFileChange(e, "employeePhoto")}
    helperText="Employee Photo (JPEG, max 1MB)"
  />
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleDocuments("employeePhoto")}
  >
    Update
  </Button>
</Grid>

<Grid item xs={12} sm={4}>
  <TextField
    required
    type="file"
    accept=".pdf"
    name="resume"
    onChange={(e) => handleFileChange(e, "resume")}
    helperText="Resume (PDF, max 1MB)"
  />
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleDocuments("resume")}
  >
    Update
  </Button>
</Grid>

<Grid item xs={12} sm={4}>
  <TextField
    required
    type="file"
    accept=".pdf"
    name="addressProof"
    onChange={(e) => handleFileChange(e, "addressProof")}
    helperText="Address Proof (PDF, max 1MB)"
  />
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleDocuments("addressProof")}
  >
    Update
  </Button>
</Grid>

<Grid item xs={12} sm={4}>
  <TextField
    required
    type="file"
    accept=".pdf"
    name="experienceLetter"
    onChange={(e) => handleFileChange(e, "experienceLetter")}
    helperText="Experience Letter (PDF, max 1MB)"
  />
  <Button
    variant="contained"
    color="primary"
    onClick={() => handleDocuments("experienceLetter")}
  >
    Update
  </Button>
</Grid>

                  {/* <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    
                    name="status"
                    value={updatedUser?.status}
                    onChange={handleInputChange}
                    label="Status"
                    select
                  >
                      <MenuItem value={"Joined"}>
                        Joined
                      </MenuItem>
                      <MenuItem value={"Terminated"}>
                        Terminated
                      </MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="date"
                  label="End Date"
                  name="enddate"
                  value={updatedUser?.enddate}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}
                  <Grid item xs={12} sx={{ mt: 2, ml: 75 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={onClose}
                      sx={{ ml: 2 }}
                    >
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
    </Modal>
  );
};

export default UpdateEmployee;
