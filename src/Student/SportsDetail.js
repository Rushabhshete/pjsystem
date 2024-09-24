import React from "react";
import { Grid, TextField, MenuItem } from "@mui/material";
import {
  sportYesNo,
  sportsName,
  levelOfParticipation,
  noOfYearsPlayed,
  sportsInjuries,
  heightOptions,
  weightOptions,
} from "./DropdownData.js";

const SportsDetail = ({ formData, handleInputChange }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          name="sportYesNo"
          label="Are You Into Sports"
          value={formData.sportYesNo  ? "Yes" : "No"}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Please select</MenuItem>
          {sportYesNo.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {formData.sportYesNo === true && (
        <>
          <Grid item xs={12} sm={3}>
            <TextField
              name="sportsName"
              label="Name Of Sport"
              value={formData.sportsName}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Select The Name Of Sport</MenuItem>
              {sportsName.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
        <TextField
          name="levelOfParticipation"
          label="Level of Participation"
          value={formData.levelOfParticipation}
          onChange={handleInputChange}
          fullWidth
          select
        >
          <MenuItem value="">Select Participation Level</MenuItem>
          {levelOfParticipation.map((level) => (
            <MenuItem key={level} value={level}>
              {level}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {formData.levelOfParticipation === "International Level" && (
        <Grid item xs={12} sm={3}>
          <TextField
            name="internationaldetail"
            label="International Level Detail"
            value={formData.internationaldetail}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
      )}
          <Grid item xs={12} sm={3}>
            <TextField
              name="noOfYearsPlayed"
              label="Number of Years Played"
              value={formData.noOfYearsPlayed}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Select Number of Years</MenuItem>
              {noOfYearsPlayed.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="achievement"
              label="Achievement"
              value={formData.achievement}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              name="sportsInjuries"
              label="Known Medical Injuries Related to Sports"
              value={formData.sportsInjuries}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Select Known Medical Injuries</MenuItem>
              {sportsInjuries.map((injury) => (
                <MenuItem key={injury} value={injury}>
                  {injury}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="height"
              label="Height"
              value={formData.height}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Select Height</MenuItem>
              {heightOptions.map((height) => (
                <MenuItem key={height} value={height}>
                  {height}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              name="weight"
              label="Weight"
              value={formData.weight}
              onChange={handleInputChange}
              fullWidth
              select
            >
              <MenuItem value="">Select Weight</MenuItem>
              {weightOptions.map((weight) => (
                <MenuItem key={weight} value={weight}>
                  {weight}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default SportsDetail;
