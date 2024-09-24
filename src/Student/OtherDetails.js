import React, { useState,useEffect } from "react";
import {
  TextField,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Paper,
  Box,
} from "@mui/material";

import {
  stateOptions,
  districtOptions,
  speciallyAbledOptions,
  specialPercentage,
  disabilityTypes,
  yesNoOptions,
  domicilebool,
  //ebcYesNo,
  scholarshipDropdown,
} from "./DropdownData";

const OtherDetails = ({ formData, handleInputChange }) => {
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setSameAsPermanent(isChecked);
    if (isChecked) {
      handleInputChange({
        target: { name: "permanentAddress", value: formData.address },
      });
      handleInputChange({
        target: { name: "pdistrict", value: formData.district },
      });
      handleInputChange({
        target: { name: "ptaluka", value: formData.taluka },
      });
      handleInputChange({
        target: { name: "pcountry", value: formData.country },
      });
      handleInputChange({
        target: { name: "pcity", value: formData.city },
      });
      handleInputChange({
        target: { name: "pstate", value: formData.state },
      });
      handleInputChange({
        target: { name: "ppincode", value: formData.pincode },
      });
      handleInputChange({
        target: { name: "plandmark", value: formData.landmark },
      });
    }
  };
  useEffect(() => {
    // Set the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];
    handleInputChange({
      target: { name: "dateOfRegistration", value: currentDate },
    });
  }, [handleInputChange]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          name="handicap"
          label="Specially Abled / Divyang"
          value={formData.handicap ? "Yes" : "No"}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Please select</MenuItem>
          {speciallyAbledOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {formData.handicap === true && (
        <>
          <Grid item xs={12} sm={3}>
            <TextField
              name="disabilityType"
              label="Type of Disability"
              value={formData.disabilityType}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Please select disability type</MenuItem>
              {disabilityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="specialPercentage"
              label="Special/Disable Person Percentage"
              value={formData.specialPercentage}
              onChange={handleInputChange}
              fullWidth
              select
              type="number"
            >
              <MenuItem value="">Please select percentage</MenuItem>
              {specialPercentage.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </>
      )}

      <Grid item xs={12} sm={3}>
        <TextField
          name="domicilebool"
          label="Domicile"
          value={formData.domicilebool ? "Yes" : "No"}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Please select</MenuItem>
          {domicilebool.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {formData.domicilebool === true && (
        <Grid item xs={12} sm={3}>
          <TextField
            name="domicileNumber"
            label="Domicile Number"
            value={formData.domicileNumber}
            onChange={handleInputChange}
            fullWidth
            type="number"
          />
        </Grid>
      )}
      <Grid item xs={12} sm={3}>
        <TextField
          name="earthquake"
          label="Earthquake Affected"
          value={formData.earthquake ? "Yes" : "No"}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Please select</MenuItem>
          {yesNoOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {formData.earthquake === true && (
        <Grid item xs={12} sm={3}>
          <TextField
            name="earthquakeNumber"
            label="Earthquake affected certificate Number"
            value={formData.earthquakeNumber}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
      )}
      {/* <Grid item xs={12} sm={3}>
        <TextField
          name="ebc"
          label="EBC"
          value={formData.ebc ? "Yes" : "No"}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Please select</MenuItem>
          {ebcYesNo.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid> */}

      <Grid item xs={12} sm={3}>
        <TextField
          name="projectDifferentiated"
          label="Project Affected"
          value={formData.projectDifferentiated ? "Yes" : "No"}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Please select</MenuItem>
          {yesNoOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {formData.projectDifferentiated === true && (
        <Grid item xs={12} sm={3}>
          <TextField
            name="projectDifferentiatedNumber"
            label="Project Affected certificate Number"
            value={formData.projectDifferentiatedNumber}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
      )}
      <Grid item xs={12} sm={3}>
        <TextField
          name="scholarship"
          label="Scholarship"
         value={formData.scholarship ? "Yes" : "No"}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Please select</MenuItem>
          {yesNoOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
     {formData.scholarship === true && (
        <Grid item xs={12} sm={3}>
          <TextField
            name="scholarshipName"
            label="Scholarship Name"
            value={formData.scholarshipName}
            onChange={handleInputChange}
            fullWidth
            select
        >
          <MenuItem value="">Please select</MenuItem>
          {scholarshipDropdown.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      )} 
      <Grid item xs={12} sm={3}>
        <TextField
          name="dateOfRegistration"
          label="Date of Registration"
          type="date"
          value={formData.dateOfRegistration}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <h3>Address Info</h3>
        <Paper elevation={3}>
          <Box p={2} mt={2} mb={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ className: "required-asterisk" }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="landmark"
                  label="Landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ className: "required-asterisk" }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  InputLabelProps={{ className: "required-asterisk" }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="taluka"
                  label="Taluka"
                  value={formData.taluka}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="district"
                  label="District"
                  value={formData.district}
                  onChange={handleInputChange}
                  fullWidth
                  select
                >
                  <MenuItem value="">Please select District</MenuItem>
                  {districtOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  fullWidth
                  select
                >
                  <MenuItem value="">Please select State</MenuItem>
                  {stateOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="country"
                  label="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>{" "}
              <Grid item xs={12} sm={3}>
                <TextField
                  name="pincode"
                  label="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  fullWidth
                  type="number"
                  required
                  InputLabelProps={{ className: "required-asterisk" }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsPermanent}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Click if address is same as permanent address"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="permanentAddress"
                  label="Permanent Address"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={sameAsPermanent}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="plandmark"
                  label="Permanent Landmark"
                  value={formData.plandmark}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={sameAsPermanent}
                />
              </Grid>{" "}
              <Grid item xs={12} sm={3}>
                <TextField
                  name="pcity"
                  label="Permanent City"
                  value={formData.pcity}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={sameAsPermanent}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="ptaluka"
                  label="Permanent Taluka"
                  value={formData.ptaluka}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={sameAsPermanent}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="pdistrict"
                  label="Permanent District"
                  value={formData.pdistrict}
                  onChange={handleInputChange}
                  fullWidth
                  select
                  disabled={sameAsPermanent}
                >
                  <MenuItem value="">Please select District</MenuItem>
                  {districtOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="pstate"
                  label="Permanent State"
                  value={formData.pstate}
                  onChange={handleInputChange}
                  fullWidth
                  select
                  disabled={sameAsPermanent}
                >
                  <MenuItem value="">Please select State</MenuItem>
                  {stateOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="pcountry"
                  label="Permanent Country"
                  value={formData.pcountry}
                  onChange={handleInputChange}
                  fullWidth
                  disabled={sameAsPermanent}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name="ppincode"
                  label="Permanent Pincode"
                  value={formData.ppincode}
                  onChange={handleInputChange}
                  fullWidth
                  type="number"
                  disabled={sameAsPermanent}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OtherDetails;
