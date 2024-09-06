// import React, { useState,useEffect } from "react";
// import axios from "axios";
// import {
//   TextField,
//   Button,
//   Typography,
//   Grid,
//   Checkbox,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   FormControlLabel,
//   styled,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Paper,
//   Modal,
//   Box,
// } from "@mui/material";
// import PolicyPopup from "./PolicyPopup ";
// import { policies } from "./policies";
// import { useNavigate } from "react-router-dom";
// import indianStatesAndDistricts from "./indianStatesAndDistricts";

// const CreateAccount = () => {
//   const [formData, setFormData] = useState({
//     emailaddress: "",
//     phonenumber: "",
//     password: "",
//     confirmpassword: "",
//     institutename: "",
//     institutecode: "",
//     mobilenumber: "",
//     websitename: "",
//     address: "",
//     landmark: "",
//     city: "",
//     state: "",
//     district: "",
//     registrationnumber: "",
//     aadhar: "",
//     pancard: "",
//     loa: "",
//     status: "",
//     mou: "",
//     instituteimage: null,
//     country: "India",
//     publicid: "",
//     employeemanagementsystem: false,
//     studentmanagementsystem: false,
//     feesmanagementsystem: false,
//     incomeandexpense: false,
//     enquirymanagementsystem: false,
//     admissionmanagementsystem: false,
//     plan: "",
//     subscriptionyear: "",
//     subscriptstartDate: "",
//     subscriptendDate: "",
//     gstNo: "",
//     pincode: "",
//   });
//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});

//   const [imageUpload, setImageUpload] = useState(null);
//   const [isSaveSuccessful, setIsSaveSuccessful] = useState(false);
//   const [institutecode, setInstituteCode] = useState("");
// const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [selectedPolicy, setSelectedPolicy] = useState([]);
//   const [open, setOpen] = useState(false);
// const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
//   const [amount, setAmount] = useState(0);
//   const handleChange = (e) => {
//     const { name, value, type, checked, files } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]:
//         type === "checkbox" ? checked : type === "file" ? files[0] : value,
//     }));
//   };

//   const calculateAmount = () => {
//     const { plan, subscriptionyear } = formData;
//     let monthlyRate = 0;

//     switch (plan) {
//       case 'Basic':
//         monthlyRate = 199;
//         break;
//       case 'Premium':
//         monthlyRate = 299;
//         break;
//       case 'Business':
//         monthlyRate = 499;
//         break;
//       default:
//         monthlyRate = 0;
//     }

//     const totalAmount = monthlyRate * 12 * subscriptionyear;
//     const amountWithGst = totalAmount * 1; // Adding 18% GST
//     return Math.round(amountWithGst * 100); // Convert to paisa
//   };

// useEffect(() => {
//   const calculatedAmount = calculateAmount();
//   setAmount(calculatedAmount / 100); // Convert paisa back to INR for display
// }, [formData]);

// const handlePayment = () => {
//   const amount = calculateAmount();
//   const options = {
//     key: "rzp_test_vv1FCZvuDRF6lQ",
//     key_secret: "P4JAUwn4VdE6xDLJ6p2Zy8RQ", // Replace with your Razorpay key
//     amount: amount, // Amount in paisa (10000 paisa = INR 100)
//     currency: "INR",
//     name: "PJSOFTTECH PTV. LTD",
//     description: "Test Transaction",
//     handler: function (response) {
//       setIsPaymentSuccessful(true);
//       setIsPopupOpen(false);
//     },
//     prefill: {
//       name: formData.institutename,
//       email: formData.emailaddress,
//       contact: formData.phonenumber,
//     },
//     notes: {
//       address: "Razorpay Corporate Office",
//     },
//     theme: {
//       color: "#003366",
//     },
//   };

//   const rzp = new window.Razorpay(options);
//   rzp.open();
// };

//   const validateForm = () => {
//     let formErrors = {};
//     if (!formData.emailaddress.match(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)) {
//       formErrors.emailaddress =
//         "Email must be in the format: example@gmail.com";
//     }
//     if (!formData.phonenumber.match(/^\d{10}$/)) {
//       formErrors.phonenumber = "Phone number must be 10 digits.";
//     }
//     if (!formData.mobilenumber.match(/^\d{10}$/)) {
//       formErrors.mobilenumber = "Mobile number must be 10 digits.";
//     }
//     if (formData.aadhar.length !== 12 || isNaN(formData.aadhar)) {
//       formErrors.aadhar = "Aadhar number must be 12 digits.";
//     }
//     if (formData.password !== formData.confirmpassword) {
//       formErrors.confirmpassword = "Confirm password does not match.";
//     }
//     if (!formData.institutename) {
//       formErrors.institutename = "Institute name is required.";
//     }
//     if (!formData.city) {
//       formErrors.city = "City is required.";
//     }
//     if (!formData.state) {
//       formErrors.state = "State is required.";
//     }
//     if (!formData.district) {
//       formErrors.district = "District is required.";
//     }

//     return formErrors;
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length === 0) {
//       try {
//         // Prepare data for submission
// const dataToSubmit = {
//   emailaddress: formData.emailaddress,
//   password: formData.password,
//    confirmpassword:formData.confirmpassword,
//           phonenumber: formData.phonenumber,
//           institutename: formData.institutename,
//           aadhar: formData.aadhar,
//           mobilenumber: formData.mobilenumber,
//           registrationnumber: formData.registrationnumber,
//           state: formData.state,
//           district: formData.district,
//           city: formData.city,
//           employeemanagementsystem: formData.employeemanagementsystem,
//           studentmanagementsystem: formData.studentmanagementsystem,
//           feesmanagementsystem: formData.feesmanagementsystem,
//           incomeandexpense: formData.incomeandexpense,
//           enquirymanagementsystem: formData.enquirymanagementsystem,
//           admissionmanagementsystem: formData.admissionmanagementsystem,
//           plan: formData.plan,
//           subscriptionyear: formData.subscriptionyear,
//           subscriptstartDate: formData.subscriptstartDate,
//           //subscriptendDate: formData.subscriptendDate,
//           pincode: formData.pincode,
//           gstNo: formData.gstNo,
//         };
//         setIsSaveSuccessful(true);
//         const response = await axios.post(
//           "http://localhost:8081/saveinstitude",
//           dataToSubmit
//         );

//         // Alert the user about form submission success
//         alert("Form Submitted Successfully");
//         console.log("Institute saved successfully:", response.data);

//         // Save email to localStorage for image upload
//         localStorage.setItem("email", formData.emailaddress);
//       } catch (error) {
//         console.error("Error saving institute:", error);
//       }
//     } else {
//       setErrors(formErrors);
//     }
//   };

//   const handleClickOpen = (policy) => {
//     setSelectedPolicy(policy);
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleImageUpload = async () => {
//     const email = localStorage.getItem("email");

//     if (email && imageUpload) {
//       const formDataImage = new FormData();
//       formDataImage.append("instituteimage", imageUpload);

//       try {
//         const response = await axios.post(
//           `http://localhost:8081/uploadimage/${email}`,
//           formDataImage,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         // Alert the user about image upload success
//         alert("Image Uploaded Successfully");
//         console.log("Image uploaded successfully:", response.data);
//         // Clear the image upload state
//         setImageUpload(null);
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         alert(
//           "Error uploading image: " + (error.response?.data || error.message)
//         );
//       }
//     } else {
//       alert("Email or file not found!");
//     }
//   };

//   const ImageUploadButton = styled(Button)(({ theme }) => ({
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     "&:hover": {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   }));

//   const handleSubmit = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/findInstitutesby/email?emailaddress=${formData.emailaddress}`
//       );

//       if (response.data && response.data.institutecode) {
//         setInstituteCode(response.data.institutecode);
//         setIsPopupOpen(true);
//       } else {
//         console.error("No institute code found for the provided email.");
//       }
//     } catch (error) {
//       console.error("API call failed", error);
//     }
//   };

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(institutecode);
//       alert("Copied to clipboard!");
//     } catch (err) {
//       console.error("Failed to copy: ", err);
//     }
//   };

//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//     navigate("/systems");
//   };

//   const state = Object.keys(indianStatesAndDistricts);
//   const district = formData.state
//     ? indianStatesAndDistricts[formData.state]
//     : [];

//   return (
//     <div
//       style={{
//         backgroundImage: `url('https://media.idownloadblog.com/wp-content/uploads/2016/02/Twitter-GIF.gif')`,
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center center",
//         minHeight: "100vh",
//         color: "#ffffff", // Optional: Set text color for contrast
//       }}
//     >
//       <form
//         onSubmit={handleSave}
//         style={{ marginLeft: "100px", marginRight: "100px" }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             width: "100%",
//           }}
//         >
//           <Box
//             sx={{
//               flexGrow: 1,
//               height: "1px",
//               backgroundColor: "gold",
//             }}
//           />
//           <Typography variant="h4" sx={{ margin: "0 10px", color: "gold" }}>
//             <b>Create Account</b>
//           </Typography>
//           <Box
//             sx={{
//               flexGrow: 1,
//               height: "1px",
//               backgroundColor: "gold",
//             }}
//           />
//         </Box>
//         <Paper
//           align="center"
//           elevation={3}
//           style={{
//             padding: "20px",
//             align: "center",
//             marginTop: "10px",
//             marginBottom: "10px",
//           }}
//         >
//           <Grid container spacing={2}>
//             {/* Email, Phone Number, Mobile Number */}
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Firm / Institute Name"
//                 name="institutename"
//                 value={formData.institutename}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 // error!!errors.institutename}
//                 //helperText={errors.institutename}
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Owner's Email Address"
//                 name="emailaddress"
//                 value={formData.emailaddress}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 // error!!errors.emailaddress}
//                 //helperText={errors.emailaddress}
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Admin Phone Number"
//                 name="phonenumber"
//                 value={formData.phonenumber}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 // error!!errors.phonenumber}
//                 //helperText={errors.phonenumber}
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Firm / Institute Mobile Number"
//                 name="mobilenumber"
//                 value={formData.mobilenumber}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 // error!!errors.mobilenumber}
//                 //helperText={errors.mobilenumber}
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>

//             {/* Password, Confirm Password, Institute Name */}
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 fullWidth
//                 required
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Confirm Password"
//                 name="confirmpassword"
//                 type="password"
//                 value={formData.confirmpassword}
//                 onChange={handleChange}
//                 fullWidth
//                 // error!!errors.confirmpassword}
//                 //helperText={errors.confirmpassword}
//                 required
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>

//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Owner's Aadhar No."
//                 name="aadhar"
//                 value={formData.aadhar}
//                 onChange={handleChange}
//                 fullWidth
//                 // error!!errors.aadhar}
//                 //helperText={errors.aadhar}
//                 required
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Owner's Pan No."
//                 name="pancard"
//                 value={formData.pancard}
//                 onChange={handleChange}
//                 fullWidth
//                 // error!!errors.pan}
//                 //helperText={errors.pan}
//                 required
//                 InputLabelProps={{
//                   className: "required-asterisk",
//                 }}
//               />
//             </Grid>

//             {/* Website, Address (Full Width), Landmark */}
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Website Link"
//                 name="websitename"
//                 value={formData.websitename}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="GST No."
//                 name="gstNo"
//                 value={formData.gstNo}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grid>

//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   select
//                   label="Plan"
//                   name="plan"
//                   value={formData.plan}
//                   onChange={handleChange}
//                   InputLabelProps={{
//                     className: "required-asterisk",
//                   }}
//                 >
//                   <MenuItem value="Demo/free">Demo/free</MenuItem>
//                   <MenuItem value="Basic">Basic (₹199/month)</MenuItem>
//                   <MenuItem value="Premium">Premium (₹299/month)</MenuItem>
//                   <MenuItem value="Business">Business (₹499/month)</MenuItem>
//                 </TextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   select
//                   label="Subscription Years"
//                   name="subscriptionyear"
//                   value={formData.subscriptionyear}
//                   onChange={handleChange}
//                   InputLabelProps={{
//                     className: "required-asterisk",
//                   }}
//                   required
//                 >
//                   <MenuItem value="1">1 year</MenuItem>
//                   <MenuItem value="2">2 years</MenuItem>
//                   <MenuItem value="3">3 years</MenuItem>
//                   <MenuItem value="4">4 years</MenuItem>
//                   <MenuItem value="5">5 years</MenuItem>
//                   <MenuItem value="10">10 years</MenuItem>
//                 </TextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Firm / Institute Address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 multiline
//                 // rows={4}
//                 fullWidth
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 required
//               />
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Landmark"
//                 name="landmark"
//                 value={formData.landmark}
//                 onChange={handleChange}
//                 fullWidth
//               />
//             </Grid>

//             {/* Country, State, District */}
//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   select
//                   label="Country"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                 >
//                   <MenuItem value="India">India</MenuItem>
//                 </TextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   select
//                   label="State"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleChange}
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   required
//                 >
//                   {state.map((state) => (
//                     <MenuItem key={state} value={state}>
//                       {state}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth>
//                 <TextField
//                   select
//                   label="District"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleChange}
//                   disabled={!formData.state}
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   required
//                 >
//                   {district.map((district) => (
//                     <MenuItem key={district} value={district}>
//                       {district}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </FormControl>
//             </Grid>

//             {/* City, Registration Number */}
//             <Grid item xs={12} sm={3}>
//               <FormControl fullWidth required>
//                 <TextField
//                   label="City"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleChange}
//                   // error!!errors.city}
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   required
//                 ></TextField>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Pincode"
//                 name="pincode"
//                 required
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ className: "required-asterisk" }}
//               />
//             </Grid>
//           </Grid>

//           <Paper
//             align="center"
//             elevation={3}
//             style={{
//               padding: "16px",
//               align: "center",
//               marginTop: "10px",
//               backgroundColor: "#003366",
//             }}
//           >
//             <Typography variant="h6" sx={{ fontWeight: "bold", color: "gold" }}>
//               {" "}
//               Select the Systems
//             </Typography>
//             <Grid container spacing={2}>
//               {/* Checkboxes for Management Systems */}
//               <Grid item xs={12}>
//                 <Grid container spacing={2} sx={{ color: "white" }}>
//                   <Grid item xs={4}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={formData.employeemanagementsystem}
//                           onChange={handleChange}
//                           name="employeemanagementsystem"
//                           color="primary"
//                         />
//                       }
//                       label="Employee Management System"
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={formData.studentmanagementsystem}
//                           onChange={handleChange}
//                           name="studentmanagementsystem"
//                           color="primary"
//                         />
//                       }
//                       label="Student Management System"
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={formData.feesmanagementsystem}
//                           onChange={handleChange}
//                           name="feesmanagementsystem"
//                           color="primary"
//                         />
//                       }
//                       label="Fees Management System"
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>

//               {/* Income and Expense, Enquiry, Admission */}
//               <Grid item xs={12} sx={{ color: "white" }}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={4}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={formData.incomeandexpense}
//                           onChange={handleChange}
//                           name="incomeandexpense"
//                           color="primary"
//                         />
//                       }
//                       label="Income and Expense Management"
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={formData.enquirymanagementsystem}
//                           onChange={handleChange}
//                           name="enquirymanagementsystem"
//                           color="primary"
//                         />
//                       }
//                       label="Enquiry Management System"
//                     />
//                   </Grid>
//                   <Grid item xs={4}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           checked={formData.admissionmanagementsystem}
//                           onChange={handleChange}
//                           name="admissionmanagementsystem"
//                           color="primary"
//                         />
//                       }
//                       label="Admission Management System"
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Terms and Conditions */}

//           <Grid
//             container
//             spacing={2}
//             justifyContent="center"
//             sx={{ marginTop: "24px" }}
//           >
//             <Grid item>
//               <FormControlLabel
//                 control={<Checkbox />}
//                 label={
//                   <Typography
//                     variant="body1"
//                     align="center"
//                     onClick={() => handleClickOpen(policies.privacyPolicy)}
//                     sx={{ cursor: "pointer", textDecoration: "underline" }}
//                   >
//                     Privacy Policy
//                   </Typography>
//                 }
//               />
//             </Grid>
//             <Grid item>
//               <FormControlLabel
//                 control={<Checkbox />}
//                 label={
//                   <Typography
//                     variant="body1"
//                     align="center"
//                     onClick={() => handleClickOpen(policies.termsConditions)}
//                     sx={{ cursor: "pointer", textDecoration: "underline" }}
//                   >
//                     Terms & Conditions
//                   </Typography>
//                 }
//               />
//             </Grid>
//             <Grid item>
//               <FormControlLabel
//                 control={<Checkbox />}
//                 label={
//                   <Typography
//                     variant="body1"
//                     align="center"
//                     onClick={() => handleClickOpen(policies.dataProductPolicy)}
//                     sx={{ cursor: "pointer", textDecoration: "underline" }}
//                   >
//                     Data & Product Policy
//                   </Typography>
//                 }
//               />
//             </Grid>
//           </Grid>
//           {/* Dialog for Policy Information */}
//           {selectedPolicy && (
//             <PolicyPopup
//               open={open}
//               onClose={handleClose}
//               policy={selectedPolicy}
//             />
//           )}

// <Paper align="center" elevation={3} style={{ padding: "20px", marginTop: "10px", marginBottom: "10px" }}>
//           <Grid container spacing={2}>
//             {/* Your form fields */}

//             {/* Payment Button */}
//             <Grid item xs={12}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handlePayment}
//                 sx={{ backgroundColor: "#003366", color: "gold" }}
//               >
//                 Pay INR ₹ {amount}
//               </Button>
//             </Grid>
// </Grid>
// </Paper>

//           {/* Submit Button */}
//           <Grid item xs={12}>
//           <Button
//             variant="contained"
//             type="submit"
//             fullWidth
//             sx={{ backgroundColor: "#003366", color: "gold" }}
//             disabled={!isPaymentSuccessful}
//           >
//             Create Account
//           </Button>
//         </Grid>

//           {/* Dialog for Terms and Conditions */}

//           {/* Upload Image Section */}
//           <Grid item xs={12} mt={2}>
//             <ImageUploadButton
//               variant="contained"
//               onClick={() => document.getElementById("image-upload").click()}
//               sx={{ backgroundColor: "#003366", color: "gold" }}
//             >
//               Upload Image / Logo
//             </ImageUploadButton>
//           </Grid>
//           <input
//             type="file"
//             id="image-upload"
//             style={{ display: "none" }}
//             onChange={(e) => {
//               setImageUpload(e.target.files[0]);
//             }}
//           />
//           <Grid item xs={12}>
//             {imageUpload && (
//               <Button variant="contained" onClick={handleImageUpload} mt={2}>
//                 Confirm Image Upload
//               </Button>
//             )}
//           </Grid>
//           {isSaveSuccessful && (
//             <Button variant="contained" color="primary" onClick={handleSubmit}>
//               Get Your Institute Code
//             </Button>
//           )}

//           {/* Popup for Payment Success */}
//           <Modal open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
//             <Box sx={{ padding: 4, backgroundColor: "white", borderRadius: 2 }}>
//               <Typography variant="h6">
//                 Payment Successful!
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={() => setIsPopupOpen(false)}
//               >
//                 Close
//               </Button>
//             </Box>
//           </Modal>

//           <Modal open={isPopupOpen} onClose={handleClosePopup}>
//             <Box sx={{ padding: 4, backgroundColor: "white", borderRadius: 2 }}>
//               <Typography variant="h6">
//                 Institute Code: {institutecode}
//               </Typography>
//               <Typography variant="body2" sx={{ color: "red", marginTop: 1 }}>
//                 Write Down Institute Code, do not forget, cannot recover
//               </Typography>
//               <Button variant="outlined" onClick={handleCopy}>
//                 Copy
//               </Button>
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleClosePopup}
//               >
//                 Close
//               </Button>
//             </Box>
//           </Modal>
//         </Paper>
//       </form>
//     </div>
//   );
// };

// export default CreateAccount;

import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  FormControl,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CardContent,
  Paper,
} from "@mui/material";
import axios from "axios";
import logo from "../img/logo.jpg";
import indianStatesAndDistricts from "./indianStatesAndDistricts";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    emailaddress: "",
    password: "",
    confirmpassword: "",
    phonenumber: "",
    institutename: "",
    mobilenumber: "",
    websitename: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    district: "",
    aadhar: "",
    pancard: "",
    country: "India",
    employeemanagementsystem: false,
    studentmanagementsystem: false,
    feesmanagementsystem: false,
    incomeandexpense: false,
    enquirymanagementsystem: false,
    admissionmanagementsystem: false,
    gstNo: "",
    pincode: "",
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [amount, setAmount] = useState(0);
  const [amountPerMonth, setAmountPerMonth] = useState(0);
  const gstPercentage = 18;

  const handleCardSelect = (cardIndex) => {
    setSelectedCard(cardIndex);
  };

  const calculateAmount = () => {
    let amountPerMonth;

    // Determine the amount per month based on the selected card
    if (selectedCard === 1) {
      amountPerMonth = 199;
    } else if (selectedCard === 2) {
      amountPerMonth = 299;
    } else if (selectedCard === 3) {
      amountPerMonth = 499;
    } else {
      return { finalAmount: 0, amountPerMonth: 0, gstAmount: 0 };
    }

    // Calculate amount for the selected plan and subscription years
    const totalAmount = amountPerMonth * 12;

    // Add GST
    const gstAmount = totalAmount * (gstPercentage / 100);
    const finalAmount = totalAmount + gstAmount;

    // Convert to paisa (1 INR = 100 paisa)
    return {
      finalAmount: finalAmount * 100,
      amountPerMonth,
      gstAmount,
    };
  };

  useEffect(() => {
    const { finalAmount, amountPerMonth, gstAmount } = calculateAmount();
    setAmount(finalAmount / 100); // Convert paisa back to INR for display
    setAmountPerMonth(amountPerMonth);
  }, [selectedCard]);

  const handlePayment = () => {
    const { finalAmount } = calculateAmount();
    const options = {
      key: "rzp_test_vv1FCZvuDRF6lQ",
      key_secret: "P4JAUwn4VdE6xDLJ6p2Zy8RQ", // Replace with your Razorpay key
      amount: finalAmount, // Amount in paisa (10000 paisa = INR 100)
      currency: "INR",
      name: "PJSOFTTECH PTV. LTD",
      description: "Test Transaction",
      handler: function (response) {
        // Handle payment success
        setPaymentSuccessful(true);
      },
      prefill: {
        name: formData.institutename,
        email: formData.emailaddress,
        contact: formData.phonenumber,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#003366",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const handleCheckboxChange = (e) => {
    setShowOptionalFields(e.target.checked); // Toggle fields based on checkbox state
  };
  // const isSelected = (index) => selectedCard === index;
  const handleChange = (e) => {
    const { name, checked, type, value } = e.target;

    // Update formData with checkbox toggle for checkboxes, or value for other inputs
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      emailaddress: formData.emailaddress,
      password: formData.password,
      confirmpassword: formData.confirmpassword,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/saveinstitude",
        dataToSubmit
      );
      console.log(response.data); // handle response
    } catch (error) {
      console.error(error); // handle error
    }
  };
  const state = Object.keys(indianStatesAndDistricts);
  const district = formData.state
    ? indianStatesAndDistricts[formData.state]
    : [];

  const featureList = {
    0: {
      crm: true,
      employeeManagement: false,
      subAdmin: false,
      multipleBranches: false,
      unlimitedEntries: false,
      support: true,
    },
    1: {
      crm: true,
      employeeManagement: true,
      subAdmin: true,
      multipleBranches: false,
      unlimitedEntries: false,
      support: true,
    },
    2: {
      crm: true,
      employeeManagement: true,
      subAdmin: true,
      multipleBranches: true,
      unlimitedEntries: true,
      support: true,
    },
    3: {
      crm: true,
      employeeManagement: true,
      subAdmin: true,
      multipleBranches: true,
      unlimitedEntries: true,
      support: true,
    },
  };

  const renderFeatureIcon = (isAvailable) => {
    return isAvailable ? "✔" : "✘";
  };
  return (
    <>
      <Grid
        item
        xs={4}
        display="flex"
        alignItems="center"
        justifyContent="center" // Center horizontally
        marginTop="30px"
      >
        <Box
          sx={{
            flexGrow: 1,
            height: "5px",
            backgroundColor: "#0D47A1",
            marginLeft: "30px",
          }}
        />
        <img
          src={logo}
          alt="Logo"
          style={{ height: "30px", marginRight: "10px" }}
        />
        <Typography variant="h4" noWrap color="purple">
          PJSOFTTECH
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            height: "5px",
            backgroundColor: "#0D47A1",
            marginRight: "30px",
          }}
        />
      </Grid>

      <div
        style={{ marginRight: "50px", marginLeft: "50px", marginTop: "30px" }}
      >
        {/* Grid to align image and text on the same line */}
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Text */}
          <Grid item>
            <Typography
              variant="h4"
              align="left"
              color="Orange"
              fontWeight="19px"
            >
              You’re almost there! Complete your order
            </Typography>
          </Grid>

          {/* Money-back guarantee text */}
          <Grid item>
            <Typography variant="h6" align="right" color="Orange">
              <img
                src="https://cart.hostinger.com/assets/MoneyBackGuarantee.svg"
                alt="30-day money-back guarantee"
                style={{ maxWidth: "50px" }}
              />{" "}
              30-day money-back guarantee
            </Typography>
          </Grid>
        </Grid>
      </div>

      <div
        style={{ marginLeft: "50px", marginRight: "50px", marginTop: "20px" }}
      >
        <Typography variant="h4" style={{ marginBottom: "2px" }} color="purple">
          Select Plan
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} lg={4}>
            <Grid container spacing={2} marginTop="5px">
              {["Demo / Free", "Basic", "Premium", "Business"].map(
                (plan, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      onClick={() => handleCardSelect(index)}
                      sx={{
                        padding: 1,
                        textAlign: "center",
                        height: 400,
                        background:
                          selectedCard === index
                            ? "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)"
                            : "linear-gradient(135deg, #FFEBEE 0%, #EF9A9A 100%)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        borderRadius: 4,
                        cursor: "pointer",
                        border:
                          selectedCard === index ? "2px solid #0D47A1" : "none",
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          sx={{
                            background:
                              "linear-gradient(90deg, #EF5350 0%, #D32F2F 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "bold",
                          }}
                        >
                          {plan}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: "bold",
                              color: "#0D47A1",
                              marginRight: 1,
                            }}
                          >
                            ₹
                            {index === 0
                              ? 1
                              : index === 1
                              ? 199
                              : index === 2
                              ? 299
                              : 499}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#1E88E5" }}>
                            /Per Month
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          color="red"
                          sx={{
                            textDecoration: "line-through",
                            fontSize: "1rem",
                            marginBottom: 2,
                          }}
                        >
                          ₹
                          {index === 0
                            ? 99
                            : index === 1
                            ? 299
                            : index === 2
                            ? 399
                            : 699}
                        </Typography>

                        <div style={{ textAlign: "left", fontSize: "14px" }}>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>CRM Software</span>
                            <span>
                              {renderFeatureIcon(featureList[index].crm)}
                            </span>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>Employee Management</span>
                            <span>
                              {renderFeatureIcon(
                                featureList[index].employeeManagement
                              )}
                            </span>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>Sub Admin</span>
                            <span>
                              {renderFeatureIcon(featureList[index].subAdmin)}
                            </span>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>Multiple Branches</span>
                            <span>
                              {renderFeatureIcon(
                                featureList[index].multipleBranches
                              )}
                            </span>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>Unlimited Entries</span>
                            <span>
                              {renderFeatureIcon(
                                featureList[index].unlimitedEntries
                              )}
                            </span>
                          </p>
                          <p
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>Lifetime Support 24/7</span>
                            <span>
                              {renderFeatureIcon(featureList[index].support)}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>

          {/* Right side: Form (60% width) */}
          <Grid item xs={12} md={7} lg={8} className="textField-root">
            <Paper elevation={3} style={{ padding: "30px", marginTop: "20px" }}>
              <Typography
                variant="h4"
                textAlign="center"
                style={{ marginTop: "10px" }}
                color="purple"
              >
                Create your account
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Owner's Email Address"
                      name="emailaddress"
                      value={formData.emailaddress}
                      onChange={handleChange}
                      fullWidth
                      required
                      // error!!errors.emailaddress}
                      //helperText={errors.emailaddress}
                      InputLabelProps={{
                        className: "required-asterisk",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ className: "required-asterisk" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmpassword"
                      type="password"
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ className: "required-asterisk" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="h4"
                      textAlign="center"
                      style={{ marginTop: "10px" }}
                      color="purple"
                    >
                      Basic Information
                    </Typography>
                  </Grid>
                  <Grid container spacing={2}>
                    {/* Email, Phone Number, Mobile Number */}
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Firm / Institute Name"
                        name="institutename"
                        value={formData.institutename}
                        onChange={handleChange}
                        fullWidth
                        required
                        // error!!errors.institutename}
                        //helperText={errors.institutename}
                        InputLabelProps={{
                          className: "required-asterisk",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Admin Phone Number"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                        fullWidth
                        required
                        // error!!errors.phonenumber}
                        //helperText={errors.phonenumber}
                        InputLabelProps={{
                          className: "required-asterisk",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Firm / Institute Mobile Number"
                        name="mobilenumber"
                        value={formData.mobilenumber}
                        onChange={handleChange}
                        fullWidth
                        required
                        // error!!errors.mobilenumber}
                        //helperText={errors.mobilenumber}
                        InputLabelProps={{
                          className: "required-asterisk",
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Owner's Aadhar No."
                        name="aadhar"
                        value={formData.aadhar}
                        onChange={handleChange}
                        fullWidth
                        // error!!errors.aadhar}
                        //helperText={errors.aadhar}
                        required
                        InputLabelProps={{
                          className: "required-asterisk",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Owner's Pan No."
                        name="pancard"
                        value={formData.pancard}
                        onChange={handleChange}
                        fullWidth
                        // error!!errors.pan}
                        //helperText={errors.pan}
                        required
                        InputLabelProps={{
                          className: "required-asterisk",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <TextField
                          select
                          label="Subscription Years"
                          name="subscriptionyear"
                          value={formData.subscriptionyear}
                          onChange={handleChange}
                          InputLabelProps={{
                            className: "required-asterisk",
                          }}
                          required
                        >
                          <MenuItem value="1">1 year</MenuItem>
                          <MenuItem value="2">2 years</MenuItem>
                          <MenuItem value="3">3 years</MenuItem>
                          <MenuItem value="4">4 years</MenuItem>
                          <MenuItem value="5">5 years</MenuItem>
                          <MenuItem value="10">10 years</MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Firm / Institute Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        multiline
                        // rows={4}
                        fullWidth
                        InputLabelProps={{ className: "required-asterisk" }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>

                    {/* Country, State, District */}
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <TextField
                          select
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                        >
                          <MenuItem value="India">India</MenuItem>
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <TextField
                          select
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          InputLabelProps={{ className: "required-asterisk" }}
                          required
                        >
                          {state.map((state) => (
                            <MenuItem key={state} value={state}>
                              {state}
                            </MenuItem>
                          ))}
                        </TextField>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth>
                        <TextField
                          select
                          label="District"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          disabled={!formData.state}
                          InputLabelProps={{ className: "required-asterisk" }}
                          required
                        >
                          {district.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))}
                        </TextField>
                      </FormControl>
                    </Grid>

                    {/* City, Registration Number */}
                    <Grid item xs={12} sm={3}>
                      <FormControl fullWidth required>
                        <TextField
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          // error!!errors.city}
                          InputLabelProps={{ className: "required-asterisk" }}
                          required
                        ></TextField>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Pincode"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        fullWidth
                        InputLabelProps={{ className: "required-asterisk" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={showOptionalFields}
                            onChange={handleCheckboxChange}
                            color="primary"
                          />
                        }
                        label="Website & GST (Optional)"
                      />
                    </Grid>

                    {/* Conditionally render Website Link and GST No fields */}
                    {showOptionalFields && (
                      <>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="Website Link"
                            name="websitename"
                            value={formData.websitename}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            label="GST No."
                            name="gstNo"
                            value={formData.gstNo}
                            onChange={handleChange}
                            fullWidth
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="h4"
                      textAlign="center"
                      style={{ marginTop: "10px" }}
                      color="purple"
                    >
                      Select the Systems
                    </Typography>
                  </Grid>
                  <Paper
                    align="center"
                    elevation={3}
                    style={{
                      padding: "16px",
                      align: "center",
                      marginTop: "10px",
                      backgroundColor: "#003366",
                    }}
                  >
                    <Grid container>
                      {/* Checkboxes for Management Systems */}
                      <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ color: "white" }}>
                          <Grid item xs={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.employeemanagementsystem}
                                  onChange={handleChange}
                                  name="employeemanagementsystem"
                                  color="primary"
                                />
                              }
                              label="Employee System"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.studentmanagementsystem}
                                  onChange={handleChange}
                                  name="studentmanagementsystem"
                                  color="primary"
                                />
                              }
                              label="Student System"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.feesmanagementsystem}
                                  onChange={handleChange}
                                  name="feesmanagementsystem"
                                  color="primary"
                                />
                              }
                              label="Fees System"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Income and Expense, Enquiry, Admission */}
                      <Grid item xs={12} sx={{ color: "white" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.incomeandexpense}
                                  onChange={handleChange}
                                  name="incomeandexpense"
                                  color="primary"
                                />
                              }
                              label="Income & Expense System"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.enquirymanagementsystem}
                                  onChange={handleChange}
                                  name="enquirymanagementsystem"
                                  color="primary"
                                />
                              }
                              label="Enquiry System"
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.admissionmanagementsystem}
                                  onChange={handleChange}
                                  name="admissionmanagementsystem"
                                  color="primary"
                                />
                              }
                              label="Admission System"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                  <Grid item xs={12}>
                    <Typography
                      variant="h4"
                      textAlign="center"
                      style={{ marginTop: "10px" }}
                      color="purple"
                    >
                      Payment Information
                    </Typography>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <strong>Plan Value Per Month</strong>
                        <span>₹ {amountPerMonth || 0}</span>
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "5px",
                        }}
                      >
                        <strong>Taxs & Fees ({gstPercentage}%)</strong>
                        <span>
                          ₹{" "}
                          {(
                            ((amountPerMonth || 0) * 12 * gstPercentage) /
                            100
                          ).toFixed(2)}
                        </span>
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          marginTop: "5px",
                          color: "green",
                        }}
                      >
                        <strong>Grand Total </strong>
                        <span>₹ {amount || 0}</span>
                      </Typography>
                    </Grid>
                    {/* Payment Button */}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handlePayment}
                        sx={{ backgroundColor: "#003366", color: "gold" }}
                        disabled={selectedCard === null} // Disable if no plan is selected
                      >
                        Pay INR ₹ {amount || 0}
                      </Button>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={!paymentSuccessful} // Disable if payment is not successful
                    >
                      Create Account
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default CreateAccount;
