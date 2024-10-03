import React, { useEffect, useState } from "react";
import { TextField, Grid, MenuItem, Box, Paper } from "@mui/material";
// import "./AstricRed.css";
import axios from "axios";
import {
  gender,
  bloodGroup,
  maritalStatus,
  incomeRanges,
  title,
  minority,
  nationality,
  birthState,
  birthDistrict,
  castCategory,
  religionOptions,
  fProfessions,
  languages,
} from "./DropdownData.js";

const initialFormData = {
  standardOptions: "",
  medium: "",
  title: "",
  firstName: "",
  middleName: "",
  surname: "",
  full_name: "",
  gender: "",
  bloodGroup: "",
  motherTongue: "",
  maritalStatus: "",
  emailAddress: "",
  religion: "",
  minority: false,
  minorityType: "",
  castCategory: "",
  casteCertificateNumber: "",
  casteValidation: false,
  casteValidationNumber: "",
  cast: "",
  subCaste: "",
  dateOfBirth: "",
  age: "",
  birthPlace: "",
  birthCountry: "",
  birthState: "",
  birthDistrict: "",
  birthTaluka: "",
  fathersName: "",
  motherName: "",
  fatherProfession: "",
  fathersContact: "",
  phoneNumber: "",
  whatsappNumber: "",
  panNumber: "",
  aadharNumber: "",
  udiseNo: "",
  saralNo: "",
  incomeRanges: "",
  nationality: "",
  othernationality: "",
};

const PersonalDetails = ({ formData = initialFormData, handleInputChange }) => {
  const [standardOptions, setStandards] = useState([]);
  const [medium, setMedium] = useState([]);
  const [showOtherNationality, setShowOtherNationality] = useState(false);
  const [errors, setErrors] = useState({
    panNumber: "",
    emailAddress: "",
  });
  const institutecode = () => localStorage.getItem("institutecode");
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };
  const handleNationalityChange = (event) => {
    const { value } = event.target;
    setShowOtherNationality(value === "Other");
    handleInputChange(event);
    if (value !== "Other") {
      handleInputChange({ target: { name: "othernationality", value: "" } });
    }
  };
  const validatePanNumber = (panNumber) => {
    const panPattern = /^[A-Z]{5}[0-9]{3}[A-Z]{1}$/;
    if (!panPattern.test(panNumber)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        panNumber: 'Invalid PAN number. Format: ABCDE1233F',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        panNumber: '',
      }));
    }
  };
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailAddress: "Invalid email address",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        emailAddress: "",
      }));
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);
    if (name === "panNumber") {
      validatePanNumber(value);
    } else if (name === "emailAddress") {
      validateEmail(value);
    }
  };
  useEffect(() => {
    axios
      .get(`http://13.233.43.240:8080/all?institutecode=${institutecode()}`)
      .then((response) => {
        setStandards(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the standards!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://13.233.43.240:8080/getall?institutecode=${institutecode()}`)
      .then((response) => {
        setMedium(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the Medium!", error);
      });
  }, []);

  useEffect(() => {
    if (formData.firstName && formData.middleName && formData.surname) {
      const fullName = `${formData.firstName} ${formData.middleName} ${formData.surname}`;
      if (formData.full_name !== fullName) {
        handleInputChange({ target: { name: "full_name", value: fullName } });
      }
    }
  }, [
    formData.firstName,
    formData.middleName,
    formData.surname,
    formData.full_name,
    handleInputChange,
  ]);

  useEffect(() => {
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      if (formData.age !== age.toString()) {
        handleInputChange({ target: { name: "age", value: age.toString() } });
      }
    }
  }, [formData.dateOfBirth, formData.age, handleInputChange]);

  return (
    <div style={{ display: "flex" }}>
      <container
        maxWidth="lg"
        sx={{ marginTop: "100px", display: "flex", justifyContent: "center" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              name="standardOptions"
              label="Standard (Class)"
              value={formData.standardOptions}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select Standard</MenuItem>
              {standardOptions.map((standard) => (
                <MenuItem
                  key={standard.standardname}
                  value={standard.standardname}
                >
                  {standard.standardname}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              name="medium"
              label="Medium"
              value={formData.medium}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select Medium</MenuItem>
              {medium.map((option) => (
                <MenuItem key={option.mediumname} value={option.mediumname}>
                  {option.mediumname}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select title</MenuItem>
              {title.map((title) => (
                <MenuItem key={title} value={title}>
                  {title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="firstName"
              label="Student First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="middleName"
              label="Middle Name"
              value={formData.middleName}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="surname"
              label="Last Name / Surname"
              value={formData.surname}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="full_name"
              label="Student's Full Name"
              value={formData.full_name}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="gender"
              label="Gender"
              value={formData.gender}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select gender</MenuItem>
              {gender.map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {gender}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="bloodGroup"
              label="Blood Group"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select blood group</MenuItem>
              {bloodGroup.map((bloodGroup) => (
                <MenuItem key={bloodGroup} value={bloodGroup}>
                  {bloodGroup}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              name="motherTongue"
              label="Mother Tongue"
              value={formData.motherTongue}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select gender</MenuItem>
              {languages.map((languages) => (
                <MenuItem key={languages} value={languages}>
                  {languages}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="maritalStatus"
              label="Marital Status"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select Marital Status</MenuItem>
              {maritalStatus.map((maritalStatus) => (
                <MenuItem key={maritalStatus} value={maritalStatus}>
                  {maritalStatus}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="emailAddress"
              label="Email"
              value={formData.emailAddress}
              onChange={handleFieldChange}
              fullWidth
              required
              InputLabelProps={{ className: "required-asterisk" }}
              error={!!errors.emailAddress}
              helperText={errors.emailAddress}
            />
          </Grid>

          <Grid item xs={12}>
            <h3>Religion/Caste</h3>
            <Paper elevation={3}>
              <Box p={2} mt={2} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="religion"
                      label="Religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      InputLabelProps={{ className: "required-asterisk" }}
                      fullWidth
                      select
                      required
                    >
                      <MenuItem value="">Please select religion</MenuItem>
                      {religionOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="minority"
                      label="Minority"
                      value={formData.minority ? "Yes" : "No"}
                      onChange={handleInputChange}
                      fullWidth
                      select
                      type="number"
                    >
                      <MenuItem value="">Select Minority</MenuItem>
                      {minority.map((minority) => (
                        <MenuItem key={minority} value={minority}>
                          {minority}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {formData.minority && (
                    <Grid item xs={12} sm={3}>
                      <TextField
                        name="minorityType"
                        label="Minority Type"
                        value={formData.minorityType}
                        onChange={handleInputChange}
                        fullWidth
                        select
                      >
                        <MenuItem value="">Select Minority Type</MenuItem>
                        <MenuItem value="Muslims">Muslims</MenuItem>
                        <MenuItem value="Sikhs">Sikhs</MenuItem>
                        <MenuItem value="Christians">Christians</MenuItem>
                        <MenuItem value="Buddhists">Buddhists</MenuItem>
                        <MenuItem value="Jain">Jain</MenuItem>
                        <MenuItem value="Zorastrians (Parsis)">
                          Zorastrians (Parsis)
                        </MenuItem>
                      </TextField>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="castCategory"
                      label="Caste Category"
                      value={formData.castCategory}
                      onChange={handleInputChange}
                      fullWidth
                      select
                    >
                      <MenuItem value="">Please select caste category</MenuItem>
                      {castCategory.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {formData.castCategory !== "General" && (
                    <Grid item xs={12} sm={3}>
                      <TextField
                        name="casteCertificateNumber"
                        label="Caste Certificate Number"
                        value={formData.casteCertificateNumber}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="casteValidation"
                      label="Caste Validity"
                      value={formData.casteValidation ? "Yes" : "No"}
                      onChange={handleInputChange}
                      fullWidth
                      select
                    >
                      <MenuItem value="Yes">Yes</MenuItem>
                      <MenuItem value="No">No</MenuItem>
                    </TextField>
                  </Grid>
                  {formData.casteValidation && (
                    <Grid item xs={12} sm={3}>
                      <TextField
                        name="casteValidationNumber"
                        label="Caste Validity Number"
                        value={formData.casteValidationNumber}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="cast"
                      label="Caste"
                      value={formData.cast}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="subCaste"
                      label="Sub Caste"
                      value={formData.subCaste}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <h3>Birth Info</h3>
            <Paper elevation={3}>
              <Box p={2} mt={2} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="dateOfBirth"
                      label="Birth Date"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="age"
                      label="Age"
                      value={formData.age}
                      onChange={handleInputChange}
                      InputProps={{ readOnly: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="birthPlace"
                      label="Place of Birth"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>{" "}
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="birthTaluka"
                      label="Taluka of Birth"
                      value={formData.birthTaluka}
                      onChange={handleInputChange}
                      fullWidth
                    ></TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="birthDistrict"
                      label="District of Birth"
                      value={formData.birthDistrict}
                      onChange={handleInputChange}
                      fullWidth
                      select
                    >
                      <MenuItem value="">Please select District</MenuItem>
                      {birthDistrict.map((birthDistrict) => (
                        <MenuItem key={birthDistrict} value={birthDistrict}>
                          {birthDistrict}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="birthState"
                      label="State of Birth"
                      value={formData.birthState}
                      onChange={handleInputChange}
                      fullWidth
                      select
                    >
                      <MenuItem value="">Please select State</MenuItem>
                      {birthState.map((birthState) => (
                        <MenuItem key={birthState} value={birthState}>
                          {birthState}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="birthCountry"
                      label="Country of Birth"
                      value={formData.birthCountry}
                      onChange={handleInputChange}
                      fullWidth
                      select
                    >
                      <MenuItem value="">Please select Country</MenuItem>
                      {nationality.map((nationality) => (
                        <MenuItem key={nationality} value={nationality}>
                          {nationality}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="nationality"
                      label="Nationality"
                      value={formData.nationality}
                      onChange={handleNationalityChange}
                      fullWidth
                      select
                    >
                      <MenuItem value="">Please select nationality</MenuItem>
                      {nationality.map((nationality) => (
                        <MenuItem key={nationality} value={nationality}>
                          {nationality}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {formData.nationality === "Other" && (
                    <Grid item xs={12} sm={3}>
                      <TextField
                        name="othernationality"
                        label="Please specify"
                        value={formData.othernationality}
                        onChange={handleInputChange}
                        fullWidth
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <h3>Family/Contact Info</h3>
            <Paper elevation={3}>
              <Box p={2} mt={2} mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="fathersName"
                      label="Father's Full Name"
                      value={formData.fathersName}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="motherName"
                      label=" Mother's Full Name"
                      value={formData.motherName}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="fatherProfession"
                      label="Father's Profession"
                      value={formData.fatherProfession}
                      onChange={handleInputChange}
                      fullWidth
                    >
                      <MenuItem value="">Please Select Income Range</MenuItem>
                      {fProfessions.map((fProfessions) => (
                        <MenuItem key={fProfessions} value={fProfessions}>
                          {fProfessions}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="incomeRanges"
                      label="Family Income"
                      value={formData.incomeRanges}
                      onChange={handleInputChange}
                      fullWidth
                      select
                    >
                      <MenuItem value="">Please Select Income Range</MenuItem>
                      {incomeRanges.map((income) => (
                        <MenuItem key={income} value={income}>
                          {income}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="fathersContact"
                      label="Father's Contact No"
                      value={formData.fathersContact}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{
                        inputMode: "numeric",
                        maxLength: 10,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="whatsappNumber"
                      label="What'sApp No"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      fullWidth
                      inputProps={{
                        inputMode: "numeric",
                        maxLength: 10,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="phoneNumber"
              label="Student Contact No"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                inputMode: "numeric",
                maxLength: 10,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="panNumber"
              label="Student PAN Number"
              value={formData.panNumber}
              onChange={handleFieldChange}
              fullWidth
              required
              InputLabelProps={{ className: "required-asterisk" }}
              error={!!errors.panNumber}
              helperText={errors.panNumber}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="aadharNumber"
              label="Student Aadhaar No."
              value={formData.aadharNumber}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{
                inputMode: "numeric",
                maxLength: 12,
              }}
              InputLabelProps={{ className: "required-asterisk" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="udiseNo"
              label="Udise No."
              value={formData.udiseNo}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="saralNo"
              label="Saral No."
              value={formData.saralNo}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </container>
    </div>
  );
};

export default PersonalDetails;
