import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Avatar,Grid } from "@mui/material";

export default function EmpIDCard({ id, onClose }) {
  const institutecode = localStorage.getItem("institutecode");

  const [employee, setEmployee] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!institutecode) {
          console.log("No Institutecode found in local storage");
          return;
        }

        const response = await axios.get(
          `https://pjsofttech.in:20443/findInstitutesby/Institutecode?institutecode=${institutecode}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching the institute details");
      }
    };
    fetchEmployeeDetails();
  }, [institutecode]);

  useEffect(() => {
    const loadEmployee = async () => {
      if (id) {
        try {
          console.log("Selected employee ID:", id);
          const result = await axios.get(
            `https://pjsofttech.in:10443/empById/${id}`
          );
          setEmployee(result.data);
        } catch (error) {
          console.error("Error fetching employee", error);
        }
      }
    };
    loadEmployee();
  }, [id]);

  return (
    <Card sx={{
        maxWidth: 300,
        margin: 'auto',
        boxShadow: 3,
        borderRadius: 5,
        padding: '20px',
        backgroundColor: '#fff',
        height: 530
      }}>
        <Typography style={{
            textAlign: 'center',
            background: 'linear-gradient(to right, #FAD126, #FF564E)',
            color: 'white',
            paddingTop: '40px',
            paddingBottom: '10px',
            marginBottom: '15px',
            marginTop:'-50px', width:'150%',borderRadius:'50%',
            marginLeft:'-60px',
          }}>
            <img
              src={employeeDetails.instituteimage}
              alt="Institute Logo"
              style={{ width: '10%',height:'10%', marginRight: '10px', verticalAlign: 'middle', marginBottom:'10px', borderRadius:'50%', fontSize:'20px' }}
            />
            {employeeDetails.institutename}<br/>
            <Typography style={{textAlign:'center', fontSize:'12px',}}>{employeeDetails.emailaddress}</Typography>
            <Typography style={{textAlign:'center', fontSize:'12px'}}>{employeeDetails.phonenumber}</Typography>
          </Typography>
        <CardContent>
          {/* Employee Image */}
          <Avatar
            src={employee.employeePhoto}
            alt="Employee Image"
            sx={{
              width: 120,
              height: 120,
              margin: 'auto',
            }}
          />

          {/* Employee Name and Contact */}
          <Typography variant="h6" align="center" gutterBottom style={{ marginTop: '10px' }}>
            <span style={{  fontWeight: 'bold' }}>{employee.fullName}</span>
            <Typography style={{ fontSize: '13px', color: '#757575' }}>
              {employee.mobileNo}
            </Typography>
            <Typography style={{ fontSize: '13px', color: '#757575' }}>
              {employee.email}
            </Typography>
          </Typography>

          {/* Additional Employee Details */}
          <div style={{ padding: '2px' }}>
  <Grid container spacing={1} alignItems="center">
    {/* Department */}
    <Grid item xs={4} style={{ textAlign: 'right', whiteSpace: 'nowrap',marginLeft:"-20px" }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}><strong>Department</strong></Typography>
    </Grid>
    <Grid item xs={1} style={{  whiteSpace: 'nowrap',marginLeft:"20px" }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>:</Typography>
    </Grid>
    <Grid item xs={7} style={{ whiteSpace: 'nowrap' }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>{employee.department}</Typography>
    </Grid>

    {/* Joining Date */}
    <Grid item xs={4} style={{ textAlign: 'right', whiteSpace: 'nowrap' ,marginLeft:"-20px"}}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}><strong>Joining Date</strong></Typography>
    </Grid>
    <Grid item xs={1} style={{ textAlign: 'center', whiteSpace: 'nowrap',marginLeft:"20px" }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>:</Typography>
    </Grid>
    <Grid item xs={7} style={{ whiteSpace: 'nowrap' }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>{new Date(employee.joiningDate).toLocaleDateString()}</Typography>
    </Grid>

    {/* Work Location */}
    <Grid item xs={4} style={{ textAlign: 'right', whiteSpace: 'nowrap',marginLeft:"-20px" }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}><strong>Work Location</strong></Typography>
    </Grid>
    <Grid item xs={1} style={{ textAlign: 'center', whiteSpace: 'nowrap',marginLeft:"20px" }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>:</Typography>
    </Grid>
    <Grid item xs={7} style={{ whiteSpace: 'nowrap' }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>{employee.workLocation}</Typography>
    </Grid>

    {/* Shift */}
    <Grid item xs={4} style={{ textAlign: 'start', whiteSpace: 'nowrap',marginLeft:"-20px" }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}><strong>Shift</strong></Typography>
    </Grid>
    <Grid item xs={1} style={{ textAlign: 'center', whiteSpace: 'nowrap',marginLeft:"20px" }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>:</Typography>
    </Grid>
    <Grid item xs={7} style={{ whiteSpace: 'nowrap' }}>
      <Typography variant="body2" sx={{ fontSize: '14px' }}>{employee.shift} ({employee.shiftStartTime} - {employee.shiftEndTime})</Typography>
    </Grid>
  </Grid>
</div>
        </CardContent>
    
        {/* Placeholder for future use */}
        <Typography style={{
            textAlign: 'center',
            background: 'linear-gradient(to right, #FAD126, #FF564E)',
            color: 'white',
            paddingTop: '40px',
            width:'350px', borderRadius:'50%', marginLeft:'-40px',
             height:200,
          }}>
        </Typography>
      </Card>
  );
}
