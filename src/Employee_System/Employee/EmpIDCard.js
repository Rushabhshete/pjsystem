// import axios from 'axios';
// import React, { useState, useEffect } from 'react'
// import { Card, CardContent, Typography, Avatar } from '@mui/material';

// export default function EmpIDCard(empID, onClose) {
//     const institutecode = localStorage.getItem('institutecode');

//     const [employee, setEMployee]=useState({});
//     const [employeeDetails, setEmployeeDetails]=useState("");

//     useEffect(()=>{
//         const fetchEmployeeDetails = async ()=>{
//             try{
//                 if(!institutecode){
//                     console.log("No Institutecode found in localstorage");
//                     return;
//                 }

//                 const response = await axios.get(
//                     `http://localhost:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`
//                 );
//                 setEmployeeDetails(response.data);
//             }catch(error){
//                 console.error("Error fetching the institutecode0");
//             }
//         }
//         fetchEmployeeDetails();
//     }, [institutecode]);

//     useEffect(()=>{
//         const loadEmployees = async ()=>{
//             if(empID){
//                 try{
//                     console.log('selected employee id:', empID);
//                     const result  = await axios.get(
//                         `http://localhost:8082/empById/${empID}`
//                     );
//                     setEMployee(result.data);
//                 }catch(error){
//                     console.error('error fetching employee', error);
//                 }
//             }
//         }
//         loadEmployees();
//     }, [empID])

//   return (
    
//   )
// }

import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Avatar } from "@mui/material";

export default function EmpIDCard({ empID, onClose }) {
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
          `http://localhost:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`
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
      if (empID) {
        try {
          console.log("Selected employee ID:", empID);
          const result = await axios.get(
            `http://localhost:8082/empById/${empID}`
          );
          setEmployee(result.data);
        } catch (error) {
          console.error("Error fetching employee", error);
        }
      }
    };
    loadEmployee();
  }, [empID]);

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
            background: 'linear-gradient(to right, #FAD126, #FF564E)' , // Purple background for the logo area
            color: 'white',
            paddingTop: '40px',
            paddingBottom: '10px',
            // fontWeight: 'bold',
            // fontSize: '18px',
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
          {/* Institute Logo and Name */}

          {/* Student Image */}
          <Avatar
            src={employee.employeePhoto}
            alt="Student Image"
            sx={{
              width: 120,
              height: 120,
              margin: 'auto',
            }}
          />

          {/* Student Name and Contact */}
          <Typography variant="h6" align="center" gutterBottom style={{ marginTop: '10px' }}>
            <span style={{  fontWeight: 'bold' }}>{employee.name}</span>
            <Typography style={{ fontSize: '13px', color: '#757575' }}>
              {employee.mobile1}
            </Typography>
            <Typography style={{ fontSize: '13px', color: '#757575' }}>
              {employee.email}
            </Typography>
          </Typography>

          {/* Other Student Details */}
          {/* <Typography variant="body1" style={{ marginTop: '10px' }}>
            <strong style={{ color: '#4A148C' }}>Email:</strong> {employee.email}
          </Typography> */}
          <Typography variant="body1" mt={2} style={{textAlign:'center'}}>
            <strong >Course:</strong> {employee.courses}
          </Typography>
          <Typography variant="body1" style={{textAlign:'center'}}>
            <strong >Joining Date:</strong> {employee.date}
          </Typography>
          <Typography variant="body1" style={{textAlign:'center'}}>
            <strong >Duration:</strong> {employee.duration}
          </Typography>
        </CardContent>

        <Typography style={{
            textAlign: 'center',
            background: 'linear-gradient(to right, #FAD126, #FF564E)' , // Purple background for the logo area
            color: 'white',
            paddingTop: '40px',
            // fontWeight: 'bold',
            // fontSize: '18px', width:'150%',borderRadius:'50%',
             width:'350px', borderRadius:'50%', marginLeft:'-40px',
             height:200,
          }}>
            {/* <img
              src={employeeDetails.instituteimage}
              alt="Institute Logo"
              style={{ width: '20%',height:'30%', marginRight: '10px', verticalAlign: 'middle', marginBottom:'10px', borderRadius:'50%', fontSize:'20px' }}
            />
            {employeeDetails.institutename}<br/> */}
            {/* <Typography style={{textAlign:'center', fontSize:'12px',}}>{employeeDetails.emailaddress}</Typography>
            <Typography style={{textAlign:'center', fontSize:'12px'}}>{employeeDetails.phonenumber}</Typography> */}
          </Typography>

      </Card>
  );
}
