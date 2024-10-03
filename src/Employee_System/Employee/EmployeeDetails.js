import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  TextField,
  FormControl,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import { DutyType, EmployeeType, ShiftType } from './dropdownData';

const EmployeeDetails = ({ formData, handleChange, category }) => {
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');
  const [categories, setCategories]=useState([]);

  const fetchCategories = async () =>{
    try {
      const response = await axios.get(`http://13.233.43.240:8082/categories/all?institutecode=${institutecode}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Handle error fetching departments (e.g., show error message)
    }
  };

  useEffect(()=>{
    fetchCategories();
  }, [institutecode]);
  
  useEffect(() => {
    fetchDepartments();
  }, [institutecode]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://13.233.43.240:8082/departments/allDepartment?institutecode=${institutecode}`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Handle error fetching departments (e.g., show error message)
    }
  };

  const validate = (name, value) => {
    let error = '';

    switch (name) {
      case 'esicNo':
        if (!/^\d{10}$/.test(value)) {
          error = 'Invalid ESIC number';
        }
        break;
      case 'cpfNo':
        if (!/^\d{12}$/.test(value)) {
          error = 'Invalid CPF number';
        }
        break;
      case 'salary':
        if (value <= 0) {
          error = 'Salary must be greater than 0';
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error;
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validate(name, value);
  };

  const handleChangeWithValidation = (event) => {
    const { name, value } = event.target;
    handleChange(event);
    validate(name, value);
  };

  return (
    <>
      <Typography variant="h4" component="h3" gutterBottom style={{marginBottom:'30px'}}>
        Employee Details
      </Typography>
      <Grid container spacing={3} className='textField-root'>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            type="date"
            label="Joining Date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChangeWithValidation}
            fullWidth
            InputLabelProps={{className: "required-asterisk", shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              required
              name="department"
              value={formData.department}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
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
              // required
              name="employeecategory"
              value={formData.employeecategory}
              onChange={handleChangeWithValidation}
              // InputLabelProps={{ className: "required-asterisk" }}
              label="Category"
              select
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option.categoryName}>
                  {option.categoryName}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            label="Work Location"
            name="workLocation"
            value={formData.workLocation}
            onChange={handleChangeWithValidation}
            InputLabelProps={{ className: "required-asterisk" }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            label="Designation"
            name="workDetail"
            value={formData.workDetail}
            onChange={handleChangeWithValidation}
            InputLabelProps={{ className: "required-asterisk" }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              required
              name="dutyType"
              value={formData.dutyType}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
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
              required
              name="employeeType"
              value={formData.employeeType}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
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
            required
            type="number"
            label="Salary"
            name="salary"
            value={formData.salary}
            onChange={handleChangeWithValidation}
            InputLabelProps={{ className: "required-asterisk" }}
            onBlur={handleBlur}
            error={!!errors.salary}
            helperText={errors.salary}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="number"
            label="CPF No"
            name="cpfNo"
            value={formData.cpfNo}
            onChange={handleChangeWithValidation}
            onBlur={handleBlur}
            error={!!errors.cpfNo}
            helperText={errors.cpfNo}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="number"
            label="ESIC No"
            name="esicNo"
            value={formData.esicNo}
            onChange={handleChangeWithValidation}
            onBlur={handleBlur}
            error={!!errors.esicNo}
            helperText={errors.esicNo}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            type="text"
            label="Basic Qualification"
            name="basicQualification"
            value={formData.basicQualification}
            onChange={handleChangeWithValidation}
            InputLabelProps={{ className: "required-asterisk" }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="text"
            label="Professional Qualification"
            name="professionalQualification"
            value={formData.professionalQualification}
            onChange={handleChangeWithValidation}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              required
              name="shift"
              value={formData.shift}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
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
            required
            type="time"
            label="Shift Start Time"
            name="shiftStartTime"
            value={formData.shiftStartTime}
            onChange={handleChangeWithValidation}
            fullWidth
            InputLabelProps={{className: "required-asterisk", shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            type="time"
            label="Shift End Time"
            name="shiftEndTime"
            value={formData.shiftEndTime}
            onChange={handleChangeWithValidation}
            fullWidth
            InputLabelProps={{className: "required-asterisk", shrink: true }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              required
              name="status"
              value={formData.status}
              onChange={handleChangeWithValidation}
              InputLabelProps={{ className: "required-asterisk" }}
              label="Status"
              select
            >
              <MenuItem value={"Joined"}>Joined</MenuItem>
              <MenuItem value={"Terminated"}>Terminated</MenuItem>
            </TextField>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            label="End Date"
            name="enddate"
            value={formData.enddate}
            onChange={handleChangeWithValidation}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid> */}
      </Grid>
    </>
  );
};

export default EmployeeDetails;
