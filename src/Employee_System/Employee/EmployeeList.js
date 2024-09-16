
// import React, { useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Modal,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Input,
//   TextField,
//   Grid,
//   Typography,
//   IconButton,
//   Paper,
//   Box,
//   TablePagination,
// } from '@mui/material';
// import { Delete, Edit, Info} from '@mui/icons-material'; // Material Icons
// import axios from 'axios';
// import Userservice from './Userservice';
// import { toast, ToastContainer  } from 'react-toastify'; // Import toast from react-toastify
// import 'react-toastify/dist/ReactToastify.css'; // Ensure this is imported
// import jsPDF from 'jspdf';
// import { styled } from '@mui/system';
// import 'jspdf-autotable';
// import {BG, Gender, EmployeeType, DutyType, ShiftType} from "./dropdownData";
// import { Country, State, City } from 'country-state-city';


// const EmployeeList = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);
//   const [showInfoModal, setShowInfoModal] = useState(false);
//   const [category, setCategory] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(20);
//   const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Joined":
//         return "green";
//       case "Terminated":
//         return "red";
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [institutecode]);
//   const loadCategory = async () => {
//     try {
//       const result = await axios.get(`http://localhost:8082/categories/all?institutecode=${institutecode}`);
//       setCategory(result.data);
//     } catch (error) {
//       console.error('Error fetching in Category of Employee', error);
//     }
//   };
//   useEffect(() => {
//     loadCategory();
//   }, [institutecode]);


  
// const countries = Country.getAllCountries();
// const [states, setStates] = useState([]);
// const [cities, setCities] = useState([]);

// const [permanentStates, setPermanentStates] = useState([]);
// const [permanentCities, setPermanentCities] = useState([]);

// useEffect(() => {
//   if (selectedUser?.country) {
//     const selectedCountry = countries.find(country => country.name === selectedUser?.country);
//     setStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
//   }
// }, [selectedUser?.country, countries]);

// useEffect(() => {
//   if (selectedUser?.state) {
//     const selectedState = states.find(state => state.name === selectedUser?.state);
//     setCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
//   }
// }, [selectedUser?.state, states]);

// useEffect(() => {
//   if (selectedUser?.permanentCountry) {
//     const selectedCountry = countries.find(country => country.name === selectedUser?.permanentCountry);
//     setPermanentStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
//   }
// }, [selectedUser?.permanentCountry, countries]);

// useEffect(() => {
//   if (selectedUser?.permanentstate) {
//     const selectedState = permanentStates.find(state => state.name === selectedUser?.permanentstate);
//     setPermanentCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
//   }
// }, [selectedUser?.permanentstate, permanentStates]);




   
// useEffect(() => {
//   fetchDepartments();
// }, [institutecode]);



// const fetchDepartments = async () => {
//   try {
//     const response = await axios.get(`http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`);
//     setDepartments(response.data);
//   } catch (error) {
//     console.error('Error fetching departments:', error);
//     // Handle error fetching departments (e.g., show error message)
//   }
// };

//   const fetchUsers = async () => {
//     try {
//       const response = await Userservice.getUser();
//       setUsers(response.data);
//       setFilteredUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };
//   const handleSearch = (event) => {
//     const term = event.target.value;
//     setSearchTerm(term);
//     if (term === '') {
//       setFilteredUsers(users);
//     } else {
//       const filtered = users.filter(
//         (user) =>
//           user.fullName.toLowerCase().includes(term.toLowerCase()) ||
//           user.department.toLowerCase().includes(term.toLowerCase()) ||
//           user.gender.toLowerCase().includes(term.toLowerCase()) ||
//           user.city.toLowerCase().includes(term.toLowerCase()) ||
//           user.workDetail.toLowerCase().includes(term.toLowerCase()) ||
//           user.status.toLowerCase().includes(term.toLowerCase()) ||
//           user.email.toLowerCase().includes(term.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     }
//   };
//   const fetchUserById = async (id) => {
//     try {
//       const response = await Userservice.getUserById(id);
//       setSelectedUser(response.data);
//       setShowUpdateModal(true);
//     } catch (error) {
//       console.error('Error fetching user by ID:', error);
//     }
//   };
//   const handleDelete = async (empID) => {
//     const confirmation = window.confirm('Are you sure you want to delete this Employee?');
//     if (confirmation) {
//       try {
//         await Userservice.deleteUser(empID);
//         fetchUsers();
//         toast.success('Employee deleted successfully'); // Notify success
//       } catch (error) {
//         console.error('Error deleting Employee:', error);
//         toast.error(`Error deleting Employee: ${error.message}`); // Notify error
//       }
//     }
//   };
//   const handleUpdate = async () => {
//     if (selectedUser) {
//       try {
//         await Userservice.updateUser(selectedUser.empID, selectedUser);
//         await fetchUsers();
//         setShowUpdateModal(false);
//         setSelectedUser(null);
//         toast.success('Employee updated successfully'); // Notify success
//       } catch (error) {
//         setError('Error updating Employee: ' + error.message);
//         toast.error(`Error updating Employee: ${error.message}`); // Notify error
//       }
//     }
//   };
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
  
//     if (name === 'country') {
//       setSelectedUser((prevState) => ({
//         ...prevState,
//         [name]: value,
//         state: '',  // Reset state and city
//         city: '',
//       }));
//     } else if (name === 'state') {
//       setSelectedUser((prevState) => ({
//         ...prevState,
//         [name]: value,
//         city: '',  // Reset city
//       }));
//     } else if (name === 'permanentCountry') {
//       setSelectedUser((prevState) => ({
//         ...prevState,
//         [name]: value,
//         permanentstate: '',  // Reset permanent state and city
//         permanentcity: '',
//       }));
//     } else if (name === 'permanentstate') {
//       setSelectedUser((prevState) => ({
//         ...prevState,
//         [name]: value,
//         permanentcity: '',  // Reset permanent city
//       }));
//     } else {
//       setSelectedUser((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };
  




//   const handleShowInfo = async (id) => {
//     try {
//       const response = await Userservice.getUserById(id);
//       setSelectedUser(response.data);
//       setShowInfoModal(true);
//     } catch (error) {
//       console.error('Error fetching user by ID:', error);
//     }
//   };    
//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
  
//     // Define user information
//     const userInfo = [
//       { label: 'Id:', value: selectedUser?.empID },
//       { label: 'Full Name:', value: selectedUser?.fullName },
//       { label: 'Gender:', value: selectedUser?.gender },
//       { label: 'DOB:', value: selectedUser?.dob },
//       { label: 'Blood Group:', value: selectedUser?.bloodGroup },
//       { label: 'Email:', value: selectedUser?.email },
//       { label: 'Current Address:', value: selectedUser?.currentAddress },
//       { label: 'Permanent Address:', value: selectedUser?.permanentAddress },
//       { label: 'Pincode:', value: selectedUser?.pinCode },
//       { label: 'Permanent Pincode:', value: selectedUser?.permanentpinCode },
//       { label: 'Landmark:', value: selectedUser?.landmark },
//       { label: 'Permanent Landmark:', value: selectedUser?.permanentlandmark },
//       { label: 'District:', value: selectedUser?.district },
//       { label: 'Permanent District:', value: selectedUser?.permanentdistrict },
//       { label: 'City:', value: selectedUser?.city },
//       { label: 'Permanent City:', value: selectedUser?.permanentcity },
//       { label: 'State:', value: selectedUser?.state },
//       { label: 'Permanent State:', value: selectedUser?.permanentstate },
//       { label: 'Country:', value: selectedUser?.country },
//       { label: 'Mobile No:', value: selectedUser?.mobileNo },
//       { label: 'Parent No:', value: selectedUser?.parentNo },
//       { label: 'Department:', value: selectedUser?.department },
//       { label: 'Designation:', value: selectedUser?.workDetail },
//       { label: 'Work Location:', value: selectedUser?.workLocation },
//       { label: 'Duty Type:', value: selectedUser?.dutyType },
//       { label: 'Employee Type:', value: selectedUser?.employeeType },
//       { label: 'Employee Category:', value: selectedUser?.employeecategory },
//       { label: 'Aadhar No:', value: selectedUser?.adharNo },
//       { label: 'Pan No:', value: selectedUser?.panNo },
//       { label: 'Joining Date:', value: selectedUser?.joiningDate },
//       { label: 'End Date:', value: selectedUser?.enddate },
//       { label: 'Salary:', value: selectedUser?.salary },
//       { label: 'CPF No:', value: selectedUser?.cpfNo },
//       { label: 'ESIC No:', value: selectedUser?.esicNo },
//       { label: 'Basic Qualification:', value: selectedUser?.basicQualification },
//       { label: 'Professional Qualification:', value: selectedUser?.professionalQualification },
//       { label: 'Shift:', value: selectedUser?.shift },
//       { label: 'Shift Start Time:', value: selectedUser?.shiftStartTime },
//       { label: 'Shift End Time:', value: selectedUser?.shiftEndTime },
//       { label: 'Status:', value: selectedUser?.status },
//     ];
//     // Convert userInfo to data suitable for autotable
//     const tableData = userInfo.map(({ label, value }) => [label, value]);
//     // Set properties for PDF document
//     const margin = { top: 15, left: 15, right: 15 };
//     const startY = 5 // Initial y position for autotable
//     // Add header
//     doc.setFontSize(18);
//     doc.text('User Information', margin.left, startY);
//     doc.setFontSize(12);
//     // Generate table using autotable
//     doc.autoTable({
//       startY: startY + 10, // Start table slightly below the title
//       head: [['Field', 'Value']],
//       body: tableData,
//       theme: 'striped', // Optional: 'striped', 'grid', 'plain'
//       margin: { top: startY + 30, left: margin.left, right: margin.right },
//       didDrawPage: function (data) {
//         // Add footer with page number
//         doc.setFontSize(10);
//         doc.text('Page ' + doc.internal.getNumberOfPages(), margin.left, doc.internal.pageSize.height - 10);
//       },
//     });
//     // Save the PDF
//     doc.save('UserInformation.pdf');
//   };
//   const handleDownloadCsv = () => {
//     const csvData = filteredUsers.map((user) => ({
//       Id: user.empID,
//       'Full Name': user.fullName,
//       DOB: user.dob,
//       'Blood Group': user.bloodGroup,
//       Gender: user.gender,
//       'Aadhar No': user.adharNo,
//       'PAN No': user.panNo,
//       Email: user.email,
//       Password: user.password,
//       'Confirm Password': user.confirmPassword,
//       'Current Address': user.currentAddress,
//       'Permanent Address': user.permanentAddress,
//       'PIN Code': user.pinCode,
//       'Permanent PinCode':user.permanentpinCode,
//       'Landmark': user.landmark,
//       'Permanent Landmark': user.permanentlandmark,
//       District: user.district,
//       'Permanent District': user.permanentdistrict,
//       'City': user.city,
//       'Permanent City': user.permanentcity,
//       'State': user.state,
//       'Permanent State': user.permanentstate,
//       Country: user.country,
//       'Mobile No': user.mobileNo,
//       'Parent No': user.parentNo,
//       'Joining Date': user.joiningDate,
//       Department: user.department,
//       'Duty Type': user.dutyType,
//       Salary: user.salary,
//       'Work Detail': user.workDetail,
//       'Work Location': user.workLocation,
//       'CPF No': user.cpf_no,
//       'Employee Type': user.employee_type,
//       'Employee Category': user.employeecategory,
//       'End Date': user.enddate,
//       'ESIC No': user.esic_no,
//       'Basic Qualification': user.basicQualification,
//       'Professional Qualification': user.professionalQualification,
//       'Shift Start Time': user.shiftStartTime,
//       'Shift End Time': user.shiftEndTime,
//       Status: user.status,
//       Shift: user.shift,
//     }));

//     const csvContent = [
//       [
//         'Id',
//         'Full Name',
//         'DOB',
//         'Blood Group',
//         'Gender',
//         'Aadhar No',
//         'PAN No',
//         'Email',
//         'Password',
//         'Confirm Password',
//         'Current Address',
//         'Permanent Address',
//         'PIN Code',
//         'Permanent PinCode',
//         'Landmark',
//         'Permanent Landmark',
//         'District',
//         'Permanent District',
//         'City',
//         'Permanent City',
//         'State',
//         'Permanent State',
//         'Country',
//         'Joining Date',
//         'Department',
//         'Duty Type',
//         'Salary',
//         'Work Detail',
//         'Work Location',
//         'Mobile No',
//         'Parent No',
//         'CPF No',
//         'Employee Type',
//         'Employee Category',
//         'End Date',
//         'ESIC No',
//         'Basic Qualification',
//         'Professional Qualification',
//         'Shift Start Time',
//         'Shift End Time',
//         'Status',
//         'Shift',
//       ],
//       ...csvData.map((row) => Object.values(row)),
//     ]
//       .map((e) => e.join(','))
//       .join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'users.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//   const PopTypography = styled(Typography)`
// @keyframes pop {
//   0% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.1);
//   }
//   100% {
//     transform: scale(1);
//   }
// }


// `;
//   return (
//     <>
//     <PopTypography
//     variant="h5"
//     gutterBottom
//     sx={{
//       fontWeight: 'bold',
//       color: '#fff',
//       textAlign: 'center',
//       backgroundColor: '#24A0ED',
//       borderRadius: '150px',
//       padding: '10px',

//     }}
//   >
//     Employee List 
//     </PopTypography>
//     <div className="container1">
//       <div className="headertable1">
//         <Paper component={Box} p={2} sx={{ display: 'flex', alignItems: 'center' }}>
//           <FormControl sx={{ flexGrow: 1 }}>
//             <InputLabel htmlFor="search-input">Search by any field</InputLabel>
//             <Input
//               id="search-input"
//               value={searchTerm}
//               onChange={handleSearch}
//               placeholder="Search by any field"
//             />
//           </FormControl>
//           <Button variant="contained" onClick={handleDownloadCsv} sx={{ ml: 2 }}>
//             Download CSV
//           </Button>
//         </Paper>
//       </div>
//       <br />
//       <TablePagination
//       component="div"
//       count={filteredUsers.length}
//       page={page}
//       onPageChange={handleChangePage}
//       rowsPerPage={rowsPerPage}
//       onRowsPerPageChange={handleChangeRowsPerPage}
//       rowsPerPageOptions={[10, 20, 50]}
//       labelRowsPerPage="Entries per Page"
//     />
//       <TableContainer>
//       <Table>
//         <TableHead sx={{backgroundColor:'#f2f2f2'}}>
//           <TableRow>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 Id
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 Full Name
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 Email
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 Department
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 Designation
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 City
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 Status
//               </Typography>
//             </TableCell>
//             <TableCell>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
//                 Actions
//               </Typography>
//             </TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {paginatedUsers.map((user) => (
//             <TableRow key={user.empID}>
//               <TableCell>{user.empID}</TableCell>
//               <TableCell>{user.fullName}</TableCell>
//               <TableCell>{user.email}</TableCell>
//               <TableCell>{user.department}</TableCell>
//               <TableCell>{user.workDetail}</TableCell>
//               <TableCell>{user.city}</TableCell>
//               <TableCell style={{ color: getStatusColor(user.status), fontWeight: 'bold' }}>{user.status}</TableCell>
//               <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
//                 <IconButton onClick={() => handleShowInfo(user.empID)} aria-label="info" sx={{ color: 'green' }}>
//                   <Info />
//                 </IconButton>
//                 <IconButton onClick={() => fetchUserById(user.empID)} aria-label="edit" sx={{ color: 'blue' }}>
//                   <Edit />
//                 </IconButton>
//                 <IconButton onClick={() => handleDelete(user.empID)} aria-label="delete" sx={{ color: 'red' }}>
//                   <Delete />
//                 </IconButton>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//     <TablePagination
//       component="div"
//       count={filteredUsers.length}
//       page={page}
//       onPageChange={handleChangePage}
//       rowsPerPage={rowsPerPage}
//       onRowsPerPageChange={handleChangeRowsPerPage}
//       rowsPerPageOptions={[10, 20, 50]}
//       labelRowsPerPage="Entries per Page"
//     />

//       {/* Update Modal */}
//       {selectedUser && (
//   <Modal
//     open={showUpdateModal}
//     onClose={() => setShowUpdateModal(false)}
//     sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//   >
//     <Box
//       sx={{
//         width: '90%',
//         maxWidth: 900,
//         bgcolor: 'background.paper',
//         boxShadow: 24,
//         p: 4,
//         maxHeight: '90vh',
//         overflowY: 'auto', // This makes the content scrollable
//         display: 'flex',
//         flexDirection: 'column',
//         borderRadius:'5px'
//       }}
//     >
//      <PopTypography
//     variant="h5"
//     gutterBottom
//     sx={{
//       fontWeight: 'bold',
//       color: '#fff',
//       textAlign: 'center',
//       backgroundColor: '#24A0ED',
//       borderRadius: '150px',
//       padding: '10px',
//       marginBottom: '-2px'
//     }}
//   >
//     Update Employee 
//     </PopTypography>
//       <hr/>
//       <br/>
//       <form>
//               <Grid container spacing={3} className='textField-root'>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Full Name"
//                     name="fullName"
//                     value={selectedUser?.fullName || ''}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <TextField
                    
//                     name="bloodGroup"
//                     value={selectedUser?.bloodGroup}
//                     onChange={handleInputChange}
//                     label="Blood Group"
//                     select
//                   >
//                     {BG.map((option) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
                 
//                   <TextField
                    
//                     name="gender"
//                     value={selectedUser?.gender}
//                     onChange={handleInputChange}
//                     label="Gender"
//                     select
//                   >
//                     {Gender.map((option) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Email"
//                     name="email"
//                     value={selectedUser?.email || ''}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="date"
//                   label="DOB"
//                   name="dob"
//                   value={selectedUser?.dob}
//                   onChange={handleInputChange}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="number"
//                   label="Aadhar No"
//                   name="adharNo"
//                   value={selectedUser?.adharNo}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   label="Pan No"
//                   name="panNo"
//                   value={selectedUser?.panNo}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="number"
//                   label="Mobile No"
//                   name="mobileNo"
//                   value={selectedUser?.mobileNo}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="number"
//                   label="Parent No"
//                   name="parentNo"
//                   value={selectedUser?.parentNo}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//                <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//             <TextField
//               required
//               name="country"
//               value={selectedUser?.country}
//               onChange={handleInputChange}
//               label="Country"
//               select
//             >
//               {countries.map((option) => (
//                 <MenuItem key={option.name} value={option.name}>
//                   {option.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//             <TextField
//               required
//               name="state"
//               value={selectedUser?.state}
//               onChange={handleInputChange}
//               label="State"
//               select
//             >
//               {states.map((option) => (
//                 <MenuItem key={option.name} value={option.name}>
//                   {option.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <FormControl fullWidth>
//           <TextField
// required
// name="city"
// value={selectedUser?.city || ''}
// onChange={handleInputChange}
// label="City"
// select
// >
// {cities.map((option) => (
//   <MenuItem key={option.name} value={option.name}>
//     {option.name}
//   </MenuItem>
// ))}
// </TextField>
//           </FormControl>
//         </Grid>
//                <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               name="district"
//               value={selectedUser?.district}
//               onChange={handleInputChange}
//               label="District"
//               fullWidth
//             />
//         </Grid>
        
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Pincode"
//                   name="pinCode"
//                   value={selectedUser?.pinCode}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   label="Landmark"
//                   name="landmark"
//                   value={selectedUser?.landmark}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   label="Current Address"
//                   name="currentAddress"
//                   value={selectedUser?.currentAddress}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   label="Permanent Address"
//                   name="permanentAddress"
//                   value={selectedUser?.permanentAddress}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <TextField
//                   required
//                   name="permanentCountry"
//                   value={selectedUser.permanentCountry}
//                   onChange={handleInputChange}
//                   label="Permanent Country"
//                   select
//                 >
//                   {countries.map((option) => (
//                     <MenuItem key={option.name} value={option.name}>
//                       {option.name}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//                 <TextField
//                   required
//                   name="permanentstate"
//                   value={selectedUser?.permanentstate}
//                   onChange={handleInputChange}
//                   label="Permanent State"
//                   select
//                 >
//                   {permanentStates.map((option) => (
//                     <MenuItem key={option.name} value={option.name}>
//                       {option.name}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <FormControl fullWidth>
//               <TextField
// required
// name="permanentcity"
// value={selectedUser?.permanentcity || ''}
// onChange={handleInputChange}
// label="Permanent City"
// select
// >
// {permanentCities.map((option) => (
//   <MenuItem key={option.name} value={option.name}>
//     {option.name}
//   </MenuItem>
// ))}
// </TextField>
//               </FormControl>
//             </Grid>
//                   <Grid item xs={12} sm={4}>
//             <TextField
//               required
//               name="permanentdistrict"
//               value={selectedUser?.permanentdistrict}
//               onChange={handleInputChange}
//               label="Permanent District"
//               fullWidth
//             />
//         </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   label="Permanent Pincode"
//                   name="permanentpinCode"
//                   value={selectedUser?.permanentpinCode}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   label="Permanent Landmark"
//                   name="permanentlandmark"
//                   value={selectedUser?.permanentlandmark}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="date"
//                   label="Joining Date"
//                   name="joiningDate"
//                   value={selectedUser?.joiningDate}
//                   onChange={handleInputChange}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//         <FormControl fullWidth>
//           <TextField
//             required
//             name="department"
//             value={selectedUser?.department}
//             onChange={handleInputChange}
//             label="Department"
//             select
//           >
//             {departments.map((option) => (
//               <MenuItem key={option.id} value={option.department}>
//                 {option.department}
//               </MenuItem>
//             ))}
//           </TextField>
//         </FormControl>
//       </Grid>  
//       <Grid item xs={12} sm={4}>
//         <FormControl fullWidth>
//           <TextField
            
//             name="employeecategory"
//             value={selectedUser?.employeecategory}
//             onChange={handleInputChange}
//             label="Category"
//             select
//           >
//             {category.map((option) => (
//               <MenuItem key={option} value={option.categoryName}>
//                 {option.categoryName}
//               </MenuItem>
//             ))}
//           </TextField>
//         </FormControl>
//       </Grid> 
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Work Location"
//                     name="workLocation"
//                     value={selectedUser?.workLocation || ''}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={4}>
//                   <TextField
//                     fullWidth
//                     label="Designation"
//                     name="workDetail"
//                     value={selectedUser?.workDetail || ''}
//                     onChange={handleInputChange}
//                   />
//                 </Grid>              
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <TextField
                    
//                     name="dutyType"
//                     value={selectedUser?.dutyType}
//                     onChange={handleInputChange}
//                     label="Duty Type"
//                     select
//                   >
//                     {DutyType.map((option) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
                  
//                   <TextField
                    
//                     name="employeeType"
//                     value={selectedUser?.employeeType}
//                     onChange={handleInputChange}
//                     label="Employee Type"
//                     select
//                   >
//                     {EmployeeType.map((option) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
              
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="number"
//                   label="Salary"
//                   name="salary"
//                   value={selectedUser?.salary}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="number"
//                   label="CPF No"
//                   name="cpfNo"
//                   value={selectedUser?.cpfNo}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="number"
//                   label="ESIC No"
//                   name="esicNo"
//                   value={selectedUser?.esicNo}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="text"
//                   label="Basic Qualification"
//                   name="basicQualification"
//                   value={selectedUser?.basicQualification}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="text"
//                   label="Professional Qualification"
//                   name="professionalQualification"
//                   value={selectedUser?.professionalQualification}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>                 
//               <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <TextField
                    
//                     name="shift"
//                     value={selectedUser?.shift}
//                     onChange={handleInputChange}
//                     label="Shift"
//                     select
//                   >
//                     {ShiftType.map((option) => (
//                       <MenuItem key={option} value={option}>
//                         {option}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="time"
//                   label="Shift Start Time"
//                   name="shiftStartTime"
//                   value={selectedUser?.shiftStartTime}
//                   onChange={handleInputChange}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
                  
//                   type="time"
//                   label="Shift End Time"
//                   name="shiftEndTime"
//                   value={selectedUser?.shiftEndTime}
//                   onChange={handleInputChange}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//                 <Grid item xs={12} sm={4}>
//                 <FormControl fullWidth>
//                   <TextField
                    
//                     name="status"
//                     value={selectedUser?.status}
//                     onChange={handleInputChange}
//                     label="Status"
//                     select
//                   >
//                       <MenuItem value={"Joined"}>
//                         Joined
//                       </MenuItem>
//                       <MenuItem value={"Terminated"}>
//                         Terminated
//                       </MenuItem>
//                   </TextField>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   type="date"
//                   label="End Date"
//                   name="enddate"
//                   value={selectedUser?.enddate}
//                   onChange={handleInputChange}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//                 <Grid item xs={12} sx={{ mt: 2, ml:75 }}>
//                   <Button variant="contained" onClick={handleUpdate}>Update</Button>
//                   <Button
//         variant="contained"
//         color="secondary"
//         onClick={() => setShowUpdateModal(false)}
//         sx={{ ml: 2 }}
//       >
//         Close
//       </Button>
//                 </Grid>
//               </Grid>
//             </form>
//           </Box>
//         </Modal>
//       )}

//       {/* Info Modal */}
// {selectedUser && (
//   <Modal
//     open={showInfoModal}
//     onClose={() => setShowInfoModal(false)}
//     aria-labelledby="user-info-modal"
//     aria-describedby="user-info-description"
//   >
//     <Box
//       sx={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: 900,
//         maxHeight: '90vh', // Limiting height to 90% of viewport height
//         overflowY: 'auto', // Making content scrollable if it exceeds maxHeight
//         bgcolor: 'background.paper',
//         borderRadius:'5px',
//         boxShadow: 24,
//         p: 4,
//       }}
//     >
//       <PopTypography
//     variant="h5"
//     gutterBottom
//     sx={{
//       fontWeight: 'bold',
//       color: '#fff',
//       textAlign: 'center',
//       backgroundColor: '#24A0ED',
//       borderRadius: '150px',
//       padding: '10px',
//       marginBottom: '-2px'
//     }}
//   >
//    Employee Information
//     </PopTypography>
//       <hr/>
//       <Grid container spacing={3}>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Full Name:</Typography> {selectedUser?.fullName}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Email:</Typography> {selectedUser?.email}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Department:</Typography> {selectedUser?.department}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Designation:</Typography> {selectedUser?.workDetail}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Current Address:</Typography> {selectedUser?.currentAddress}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Address:</Typography> {selectedUser?.permanentAddress}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Pincode:</Typography> {selectedUser?.pinCode}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Pincode:</Typography> {selectedUser?.permanentpinCode}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Landmark:</Typography> {selectedUser?.landmark}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Landmark:</Typography> {selectedUser?.permanentlandmark}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>District:</Typography> {selectedUser?.district}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent District:</Typography> {selectedUser?.permanentdistrict}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>City:</Typography> {selectedUser?.city}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent City:</Typography> {selectedUser?.permanentcity}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>State:</Typography> {selectedUser?.state}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent State:</Typography> {selectedUser?.permanentstate}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Country:</Typography> {selectedUser?.country}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Country:</Typography> {selectedUser?.permanentCountry}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Mobile No:</Typography> {selectedUser?.mobileNo}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Parent No:</Typography> {selectedUser?.parentNo}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Work Location:</Typography> {selectedUser?.workLocation}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Duty Type:</Typography> {selectedUser?.dutyType}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Employee Type:</Typography> {selectedUser?.employeeType}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Employee Category:</Typography> {selectedUser?.employeecategory}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Gender:</Typography> {selectedUser?.gender}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>DOB:</Typography> {new Date(selectedUser?.dob).toLocaleDateString('en-GB')}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Aadhar No:</Typography> {selectedUser?.adharNo}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Pan No:</Typography> {selectedUser?.panNo}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Blood Group:</Typography> {selectedUser?.bloodGroup}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Joining Date:</Typography> {new Date(selectedUser?.joiningDate).toLocaleDateString('en-GB')}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>End Date:</Typography> {new Date(selectedUser?.enddate).toLocaleDateString('en-GB')}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Salary:</Typography> {selectedUser?.salary}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>CPF No:</Typography> {selectedUser?.cpfNo}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>ESIC No:</Typography> {selectedUser?.esicNo}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Basic Qualification:</Typography> {selectedUser?.basicQualification}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Professional Qualification:</Typography> {selectedUser?.professionalQualification}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Shift:</Typography> {selectedUser?.shift}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Shift Start Time:</Typography> {selectedUser?.shiftStartTime}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Shift End Time:</Typography> {selectedUser?.shiftEndTime}
//       </Grid>
//       <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
//         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Status:</Typography> {selectedUser?.status}
//       </Grid>
//     </Grid>
//       <Box mt={2} textAlign="right">
//           <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
//             Download
//           </Button>
//           <Button
//         variant="contained"
//         color="secondary"
//         onClick={() => setShowInfoModal(false)}
//         sx={{ ml: 2 }}
//       >
//         Close
//       </Button>
//         </Box>
//     </Box>
//   </Modal>
// )}
// <ToastContainer/>
//     </div>
//     </>
//   );
// };
// export default EmployeeList;

import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  FormControl,
  InputLabel,
  MenuItem,
  Input,
  TextField,
  Grid,
  Typography,
  IconButton,
  Paper,
  Box,
  TablePagination,
  Select
} from '@mui/material';
import { Delete, Edit, Info, Cancel} from '@mui/icons-material'; // Material Icons
import axios from 'axios';
import Userservice from './Userservice';
import { toast, ToastContainer  } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Ensure this is imported
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {BG, Gender, EmployeeType, DutyType, ShiftType} from "./dropdownData.js";
import { Country, State, City } from 'country-state-city';

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [category, setCategory] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedDepartment, setSelectedDepartment] = useState('');
const [selectedCategory, setSelectedCategory] = useState('');
const [selectedDesignation, setSelectedDesignation] = useState('');

const [uniqueDepartments, setUniqueDepartments] = useState([]);
const [uniqueCategories, setUniqueCategories] = useState([]);
const [uniqueDesignations, setUniqueDesignations] = useState([]);

useEffect(() => {
  const fetchUsersAndFilters = async () => {
    try {
      const usersResponse = await Userservice.getUser();
      setUsers(usersResponse.data);
      
      // Extract unique departments, categories, and designations
      const departments = [...new Set(usersResponse.data.map(user => user.department))];
      const categories = [...new Set(usersResponse.data.map(user => user.employeecategory))];
      const designations = [...new Set(usersResponse.data.map(user => user.workDetail))];
      
      setUniqueDepartments(departments);
      setUniqueCategories(categories);
      setUniqueDesignations(designations);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users.');
    }
  };
  
  fetchUsersAndFilters();
}, []);

useEffect(() => {
  let filtered = users;

  // Filtering users based on selected filters
  if (selectedDepartment) {
    filtered = filtered.filter(user => user.department === selectedDepartment);
  }
  if (selectedCategory) {
    filtered = filtered.filter(user => user.employeecategory === selectedCategory);
  }
  if (selectedDesignation) {
    filtered = filtered.filter(user => user.workDetail === selectedDesignation);
  }


   // Search functionality
   if (searchTerm) {
    filtered = filtered.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeecategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  setFilteredUsers(filtered);
}, [users, selectedDepartment, selectedCategory, selectedDesignation, searchTerm]);


  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "Joined":
        return "green";
      case "Terminated":
        return "red";
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [institutecode]);
  const loadCategory = async () => {
    try {
      const result = await axios.get(`http://localhost:8082/categories/all?institutecode=${institutecode}`);
      setCategory(result.data);
    } catch (error) {
      console.error('Error fetching in Category of Employee', error);
    }
  };
  useEffect(() => {
    loadCategory();
  }, [institutecode]);    
const countries = Country.getAllCountries();
const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);

const [permanentStates, setPermanentStates] = useState([]);
const [permanentCities, setPermanentCities] = useState([]);

useEffect(() => {
  if (selectedUser?.country) {
    const selectedCountry = countries.find(country => country.name === selectedUser?.country);
    setStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
  }
}, [selectedUser?.country, countries]);

useEffect(() => {
  if (selectedUser?.state) {
    const selectedState = states.find(state => state.name === selectedUser?.state);
    setCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
  }
}, [selectedUser?.state, states]);

useEffect(() => {
  if (selectedUser?.permanentCountry) {
    const selectedCountry = countries.find(country => country.name === selectedUser?.permanentCountry);
    setPermanentStates(selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : []);
  }
}, [selectedUser?.permanentCountry, countries]);

useEffect(() => {
  if (selectedUser?.permanentstate) {
    const selectedState = permanentStates.find(state => state.name === selectedUser?.permanentstate);
    setPermanentCities(selectedState ? City.getCitiesOfState(selectedState.countryCode, selectedState.isoCode) : []);
  }
}, [selectedUser?.permanentstate, permanentStates]); 
useEffect(() => {
  fetchDepartments();
}, [institutecode]);
const fetchDepartments = async () => {
  try {
    const response = await axios.get(`http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`);
    setDepartments(response.data);
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Handle error fetching departments (e.g., show error message)
  }
};

  const fetchUsers = async () => {
    try {
      const response = await Userservice.getUser();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(term.toLowerCase()) ||
          user.department.toLowerCase().includes(term.toLowerCase()) ||
          user.employeecategory.toLowerCase().includes(term.toLowerCase()) ||
          user.gender.toLowerCase().includes(term.toLowerCase()) ||
          user.city.toLowerCase().includes(term.toLowerCase()) ||
          user.workDetail.toLowerCase().includes(term.toLowerCase()) ||
          user.status.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };
  // const fetchUserById = async (id) => {
  //   try {
  //     const response = await Userservice.getUserById(id);
  //     setSelectedUser(response.data);
  //     setShowUpdateModal(true);
  //   } catch (error) {
  //     console.error('Error fetching user by ID:', error);
  //   }
  // };
  const fetchUserById = async (id) => {
    try {
      const response = await Userservice.getUserById(id);
      // Make sure to format the dates before setting the state
      const userData = {
        ...response.data,
        dob: response.data.dob.substring(0, 10), // format 'YYYY-MM-DD'
        joiningDate: response.data.joiningDate.substring(0, 10), // format 'YYYY-MM-DD'
        enddate: response.data.enddate?.substring(0, 10), // format 'YYYY-MM-DD'
      };
      setSelectedUser(userData);
      setShowUpdateModal(true);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
    }
  };
  const handleDelete = async (empID) => {
    const confirmation = window.confirm('Are you sure you want to delete this Employee?');
    if (confirmation) {
      try {
        await Userservice.deleteUser(empID);
        fetchUsers();
        toast.success('Employee deleted successfully'); // Notify success
      } catch (error) {
        console.error('Error deleting Employee:', error);
        toast.error(`Error deleting Employee: ${error.message}`); // Notify error
      }
    }
  };
  const handleUpdate = async () => {
    if (selectedUser) {
      try {
        await Userservice.updateUser(selectedUser.empID, selectedUser);
        await fetchUsers();
        setShowUpdateModal(false);
        setSelectedUser(null);
        toast.success('Employee updated successfully'); // Notify success
      } catch (error) {
        setError('Error updating Employee: ' + error.message);
        toast.error(`Error updating Employee: ${error.message}`); // Notify error
      }
    }
  };

  
  const handleCancel = async (empID) => {
    const confirmation = window.confirm('Are You Sure You Want To Terminate This Employee?');
    if (confirmation) {
    try {
      const response = await axios.put(`http://localhost:8082/updateEmployeeStatus/${empID}`, {
        status: 'Terminated' // Or whatever status you want to set
      });
      if (response.status === 200) {
        // toast.success('Employee status updated successfully.');
      }
      fetchUsers(); // Refresh users after status update
    } catch (error) {
      console.error('Error updating employee status:', error);
      toast.error('Error updating employee status.');
    }
  }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'country') {
      setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value,
        state: '',  // Reset state and city
        city: '',
      }));
    } else if (name === 'state') {
      setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value,
        city: '',  // Reset city
      }));
    } else if (name === 'permanentCountry') {
      setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value,
        permanentstate: '',  // Reset permanent state and city
        permanentcity: '',
      }));
    } else if (name === 'permanentstate') {
      setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value,
        permanentcity: '',  // Reset permanent city
      }));
    } 
    else if (name === 'dob' || name === 'joiningDate' || name === 'enddate') {
      setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value, // value should be in the format `YYYY-MM-DD`
      }));
    }else {
      setSelectedUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleShowInfo = async (id) => {
    try {
      const response = await Userservice.getUserById(id);
      setSelectedUser(response.data);
      setShowInfoModal(true);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
    }
  };    
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
  
    // Define user information
    const userInfo = [
      { label: 'Id:', value: selectedUser?.empID },
      { label: 'Full Name:', value: selectedUser?.fullName },
      { label: 'Gender:', value: selectedUser?.gender },
      { label: 'DOB:', value: selectedUser?.dob },
      { label: 'Blood Group:', value: selectedUser?.bloodGroup },
      { label: 'Email:', value: selectedUser?.email },
      { label: 'Current Address:', value: selectedUser?.currentAddress },
      { label: 'Permanent Address:', value: selectedUser?.permanentAddress },
      { label: 'Pincode:', value: selectedUser?.pinCode },
      { label: 'Permanent Pincode:', value: selectedUser?.permanentpinCode },
      { label: 'Landmark:', value: selectedUser?.landmark },
      { label: 'Permanent Landmark:', value: selectedUser?.permanentlandmark },
      { label: 'District:', value: selectedUser?.district },
      { label: 'Permanent District:', value: selectedUser?.permanentdistrict },
      { label: 'City:', value: selectedUser?.city },
      { label: 'Permanent City:', value: selectedUser?.permanentcity },
      { label: 'State:', value: selectedUser?.state },
      { label: 'Permanent State:', value: selectedUser?.permanentstate },
      { label: 'Country:', value: selectedUser?.country },
      { label: 'Mobile No:', value: selectedUser?.mobileNo },
      { label: 'Parent No:', value: selectedUser?.parentNo },
      { label: 'Department:', value: selectedUser?.department },
      { label: 'Designation:', value: selectedUser?.workDetail },
      { label: 'Work Location:', value: selectedUser?.workLocation },
      { label: 'Duty Type:', value: selectedUser?.dutyType },
      { label: 'Employee Type:', value: selectedUser?.employeeType },
      { label: 'Employee Category:', value: selectedUser?.employeecategory },
      { label: 'Aadhar No:', value: selectedUser?.adharNo },
      { label: 'Pan No:', value: selectedUser?.panNo },
      { label: 'Joining Date:', value: selectedUser?.joiningDate },
      { label: 'End Date:', value: selectedUser?.enddate },
      { label: 'Salary:', value: selectedUser?.salary },
      { label: 'CPF No:', value: selectedUser?.cpfNo },
      { label: 'ESIC No:', value: selectedUser?.esicNo },
      { label: 'Basic Qualification:', value: selectedUser?.basicQualification },
      { label: 'Professional Qualification:', value: selectedUser?.professionalQualification },
      { label: 'Shift:', value: selectedUser?.shift },
      { label: 'Shift Start Time:', value: selectedUser?.shiftStartTime },
      { label: 'Shift End Time:', value: selectedUser?.shiftEndTime },
      { label: 'Status:', value: selectedUser?.status },
    ];
    // Convert userInfo to data suitable for autotable
    const tableData = userInfo.map(({ label, value }) => [label, value]);
    // Set properties for PDF document
    const margin = { top: 15, left: 15, right: 15 };
    const startY = 5 // Initial y position for autotable
    // Add header
    doc.setFontSize(18);
    doc.text('User Information', margin.left, startY);
    doc.setFontSize(12);
    // Generate table using autotable
    doc.autoTable({
      startY: startY + 10, // Start table slightly below the title
      head: [['Field', 'Value']],
      body: tableData,
      theme: 'striped', // Optional: 'striped', 'grid', 'plain'
      margin: { top: startY + 30, left: margin.left, right: margin.right },
      didDrawPage: function (data) {
        // Add footer with page number
        doc.setFontSize(10);
        doc.text('Page ' + doc.internal.getNumberOfPages(), margin.left, doc.internal.pageSize.height - 10);
      },
    });
    // Save the PDF
    doc.save('UserInformation.pdf');
  };
  const handleDownloadCsv = () => {
    const csvData = filteredUsers.map((user) => ({
      Id: user.empID,
      'Full Name': user.fullName,
      DOB: user.dob,
      'Blood Group': user.bloodGroup,
      Gender: user.gender,
      'Aadhar No': user.adharNo,
      'PAN No': user.panNo,
      Email: user.email,
      Password: user.password,
      'Confirm Password': user.confirmPassword,
      'Current Address': user.currentAddress,
      'Permanent Address': user.permanentAddress,
      'PIN Code': user.pinCode,
      'Permanent PinCode':user.permanentpinCode,
      'Landmark': user.landmark,
      'Permanent Landmark': user.permanentlandmark,
      District: user.district,
      'Permanent District': user.permanentdistrict,
      'City': user.city,
      'Permanent City': user.permanentcity,
      'State': user.state,
      'Permanent State': user.permanentstate,
      Country: user.country,
      'Mobile No': user.mobileNo,
      'Parent No': user.parentNo,
      'Joining Date': user.joiningDate,
      Department: user.department,
      'Duty Type': user.dutyType,
      Salary: user.salary,
      'Work Detail': user.workDetail,
      'Work Location': user.workLocation,
      'CPF No': user.cpf_no,
      'Employee Type': user.employee_type,
      'Employee Category': user.employeecategory,
      'End Date': user.enddate,
      'ESIC No': user.esic_no,
      'Basic Qualification': user.basicQualification,
      'Professional Qualification': user.professionalQualification,
      'Shift Start Time': user.shiftStartTime,
      'Shift End Time': user.shiftEndTime,
      Status: user.status,
      Shift: user.shift,
    }));

    const csvContent = [
      [
        'Id',
        'Full Name',
        'DOB',
        'Blood Group',
        'Gender',
        'Aadhar No',
        'PAN No',
        'Email',
        'Password',
        'Confirm Password',
        'Current Address',
        'Permanent Address',
        'PIN Code',
        'Permanent PinCode',
        'Landmark',
        'Permanent Landmark',
        'District',
        'Permanent District',
        'City',
        'Permanent City',
        'State',
        'Permanent State',
        'Country',
        'Joining Date',
        'Department',
        'Duty Type',
        'Salary',
        'Work Detail',
        'Work Location',
        'Mobile No',
        'Parent No',
        'CPF No',
        'Employee Type',
        'Employee Category',
        'End Date',
        'ESIC No',
        'Basic Qualification',
        'Professional Qualification',
        'Shift Start Time',
        'Shift End Time',
        'Status',
        'Shift',
      ],
      ...csvData.map((row) => Object.values(row)),
    ]
      .map((e) => e.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
    <Typography
    variant="h5"
    gutterBottom
    sx={{
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      backgroundColor: '#24A0ED',
      borderRadius: '150px',
      padding: '10px',
      marginBottom: '25px',
    }}
  >
    Employee List 
    </Typography>
    <div className="container1">
      <div className="headertable1">
        <Paper component={Box} p={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={2} sx={{ marginBottom: '5px' }}>
          <Grid item xs={2}>
        <FormControl fullwidth>
            <TextField
            label="Search"
              id="search-input"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search"
            />
          </FormControl>
          </Grid>
  <Grid item xs={3}>
    <FormControl fullWidth>
      <TextField
      select
      label="Department"
        value={selectedDepartment}
        onChange={(e) => setSelectedDepartment(e.target.value)}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {uniqueDepartments.map((department) => (
          <MenuItem key={department} value={department}>
            {department}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  </Grid>
  
  <Grid item xs={3}>
    <FormControl fullWidth>
      <TextField
      select
      label="Category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {uniqueCategories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  </Grid>

  <Grid item xs={3}>
    <FormControl fullWidth>
      <TextField
      select
      label="Designation"
        value={selectedDesignation}
        onChange={(e) => setSelectedDesignation(e.target.value)}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {uniqueDesignations.map((designation) => (
          <MenuItem key={designation} value={designation}>
            {designation}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  </Grid>
  <Button variant="contained" onClick={handleDownloadCsv} sx={{ ml: 2, mt:2}}>
            Download CSV
          </Button>
</Grid>      
        </Paper>
      </div>
      <TablePagination
      component="div"
      count={filteredUsers.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[10, 20, 50]}
      labelRowsPerPage="Entries per Page"
    />
    <div >
      <TableContainer>
      <Table>
        <TableHead sx={{backgroundColor:'#f2f2f2'}}>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Id
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Full Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Email
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Department
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Category
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Designation
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                City
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Joining Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                End Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Status
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Actions
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user.empID}>
              <TableCell>{user.empID}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>{user.employeecategory}</TableCell>
              <TableCell>{user.workDetail}</TableCell>
              <TableCell>{user.city}</TableCell>
              <TableCell>{new Date(user.joiningDate).toLocaleDateString('en-GB')}</TableCell>
              <TableCell>{user.enddate ? new Date(user.enddate).toLocaleDateString('en-GB') : ''}</TableCell>
              <TableCell style={{ color: getStatusColor(user.status), fontWeight: 'bold' }}>{user.status}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                <IconButton onClick={() => handleShowInfo(user.empID)} aria-label="info" sx={{ color: 'green' }}>
                  <Info />
                </IconButton>
                <IconButton onClick={() => fetchUserById(user.empID)} aria-label="edit" sx={{ color: 'blue' }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.empID)} aria-label="delete" sx={{ color: 'red' }}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => handleCancel(user.empID)} aria-label="cancel" sx={{ color: 'red' }}>
                      <Cancel />
                    </IconButton> {/* Cancel icon */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
    <TablePagination
      component="div"
      count={filteredUsers.length}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={[10, 20, 50]}
      labelRowsPerPage="Entries per Page"
    />

      {/* Update Modal */}
      {selectedUser && (
  <Modal
    open={showUpdateModal}
    onClose={() => setShowUpdateModal(false)}
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Box
      sx={{
        width: '90%',
        maxWidth: 900,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxHeight: '90vh',
        overflowY: 'auto', // This makes the content scrollable
        display: 'flex',
        flexDirection: 'column',
        borderRadius:'5px'
      }}
    >
     <Typography
    variant="h5"
    gutterBottom
    sx={{
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      backgroundColor: '#24A0ED',
      borderRadius: '150px',
      padding: '10px',
      marginBottom: '-2px'
    }}
  >
    Update Employee 
    </Typography>
      <hr/>
      <br/>
      <form>
              <Grid container spacing={3} className='textField-root'>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={selectedUser?.fullName || ''}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    
                    name="bloodGroup"
                    value={selectedUser?.bloodGroup}
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
                    value={selectedUser?.gender}
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
                    value={selectedUser?.email || ''}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="date"
                  label="DOB"
                  name="dob"
                  value={selectedUser?.dob}
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
                  value={selectedUser?.adharNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  label="Pan No"
                  name="panNo"
                  value={selectedUser?.panNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="number"
                  label="Mobile No"
                  name="mobileNo"
                  value={selectedUser?.mobileNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="number"
                  label="Parent No"
                  name="parentNo"
                  value={selectedUser?.parentNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
               <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <TextField
              required
              name="country"
              value={selectedUser?.country}
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
              value={selectedUser?.state}
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
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
          <TextField
required
name="city"
value={selectedUser?.city || ''}
onChange={handleInputChange}
label="City"
select
>
{cities.map((option) => (
  <MenuItem key={option.name} value={option.name}>
    {option.name}
  </MenuItem>
))}
</TextField>
          </FormControl>
        </Grid>
               <Grid item xs={12} sm={4}>
            <TextField
              required
              name="district"
              value={selectedUser?.district}
              onChange={handleInputChange}
              label="District"
              fullWidth
            />
        </Grid>
        
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Pincode"
                  name="pinCode"
                  value={selectedUser?.pinCode}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  label="Landmark"
                  name="landmark"
                  value={selectedUser?.landmark}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  label="Current Address"
                  name="currentAddress"
                  value={selectedUser?.currentAddress}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  label="Permanent Address"
                  name="permanentAddress"
                  value={selectedUser?.permanentAddress}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  required
                  name="permanentCountry"
                  value={selectedUser.permanentCountry}
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
                  value={selectedUser?.permanentstate}
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
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
              <TextField
required
name="permanentcity"
value={selectedUser?.permanentcity || ''}
onChange={handleInputChange}
label="Permanent City"
select
>
{permanentCities.map((option) => (
  <MenuItem key={option.name} value={option.name}>
    {option.name}
  </MenuItem>
))}
</TextField>
              </FormControl>
            </Grid>
                  <Grid item xs={12} sm={4}>
            <TextField
              required
              name="permanentdistrict"
              value={selectedUser?.permanentdistrict}
              onChange={handleInputChange}
              label="Permanent District"
              fullWidth
            />
        </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Permanent Pincode"
                  name="permanentpinCode"
                  value={selectedUser?.permanentpinCode}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  label="Permanent Landmark"
                  name="permanentlandmark"
                  value={selectedUser?.permanentlandmark}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="date"
                  label="Joining Date"
                  name="joiningDate"
                  value={selectedUser?.joiningDate}
                  onChange={handleInputChange}
                  fullWidth
                 // InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <TextField
            required
            name="department"
            value={selectedUser?.department}
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
            value={selectedUser?.employeecategory}
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
                    value={selectedUser?.workLocation || ''}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Designation"
                    name="workDetail"
                    value={selectedUser?.workDetail || ''}
                    onChange={handleInputChange}
                  />
                </Grid>              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    
                    name="dutyType"
                    value={selectedUser?.dutyType}
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
                    value={selectedUser?.employeeType}
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
                  value={selectedUser?.salary}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="number"
                  label="CPF No"
                  name="cpfNo"
                  value={selectedUser?.cpfNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="number"
                  label="ESIC No"
                  name="esicNo"
                  value={selectedUser?.esicNo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="text"
                  label="Basic Qualification"
                  name="basicQualification"
                  value={selectedUser?.basicQualification}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  
                  type="text"
                  label="Professional Qualification"
                  name="professionalQualification"
                  value={selectedUser?.professionalQualification}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>                 
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    
                    name="shift"
                    value={selectedUser?.shift}
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
                  value={selectedUser?.shiftStartTime}
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
                  value={selectedUser?.shiftEndTime}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
                {/* <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <TextField
                    
                    name="status"
                    value={selectedUser?.status}
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
                  value={selectedUser?.enddate}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid> */}
                <Grid item xs={12} sx={{ mt: 2, ml:75 }}>
                  <Button variant="contained" onClick={handleUpdate}>Update</Button>
                  <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowUpdateModal(false)}
        sx={{ ml: 2 }}
      >
        Close
      </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Modal>
      )}

      {/* Info Modal */}
{selectedUser && (
  <Modal
    open={showInfoModal}
    onClose={() => setShowInfoModal(false)}
    aria-labelledby="user-info-modal"
    aria-describedby="user-info-description"
  >
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 900,
        maxHeight: '90vh', // Limiting height to 90% of viewport height
        overflowY: 'auto', // Making content scrollable if it exceeds maxHeight
        bgcolor: 'background.paper',
        borderRadius:'5px',
        boxShadow: 24,
        p: 4,
      }}
    >
      <Typography
    variant="h5"
    gutterBottom
    sx={{
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      backgroundColor: '#24A0ED',
      borderRadius: '150px',
      padding: '10px',
      marginBottom: '-2px'
    }}
  >
   Employee Information
    </Typography>
      <hr/>
      <Grid container spacing={3}>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Full Name:</Typography> {selectedUser?.fullName}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Email:</Typography> {selectedUser?.email}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Department:</Typography> {selectedUser?.department}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Designation:</Typography> {selectedUser?.workDetail}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Current Address:</Typography> {selectedUser?.currentAddress}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Address:</Typography> {selectedUser?.permanentAddress}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Pincode:</Typography> {selectedUser?.pinCode}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Pincode:</Typography> {selectedUser?.permanentpinCode}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Landmark:</Typography> {selectedUser?.landmark}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Landmark:</Typography> {selectedUser?.permanentlandmark}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>District:</Typography> {selectedUser?.district}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent District:</Typography> {selectedUser?.permanentdistrict}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>City:</Typography> {selectedUser?.city}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent City:</Typography> {selectedUser?.permanentcity}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>State:</Typography> {selectedUser?.state}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent State:</Typography> {selectedUser?.permanentstate}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Country:</Typography> {selectedUser?.country}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Permanent Country:</Typography> {selectedUser?.permanentCountry}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Mobile No:</Typography> {selectedUser?.mobileNo}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Parent No:</Typography> {selectedUser?.parentNo}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Work Location:</Typography> {selectedUser?.workLocation}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Duty Type:</Typography> {selectedUser?.dutyType}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Employee Type:</Typography> {selectedUser?.employeeType}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Employee Category:</Typography> {selectedUser?.employeecategory}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Gender:</Typography> {selectedUser?.gender}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>DOB:</Typography> {new Date(selectedUser?.dob).toLocaleDateString('en-GB')}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Aadhar No:</Typography> {selectedUser?.adharNo}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Pan No:</Typography> {selectedUser?.panNo}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Blood Group:</Typography> {selectedUser?.bloodGroup}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Joining Date:</Typography> {new Date(selectedUser?.joiningDate).toLocaleDateString('en-GB')}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>End Date:</Typography> 
  {selectedUser?.enddate ? new Date(selectedUser.enddate).toLocaleDateString('en-GB') : ''}
</Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Salary:</Typography> {selectedUser?.salary}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>CPF No:</Typography> {selectedUser?.cpfNo}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>ESIC No:</Typography> {selectedUser?.esicNo}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Basic Qualification:</Typography> {selectedUser?.basicQualification}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Professional Qualification:</Typography> {selectedUser?.professionalQualification}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Shift:</Typography> {selectedUser?.shift}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Shift Start Time:</Typography> {selectedUser?.shiftStartTime}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Shift End Time:</Typography> {selectedUser?.shiftEndTime}
      </Grid>
      <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 1 }}>Status:</Typography> {selectedUser?.status}
      </Grid>
    </Grid>
      <Box mt={2} textAlign="right">
          <Button variant="contained" color="primary" onClick={handleDownloadPDF}>
            Download
          </Button>
          <Button
        variant="contained"
        color="secondary"
        onClick={() => setShowInfoModal(false)}
        sx={{ ml: 2 }}
      >
        Close
      </Button>
        </Box>
    </Box>
  </Modal>
)}
<ToastContainer/>
    </div>
    </>
  );
};
export default EmployeeList;