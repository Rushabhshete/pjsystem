
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
//   Grid,
// } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UpdateAdmissionForm = ({ admission, onUpdate }) => {
//   const [formValues, setFormValues] = useState(admission);
//   const [courses, setCourses] = useState([]);
//   const [guides, setGuides] = useState([]);
//   const [sources, setSources] = useState([]);

//   const institutecode = localStorage.getItem("institutecode");

//   useEffect(() => {
//     const fetchSources = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
//         );
//         setSources(response.data);
//       } catch (error) {
//         console.error("Error fetching sources:", error);
//       }
//     };

//     fetchSources();
//   }, [institutecode]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8085/getAllCourse?institutecode=${institutecode}`
//         );
//         setCourses(response.data);
//       } catch (error) {
//         console.error("Error fetching courses:", error);
//       }
//     };

//     fetchCourses();
//   }, [institutecode]);

//   useEffect(() => {
//     const fetchGuides = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
//         );
//         setGuides(response.data);
//       } catch (error) {
//         console.error("Error fetching guides:", error);
//       }
//     };

//     fetchGuides();
//   }, [institutecode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));
//   };

//   const handleUpdateAdmission = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.put(
//         `http://localhost:8085/updateAdmission/${formValues.id}`,
//         formValues
//       );
//       toast.success("Admission updated successfully!");
//       if (onUpdate) {
//         onUpdate(formValues); // Call the onUpdate function if provided
//       }
//     } catch (error) {
//       toast.error("Error updating admission.");
//       console.error("Error updating admission:", error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleUpdateAdmission}>
//         {/* Form Fields */}
//         <Grid container spacing={1} className="textField-root">
//           {" "}
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="name"
//               label="Name"
//               value={formValues.name || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="email"
//               label="Email"
//               value={formValues.email || ""}
//               onChange={handleChange}
//               fullWidth
             
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="mobile1"
//               label="Mobile"
//               value={formValues.mobile1 || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="courses"
//               value={formValues.courses || ""}
//               onChange={handleChange}
//               select
//               fullWidth
//               label="Course"
//             >
//               {courses.map((course) => (
//                 <MenuItem key={course.id} value={course.cname}>
//                   {course.cname}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="duration"
//               label="Duration"
//               value={formValues.duration || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="date"
//               label="Joining Date"
//               type="date"
//               value={formValues.date || ""}
//               onChange={handleChange}
//               fullWidth
              
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="dueDate"
//               label="Expiry Date"
//               type="date"
//               value={formValues.dueDate || ""}
//               onChange={handleChange}
//               fullWidth
              
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="totalFees"
//               label="Total Fees"
//               value={formValues.totalFees || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="paidFees"
//               label="Paid Fees"
//               value={formValues.paidFees || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="pendingFees"
//               label="Pending Fees"
//               value={formValues.pendingFees || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="paymentMode"
//               value={formValues.paymentMode || ""}
//               onChange={handleChange}
//               select
//               label="Payment Mode"
//               fullWidth
//             >
//               <MenuItem value="Gpay">Gpay</MenuItem>
//               <MenuItem value="Phonepay">Phonepay</MenuItem>
//               <MenuItem value="Cash">Cash</MenuItem>
//               <MenuItem value="Card">Credit Card</MenuItem>
//               <MenuItem value="Card">Debit Card</MenuItem>
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="transactionid"
//               label="Transaction ID"
//               value={formValues.transactionid || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="guideName"
//               value={formValues.guideName || ""}
//               onChange={handleChange}
//               selectlabel="Guide Name"
//             >
//               {guides.map((guide) => (
//                 <MenuItem key={guide.id} value={guide.guideName}>
//                   {guide.guideName}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="sourceBy"
//               value={formValues.sourceBy || ""}
//               onChange={handleChange}
//               select
//               label="Source By"
//               fullWidth
//             >
//               {sources.map((source) => (
//                 <MenuItem key={source.id} value={source.sourceBy}>
//                   {source.sourceBy}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="remark"
//               label="Remark"
//               value={formValues.remark || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <TextField
//               name="status"
//               label="Status"
//               value={formValues.status || ""}
//               onChange={handleChange}
//               fullWidth
              
//             />
//           </Grid>
//           <Grid item xs={12} sm={4}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               //style={{ marginTop: "25px" }}
//             >
//               Update Admission
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default UpdateAdmissionForm;




import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateAdmissionForm = ({ admission, onUpdate,onClose  }) => {
  const [formData, setFormData] = useState(admission);
  const [courses, setCourses] = useState([]);
  const [guide, setGuide] = useState([]);
  const [source, setSources] = useState([]);
  const [touched, setTouched] = useState({});
  

  const institutecode = localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/sourceBy/getAll?institutecode=${institutecode}`
        );
        setSources(response.data);
      } catch (error) {
        console.error("Error fetching source:", error);
      }
    };

    fetchSources();
  }, [institutecode]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/getAllCourse?institutecode=${institutecode}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [institutecode]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/conductBy/getAllConductBy?institutecode=${institutecode}`
        );
        setGuide(response.data);
      } catch (error) {
        console.error("Error fetching guide:", error);
      }
    };

    fetchGuides();
  }, [institutecode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleUpdateAdmission = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `http://localhost:8085/updateAdmission/${formData.id}`,
        formData
      );
      toast.success("Admission updated successfully!");
      if (onUpdate) {
        onUpdate(formData); // Call the onUpdate function if provided
      }
    } catch (error) {
      toast.error("Error updating admission.");
      console.error("Error updating admission:", error);
    }
  };
  const calculateBalance = () => {
    if (
      formData.paymentMethod === "Partial" ||
      formData.paymentMethod === "Pending"
    ) {
      return formData.totalFees - formData.paidFees;
    }
    
    return 0; // No balance for other payment methods
  };

  const handleBlur = (field) => (event) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateMobileNumber = (value) => {
    return /^\d{10}$/.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  return (
    <div>
      <form onSubmit={handleUpdateAdmission} className="required-asterisk"  >
        {/* Form Fields */}
        <Grid container spacing={3} className="textField-root" marginTop={1}>
          {" "}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur("email")}
              required
              error={touched.email && !validateEmail(formData.email)}
              helperText={
                touched.email && !validateEmail(formData.email)
                  ? "Enter a valid email address"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="mobile1"
              name="mobile1"
              label="Mobile 1"
              value={formData.mobile1}
              onChange={handleInputChange}
              onBlur={handleBlur("mobile1")}
              required
              error={touched.mobile1 && !validateMobileNumber(formData.mobile1)}
              helperText={
                touched.mobile1 && !validateMobileNumber(formData.mobile1)
                  ? "Mobile number must be 10 digits"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="mobile2"
              name="mobile2"
              label="Mobile 2"
              value={formData.mobile2}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="courses"
              name="courses"
              label="Courses"
              value={formData.courses}
              onChange={handleInputChange}
              select
              required
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.cname}>
                  {course.cname}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="medium"
              name="medium"
              label="Medium"
              value={formData.medium}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="duration"
              name="duration"
              label="Duration"
              value={formData.duration}
              onChange={handleInputChange}
              select
              required
            >
              <MenuItem value="3 Months">3 Months</MenuItem>
              <MenuItem value="6 Months">6 Months</MenuItem>
              <MenuItem value="12 Months">12 Months</MenuItem>
              <MenuItem value="24 Months">24 Months</MenuItem>
              <MenuItem value="36 Months">36 Months</MenuItem>
              <MenuItem value="48 Months">48 Months</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="totalFees"
              name="totalFees"
              label="Total Fees"
              value={formData.totalFees}
              onChange={handleInputChange}
            />
          </Grid>{" "}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="paymentMethod"
              name="paymentMethod"
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              select
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Partial">Partial</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="paidFees"
              name="paidFees"
              label="Paid Fees"
              value={formData.paidFees}
              onChange={handleInputChange}
              required
            />
          </Grid>
          {formData.paymentMethod === "Pending" ||
          formData.paymentMethod === "Partial" ? (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="balanceAmount"
                name="balanceAmount"
                label="Balance Amount"
                value={calculateBalance()}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="paymentMode"
              name="paymentMode"
              label="Payment Mode"
              value={formData.paymentMode}
              onChange={handleInputChange}
              select
              required
            >
              <MenuItem value="Cheque">Cheque</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            
            </TextField>
          </Grid>
          {formData.paymentMode !== "Cash" ? (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="transactionid"
                name="transactionid"
                label="Transaction ID"
                value={formData.transactionid}
                onChange={handleInputChange}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="sourceBy"
              name="sourceBy"
              label="Source By"
              value={formData.sourceBy}
              onChange={handleInputChange}
              select
              required
            >
              {source.map((src) => (
                <MenuItem key={src.id} value={src.sourceBy}>
                  {src.sourceBy}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="guideName"
              name="guideName"
              label="Conduct By"
              value={formData.guideName}
              onChange={handleInputChange}
              select
              required
            >
              {guide.map((g) => (
                <MenuItem key={g.id} value={g.guideName}>
                  {g.guideName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="date"
              name="date"
              label="Date"
              value={formData.date}
              onChange={handleInputChange}
              type="date"
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          {formData.paymentMethod === "Pending" ||
          formData.paymentMethod === "Partial" ? (
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                id="dueDate"
                name="dueDate"
                label="Due Date"
                value={formData.dueDate}
                onChange={handleInputChange}
                type="date"
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              id="remark"
              name="remark"
              label="Remark"
              value={formData.remark}
              onChange={handleInputChange}
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="status"
              label="Status"
              value={formData.status || ""}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              //style={{ marginTop: "25px" }}
            >
              Update Admission
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateAdmissionForm;
