// import axios from 'axios';
// import React, { useEffect, useState } from 'react'

// export default function IdCard({id, onClose}) {

//     useEffect(()=>{
//         const [Admission, setAdmission]=useState({

//         })

//         const loadAdmission = async () = {
//             if(id){
//                 try{
//                     console.log("Selected Admission Id:", id);
//                     const result = await axios.get(
//                         `https://pjsofttech.in:13443/admissions/${id}`
//                     );
//                     setAdmission(result.data);

//                 }
//                 catch (error){
//                     console.error("Error fetching Admission:", error);
//                 }
//             }
//         }
//         loadAdmission();
//     }, [id]);

//   return (
//     <div>
      
//     </div>
//   )
// }

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';

export default function IdCard({ id, onClose }) {
    const institutecode = localStorage.getItem('institutecode');
  // State should be declared outside of useEffect
  const [admission, setAdmission] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState("");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (!institutecode) {
          console.error("No institutecode found in localStorage");
          return;
        }

        const response = await axios.get(
          `https://pjsofttech.in:20443/findInstitutesby/Institutecode?institutecode=${institutecode}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, [institutecode]);

  useEffect(() => {
    // Arrow function correction
    const loadAdmission = async () => {
      if (id) {
        try {
          console.log('Selected Admission Id:', id);
          const result = await axios.get(
            `https://pjsofttech.in:13443/admissions/${id}`
          );
          setAdmission(result.data);
        } catch (error) {
          console.error('Error fetching Admission:', error);
        }
      }
    };
    loadAdmission();
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
            src={admission.studentImage}
            alt="Student Image"
            sx={{ 
              width: 120, 
              height: 120, 
              margin: 'auto', 
            }}
          />
  
          {/* Student Name and Contact */}
          <Typography variant="h6" align="center" gutterBottom style={{ marginTop: '10px' }}>
            <span style={{  fontWeight: 'bold' }}>{admission.name}</span>
            <Typography style={{ fontSize: '13px', color: '#757575' }}>
              {admission.mobile1}
            </Typography>
            <Typography style={{ fontSize: '13px', color: '#757575' }}>
              {admission.email}
            </Typography>
          </Typography>
  
          {/* Other Student Details */}
          {/* <Typography variant="body1" style={{ marginTop: '10px' }}>
            <strong style={{ color: '#4A148C' }}>Email:</strong> {admission.email}
          </Typography> */}
         <div style={{textAlign:'center'}}>
         <Typography variant="body1" mt={2} style={{textAlign:'left'}}>
            <strong>Course: </strong> {admission.courses}
          </Typography>
          <Typography variant="body1" style={{textAlign:'left'}}>
            <strong>Joining Date: </strong> {admission.date}
          </Typography>
          <Typography variant="body1" style={{textAlign:'left'}}>
            <strong>Duration: </strong> {admission.duration}
          </Typography>
         </div>
        </CardContent>
        


        <Typography style={{ 
            textAlign: 'center', 
            background: 'linear-gradient(to right, #FAD126, #FF564E)' , // Purple background for the logo area
            color: 'white',
            paddingTop: '40px',
            // fontWeight: 'bold',
            // fontSize: '18px', width:'150%',borderRadius:'50%',
             width:'350px', borderRadius:'70%', marginLeft:'-50px',
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
