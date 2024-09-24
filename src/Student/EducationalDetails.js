import React, { useState, useEffect, useMemo } from "react";
import {
  TextField,
  Grid,
  MenuItem,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { boardOptions, grades } from "./DropdownData.js";

const EducationalDetails = ({ formData, handleInputChange }) => {
  const initialField = useMemo(() => ({
    board: "",
    collegeName: "",
    enterExamName: "",
    rollNo: "",
    obtainedMarks: "",
    totalMarks: "",
    percentage: "",
    cgpa: "",
    grade: "",
    year: "",
    reasonOfLeavingSchool: "",
  }), []);

  const [fields, setFields] = useState(formData?.exams || [initialField]);

  useEffect(() => {
    setFields(formData?.exams || [initialField]);
  }, [formData, initialField]);

  const handleFieldChange = (index, e) => {
    const { name, value } = e.target; // Ensure e.target is defined before accessing properties
    const updatedFields = fields.map((field, i) =>
      i === index ? { ...field, [name]: value } : field
    );
    setFields(updatedFields);
    handleInputChange({ target: { name: "exams", value: updatedFields } });

    if (name === "obtainedMarks" || name === "totalMarks") {
      calculateAndSetPercentage(updatedFields, index);
    }
  };

  const calculateAndSetPercentage = (updatedFields, index) => {
    const field = updatedFields[index];
    const obtainedMarks = parseFloat(field.obtainedMarks);
    const totalMarks = parseFloat(field.totalMarks);

    if (!isNaN(obtainedMarks) && !isNaN(totalMarks) && totalMarks > 0) {
      const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(2);
      updatedFields[index].percentage = percentage;
      setFields(updatedFields);
      handleInputChange({ target: { name: "exams", value: updatedFields } });
    }
  };

  const handleAddField = () => {
    if (fields.length < 3) {
      setFields([...fields, initialField]);
    }
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
    handleInputChange({ target: { name: "exams", value: updatedFields } });
  };

  // Generate an array of past 10 years from current year
  const getPastYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year > currentYear - 10; year--) {
      years.push(year.toString());
    }
    return years;
  };

  return (
    <Grid container spacing={2}>
      <div className="formContainer">
        <Typography variant="h6" gutterBottom>
          Education Form
        </Typography>
        {fields.map((field, index) => (
          <Grid container spacing={2} key={index} className="fieldSet">
            <Grid item xs={12} sm={3}>
              <TextField
                name="board"
                label="Board"
                value={field.board}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                select
                className="fieldWithBorder"
              >
                <MenuItem value="">Please select Board</MenuItem>
                {boardOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="collegeName"
                label="Previous School/College Name"
                value={field.collegeName}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                name="enterExamName"
                label="Previous Qualifying Exam"
                value={field.enterExamName}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="rollNo"
                label="Roll No."
                value={field.rollNo}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                name="obtainedMarks"
                label="Obtained Marks"
                value={field.obtainedMarks}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="totalMarks"
                label="Total Marks"
                value={field.totalMarks}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="percentage"
                label="Percentage"
                value={field.percentage}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="cgpa"
                label="CGPA"
                value={field.cgpa}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="grade"
                label="Grade"
                value={field.grade}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                select
              >
                <MenuItem value="">Please select a grade</MenuItem>
                {Object.keys(grades).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key} - {grades[key]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="year"
                label="Year"
                value={field.year}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                select
              >
                <MenuItem value="">Please select a year</MenuItem>
                {getPastYears().map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                name="reasonOfLeavingSchool"
                label="Reason of Leaving School"
                value={field.reasonOfLeavingSchool}
                onChange={(e) => handleFieldChange(index, e)}
                fullWidth
                className="fieldWithBorder"
              />
            </Grid>
            <Grid item xs={12}>
              <IconButton onClick={() => handleRemoveField(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Button
          onClick={handleAddField}
          variant="contained"
          color="primary"
          disabled={fields.length >= 3}
        >
          Add
        </Button>
      </div>
    </Grid>
  );
};

export default EducationalDetails;
