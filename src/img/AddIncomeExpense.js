// import React, { useState, useEffect, useRef } from "react";
// import {
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   FormControl,
//   MenuItem,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Checkbox,
//   FormControlLabel,
//   Menu,
// } from "@mui/material";
// import {
//   typeOptions,
//   billTypeOptions,
//   paidByOptions,
//   paymentMethodOption,
// } from "./DropdownData";
// import CloseIcon from "@mui/icons-material/Close";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { styled } from "@mui/system";
// import axios from "axios";

// const PopTypography = styled(Typography)`
//   @keyframes pop {
//     0% {
//       transform: scale(1);
//     }
//     50% {
//       transform: scale(1.1);
//     }
//     100% {
//       transform: scale(1);
//     }
//   }

//
// `;

// const AddIncomeExpense = () => {
//   const [formData, setFormData] = useState({
//     type: "",
//     user: "",
//     date: "",
//     category: "",
//     particular: "",
//     amount: "",
//     gst: "",
//     total: "",
//     paymentMethod: "",
//     payingAmount: "",
//     pendingAmount: "",
//     billType: "",
//     paidBy: "",
//     transactionId: "",
//     duedate: "",
//     remark: "",
//   });

//   const [showGst, setShowGst] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // New state for search term
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const inputRef = useRef(null);

//   const getEmail = () => localStorage.getItem("APIemail");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(
//           `http://13.233.43.240:8087/users/getAllUserByEmail?email=${getEmail()}`
//         );
//         setUsers(response.data);
//         setFilteredUsers(response.data); // Initialize with all users
//         setLoading(false);
//       } catch (error) {
//         setError("Error fetching users. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `http://13.233.43.240:8087/categories/getAllCategoriesByEmail?email=${getEmail()}`
//         );
//         setCategories(response.data);
//       } catch (error) {
//         setError("Error fetching categories. Please try again.");
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (formData.amount && formData.gst) {
//       const amount = parseFloat(formData.amount);
//       const gst = parseFloat(formData.gst);
//       const total = amount + (amount * gst) / 100;
//       setFormData((prevState) => ({
//         ...prevState,
//         total: total.toFixed(2),
//       }));
//     }
//   }, [formData.amount, formData.gst]);

//   useEffect(() => {
//     if (formData.total && formData.payingAmount) {
//       const totalAmount = parseFloat(formData.total);
//       const payingAmount = parseFloat(formData.payingAmount);
//       const pendingAmount = totalAmount - payingAmount;
//       setFormData((prevState) => ({
//         ...prevState,
//         pendingAmount: pendingAmount >= 0 ? pendingAmount : 0,
//       }));
//     }
//   }, [formData.total, formData.payingAmount]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       setShowGst(checked);
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//       if (name === "paidBy" && value === "Cash") {
//         setFormData((prevState) => ({
//           ...prevState,
//           transactionId: "",
//         }));
//       }
//       // Handle search term update for user
//       if (name === "user") {
//         setSearchTerm(value);
//         setAnchorEl(value ? inputRef.current : null);
//       }
//     }
//   };

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = users.filter(user =>
//         user.userName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     } else {
//       setFilteredUsers(users);
//     }
//   }, [searchTerm, users]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const apiUrl =
//       formData.type === "Income"
//         ? `http://13.233.43.240:8087/incomes/save?adminemail=${getEmail()}`
//         : `http://13.233.43.240:8087/expenses/save?adminemail=${getEmail()}`;

//     try {
//       await axios.post(apiUrl, formData);
//       toast.success("Form submitted successfully!");
//       setFormData({
//         type: "",
//         user: "",
//         date: "",
//         category: "",
//         particular: "",
//         amount: "",
//         gst: "",
//         total: "",
//         paymentMethod: "",
//         payingAmount: "",
//         pendingAmount: "",
//         billType: "",
//         paidBy: "",
//         transactionId: "",
//         gstNumber: "",
//         duedate: "",
//         remark: "",
//       });
//       setSearchTerm("");
//       setShowGst(false);
//     } catch (error) {
//       toast.error("Error submitting form. Please try again.");
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       type: "",
//       user: "",
//       date: "",
//       category: "",
//       particular: "",
//       amount: "",
//       gst: "",
//       total: "",
//       paymentMethod: "",
//       payingAmount: "",
//       pendingAmount: "",
//       billType: "",
//       paidBy: "",
//       transactionId: "",
//       gstNumber: "",
//       duedate: "",
//       remark: "",
//     });
//     setSearchTerm("");
//     setShowGst(false);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (userName) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       user: userName,
//     }));
//     setSearchTerm(""); // Clear search term
//     setAnchorEl(null); // Close dropdown
//   };

//   return (
//     <div>
//       <ToastContainer
      autoClose={1000} // Toast will close automatically after 5 seconds
      position="top-right" // Position of the toast
      hideProgressBar={false} // Show or hide the progress bar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
//       <PopTypography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           color: "#fff",
//           textAlign: "center",
//           backgroundColor: "#24A0ED",
//           borderRadius: "150px",
//           padding: "10px",
//           marginBottom: "20px",
//         }}
//       >
//         Add Income/Expense
//       </PopTypography>

//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={3} className="textField-root">
//           {/* Dropdown Fields */}
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Type"
//                 name="type"
//                 required
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 value={formData.type}
//                 onChange={handleChange}
//                 select
//               >
//                 {typeOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 labelId="user-input-label"
//                 label="User"
//                 name="user"
//                 value={formData.user}
//                 onChange={handleChange}
//                 onClick={handleClick}
//                 fullWidth
//                 variant="outlined"
//                 inputRef={inputRef}
//               />
//             </FormControl>
//             {filteredUsers.length > 0 && (
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//               >
//                 {filteredUsers.map((user) => (
//                   <MenuItem
//                     key={user.id}
//                     onClick={() => handleSelect(user.userName)}
//                   >
//                     {user.userName}
//                   </MenuItem>
//                 ))}
//               </Menu>
//             )}
//           </Grid>
//           {/* Other Fields */}
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Date"
//               name="date"
//               type="date"
//               value={formData.date}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               required
//               InputLabelProps={{ shrink: true, className: "required-asterisk" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Category"
//                 name="category"
//                 value={formData.category}
//                 required
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 onChange={handleChange}
//                 select
//               >
//                 {categories.map((option) => (
//                   <MenuItem key={option.id} value={option.categoryName}>
//                     {option.categoryName}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Particular"
//               name="particular"
//               value={formData.particular}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Amount"
//               name="amount"
//               type="number"
//               value={formData.amount}
//               required
//               onChange={handleChange}
//               fullWidth
//               InputLabelProps={{ className: "required-asterisk" }}
//               variant="outlined"
//             />
//           </Grid>

//           {/* GST Checkbox */}
//           <Grid item xs={12} sm={3}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={showGst}
//                   onChange={handleChange}
//                   name="showGst"
//                 />
//               }
//               label="Include GST"
//             />
//           </Grid>
//           {showGst && (
//             <>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   type="number"
//                   label="GST (%)"
//                   name="gst"
//                   value={formData.gst}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   type="number"
//                   label="GST Number"
//                   name="gstNumber"
//                   value={formData.gstNumber}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//             </>
//           )}

//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Total"
//               name="total"
//               type="number"
//               value={formData.total}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               InputProps={{ readOnly: true }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Payment Method"
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 required
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 onChange={handleChange}
//                 select
//               >
//                 {paymentMethodOption.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>

//           {formData.paymentMethod === "Partial" ||
//           formData.paymentMethod === "Pending" ? (
//             <>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   label="Amount Paying"
//                   name="payingAmount"
//                   value={formData.payingAmount}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   label="Amount Pending"
//                   name="pendingAmount"
//                   value={formData.pendingAmount}
//                   onChange={handleChange}
//                   fullWidth
//                   variant="outlined"
//                   InputProps={{ readOnly: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   label="Due Date"
//                   name="duedate"
//                   type="date"
//                   value={formData.duedate}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </>
//           ) : null}

//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Bill Type"
//                 name="billType"
//                 value={formData.billType}
//                 required
//                 onChange={handleChange}
//                 select
//                 InputLabelProps={{ className: "required-asterisk" }}
//               >
//                 {billTypeOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Paid Using"
//                 name="paidBy"
//                 value={formData.paidBy}
//                 required
//                 onChange={handleChange}
//                 select
//                 InputLabelProps={{ className: "required-asterisk" }}
//               >
//                 {paidByOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           {formData.paidBy !== "Cash" && (
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Transaction ID"
//                 name="transactionId"
//                 value={formData.transactionId}
//                 onChange={handleChange}
//                 fullWidth
//                 variant="outlined"
//               />
//             </Grid>
//           )}

//           <Grid item xs={12} sm={12}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Remark"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleChange}
//               />
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ height: "56px" }}
//             >
//               Submit
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ height: "56px" }}
//             >
//               Cancel
//             </Button>
//           </Grid>
//         </Grid>
//       </form>

//       <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
//         <DialogTitle>
//           Form Data
//           <IconButton
//             aria-label="close"
//             onClick={handleCloseDialog}
//             sx={{
//               position: "absolute",
//               right: 8,
//               top: 8,
//               color: (theme) => theme.palette.grey[500],
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent>
//           <pre>{JSON.stringify(formData, null, 2)}</pre>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default AddIncomeExpense;

import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Checkbox,
  FormControlLabel,
  Menu,
} from "@mui/material";
import {
  typeOptions,
  billTypeOptions,
  paidByOptions,
  paymentMethodOption,
} from "./DropdownData";
import CloseIcon from "@mui/icons-material/Close";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/system";
import axios from "axios";
import { debounce } from "lodash"; // Import debounce function from lodash

const PopTypography = styled(Typography)`
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  
`;

const AddIncomeExpense = () => {
  const [formData, setFormData] = useState({
    type: "",
    user: "",
    date: "",
    category: "",
    particular: "",
    amount: "",
    gst: "",
    total: "",
    paymentMethod: "",
    payingAmount: "",
    pendingAmount: "",
    billType: "",
    paidBy: "",
    transactionId: "",
    duedate: "",
    remark: "",
  });

  const [showGst, setShowGst] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);

  const getEmail = () => localStorage.getItem("APIemail");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://13.233.43.240:8087/users/getAllUserByEmail?email=${getEmail()}`
        );
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize with all users
        setLoading(false);
      } catch (error) {
        setError("Error fetching users. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://13.233.43.240:8087/categories/getAllCategoriesByEmail?email=${getEmail()}`
        );
        setCategories(response.data);
      } catch (error) {
        setError("Error fetching categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.amount) {
      const amount = parseFloat(formData.amount);
      let total = amount;

      if (showGst && formData.gst) {
        const gst = parseFloat(formData.gst);
        total += (amount * gst) / 100;
      }

      setFormData((prevState) => ({
        ...prevState,
        total: total.toFixed(2),
      }));
    }
  }, [formData.amount, formData.gst, showGst]);

  useEffect(() => {
    if (formData.total && formData.payingAmount) {
      const totalAmount = parseFloat(formData.total);
      const payingAmount = parseFloat(formData.payingAmount);
      const pendingAmount = totalAmount - payingAmount;
      setFormData((prevState) => ({
        ...prevState,
        pendingAmount: pendingAmount >= 0 ? pendingAmount : 0,
      }));
    }
  }, [formData.total, formData.payingAmount]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setShowGst(checked);
    } else {
      setFormData((prevState) => {
        const newState = { ...prevState, [name]: value };

        // Check if paymentMethod is "Complete"
        if (name === "paymentMethod") {
          if (value === "Complete") {
            newState.payingAmount = newState.total;
            newState.pendingAmount = 0;
          } else {
            // Reset payingAmount and pendingAmount if paymentMethod is not "Complete"
            newState.payingAmount = "";
            newState.pendingAmount =
              newState.total - (parseFloat(newState.payingAmount) || 0);
          }
        }

        // Handle search term update for user
        if (name === "user") {
          setSearchTerm(value);
          if (value.length >= 3) {
            setAnchorEl(inputRef.current);
          } else {
            setAnchorEl(null);
          }
        }

        return newState;
      });
    }
  };

  // Debounce the search function to improve performance
  const debouncedSearch = debounce((term) => {
    if (term) {
      const filtered = users.filter((user) =>
        user.userName.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, 500); // 300ms debounce delay

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, users]);
  const validateFormData = (data) => {
    return {
      ...data,
      amount: parseFloat(data.amount).toFixed(0),
      gst: parseFloat(data.gst).toFixed(0),
      total: parseFloat(data.total).toFixed(0),
      payingAmount: parseFloat(data.payingAmount).toFixed(0),
      pendingAmount: parseFloat(data.pendingAmount).toFixed(0),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const integerFormData = {
      ...formData,
      amount: Math.floor(parseFloat(formData.amount)),
      gst: Math.floor(parseFloat(formData.gst)),
      total: Math.floor(parseFloat(formData.total)),
      payingAmount: Math.floor(parseFloat(formData.payingAmount)),
      pendingAmount: Math.floor(parseFloat(formData.pendingAmount)),
    };
    const apiUrl =
      formData.type === "Income"
        ? `http://13.233.43.240:8087/incomes/save?adminemail=${getEmail()}`
        : `http://13.233.43.240:8087/expenses/save?adminemail=${getEmail()}`;

    try {
      await axios.post(apiUrl, integerFormData);
      toast.success("Form submitted successfully!");
      setFormData({
        type: "",
        user: "",
        date: "",
        category: "",
        particular: "",
        amount: "",
        gst: "",
        total: "",
        paymentMethod: "",
        payingAmount: "",
        pendingAmount: "",
        billType: "",
        paidBy: "",
        transactionId: "",
        gstNumber: "",
        duedate: "",
        remark: "",
      });
      setSearchTerm("");
      setShowGst(false);
    } catch (error) {
      toast.error("Error submitting form. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      type: "",
      user: "",
      date: "",
      category: "",
      particular: "",
      amount: "",
      gst: "",
      total: "",
      paymentMethod: "",
      payingAmount: "",
      pendingAmount: "",
      billType: "",
      paidBy: "",
      transactionId: "",
      gstNumber: "",
      duedate: "",
      remark: "",
    });
    setSearchTerm("");
    setShowGst(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (userName) => {
    setFormData((prevState) => ({
      ...prevState,
      user: userName,
    }));
    setSearchTerm(""); // Clear search term
    setAnchorEl(null); // Close dropdown
  };

  return (
    <div>
      <ToastContainer
      autoClose={1000} // Toast will close automatically after 5 seconds
      position="top-right" // Position of the toast
      hideProgressBar={false} // Show or hide the progress bar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
      <PopTypography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "#24A0ED",
          borderRadius: "150px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        Add Income/Expense
      </PopTypography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} className="textField-root">
          {/* Dropdown Fields */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Type"
                name="type"
                required
                InputLabelProps={{ className: "required-asterisk" }}
                value={formData.type}
                onChange={handleChange}
                select
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                labelId="user-input-label"
                label="User"
                name="user"
                value={formData.user}
                onChange={handleChange}
                onClick={handleClick}
                fullWidth
                variant="outlined"
                inputRef={inputRef}
              />
            </FormControl>
            {filteredUsers.length > 0 && anchorEl && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {filteredUsers.map((user) => (
                  <MenuItem
                    key={user.id}
                    onClick={() => handleSelect(user.userName)}
                  >
                    {user.userName}
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Grid>
          {/* Other Fields */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              InputLabelProps={{ shrink: true, className: "required-asterisk" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                required
                InputLabelProps={{ className: "required-asterisk" }}
                onChange={handleChange}
                select
              >
                {categories.map((option) => (
                  <MenuItem key={option.id} value={option.categoryName}>
                    {option.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Particular"
              name="particular"
              value={formData.particular}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              required
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
            />
          </Grid>

          {/* GST Checkbox */}
          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showGst}
                  onChange={handleChange}
                  name="showGst"
                />
              }
              label="Include GST"
            />
          </Grid>
          {showGst && (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="number"
                  label="GST (%)"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="number"
                  label="GST Number"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={3}>
            <TextField
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                required
                InputLabelProps={{ className: "required-asterisk" }}
                onChange={handleChange}
                select
              >
                {paymentMethodOption.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount Paying"
              name="payingAmount"
              value={formData.payingAmount}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ className: "required-asterisk" }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Amount Pending"
              name="pendingAmount"
              value={formData.pendingAmount}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
          </Grid>
          {formData.paymentMethod === "Partial" ||
          formData.paymentMethod === "Pending" ? (
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Due Date"
                  name="duedate"
                  type="date"
                  value={formData.duedate}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </>
          ) : null}

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Bill Type"
                name="billType"
                value={formData.billType}
                required
                onChange={handleChange}
                select
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {billTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Paid Using"
                name="paidBy"
                value={formData.paidBy}
                required
                onChange={handleChange}
                select
                InputLabelProps={{ className: "required-asterisk" }}
              >
                {paidByOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          {formData.paidBy !== "Cash" && (
            <Grid item xs={12} sm={3}>
              <TextField
                label="Transaction ID"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          )}

          <Grid item xs={12} sm={12}>
            <FormControl fullWidth variant="outlined">
              <TextField
                label="Remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: "56px" }}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              fullWidth
              sx={{ height: "56px" }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>
          Form Data
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddIncomeExpense;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   FormControl,
//   MenuItem,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Checkbox,
//   FormControlLabel,
//   Menu,
// } from "@mui/material";
// import {
//   typeOptions,
//   billTypeOptions,
//   paidByOptions,
//   paymentMethodOption,
// } from "./DropdownData";
// import CloseIcon from "@mui/icons-material/Close";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer, toast } from "react-toastify";
// import { styled } from "@mui/system";
// import axios from "axios";
// import { debounce } from "lodash"; // Import debounce function from lodash

// const PopTypography = styled(Typography)`
//   @keyframes pop {
//     0% {
//       transform: scale(1);
//     }
//     50% {
//       transform: scale(1.1);
//     }
//     100% {
//       transform: scale(1);
//     }
//   }

//
// `;

// const AddIncomeExpense = () => {
//   const [formData, setFormData] = useState({
//     type: "",
//     user: "",
//     date: "",
//     category: "",
//     particular: "",
//     amount: "",
//     gst: "",
//     total: "",
//     paymentMethod: "",
//     payingAmount: "",
//     pendingAmount: "",
//     billType: "",
//     paidBy: "",
//     transactionId: "",
//     duedate: "",
//     remark: "",
//   });

//   const [showGst, setShowGst] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState(""); // New state for search term
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
//   const [newUserName, setNewUserName] = useState("");
//   const inputRef = useRef(null);

//   const getEmail = () => localStorage.getItem("APIemail");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(
//           `http://13.233.43.240:8087/users/getAllUserByEmail?email=${getEmail()}`
//         );
//         setUsers(response.data);
//         setFilteredUsers(response.data); // Initialize with all users
//         setLoading(false);
//       } catch (error) {
//         setError("Error fetching users. Please try again.");
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `http://13.233.43.240:8087/categories/getAllCategoriesByEmail?email=${getEmail()}`
//         );
//         setCategories(response.data);
//       } catch (error) {
//         setError("Error fetching categories. Please try again.");
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (formData.amount && formData.gst) {
//       const amount = parseFloat(formData.amount);
//       const gst = parseFloat(formData.gst);
//       const total = amount + (amount * gst) / 100;
//       setFormData((prevState) => ({
//         ...prevState,
//         total: total.toFixed(2),
//       }));
//     }
//   }, [formData.amount, formData.gst]);

//   useEffect(() => {
//     if (formData.total && formData.payingAmount) {
//       const totalAmount = parseFloat(formData.total);
//       const payingAmount = parseFloat(formData.payingAmount);
//       const pendingAmount = totalAmount - payingAmount;
//       setFormData((prevState) => ({
//         ...prevState,
//         pendingAmount: pendingAmount >= 0 ? pendingAmount : 0,
//       }));
//     }
//   }, [formData.total, formData.payingAmount]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       setShowGst(checked);
//     } else {
//       setFormData((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//       if (name === "paidBy" && value === "Cash") {
//         setFormData((prevState) => ({
//           ...prevState,
//           transactionId: "",
//         }));
//       }
//       // Handle search term update for user
//       if (name === "user") {
//         setSearchTerm(value);
//         if (value.length >= 4) {
//           setAnchorEl(inputRef.current);
//         } else {
//           setAnchorEl(null);
//         }
//       }
//     }
//   };

//   // Debounce the search function to improve performance
//   const debouncedSearch = debounce((term) => {
//     if (term) {
//       const filtered = users.filter(user =>
//         user.userName.toLowerCase().includes(term.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     } else {
//       setFilteredUsers(users);
//     }
//   }, 500); // 300ms debounce delay

//   useEffect(() => {
//     debouncedSearch(searchTerm);
//   }, [searchTerm, users]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const apiUrl =
//       formData.type === "Income"
//         ? `http://13.233.43.240:8087/incomes/save?adminemail=${getEmail()}`
//         : `http://13.233.43.240:8087/expenses/save?adminemail=${getEmail()}`;

//     try {
//       await axios.post(apiUrl, formData);
//       toast.success("Form submitted successfully!");
//       setFormData({
//         type: "",
//         user: "",
//         date: "",
//         category: "",
//         particular: "",
//         amount: "",
//         gst: "",
//         total: "",
//         paymentMethod: "",
//         payingAmount: "",
//         pendingAmount: "",
//         billType: "",
//         paidBy: "",
//         transactionId: "",
//         gstNumber: "",
//         duedate: "",
//         remark: "",
//       });
//       setSearchTerm("");
//       setShowGst(false);
//     } catch (error) {
//       toast.error("Error submitting form. Please try again.");
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       type: "",
//       user: "",
//       date: "",
//       category: "",
//       particular: "",
//       amount: "",
//       gst: "",
//       total: "",
//       paymentMethod: "",
//       payingAmount: "",
//       pendingAmount: "",
//       billType: "",
//       paidBy: "",
//       transactionId: "",
//       gstNumber: "",
//       duedate: "",
//       remark: "",
//     });
//     setSearchTerm("");
//     setShowGst(false);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//   };

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (userName) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       user: userName,
//     }));
//     setSearchTerm(""); // Clear search term
//     setAnchorEl(null); // Close dropdown
//   };

//   const handleAddUserClick = () => {
//     setOpenAddUserDialog(true);
//     setAnchorEl(null); // Close the dropdown
//   };

//   const handleAddUserSubmit = async () => {
//     try {
//       await axios.post(
//         `http://13.233.43.240:8087/users/save?adminemail=${getEmail()}`,
//         { userName: newUserName }
//       );
//       setUsers((prevUsers) => [
//         ...prevUsers,
//         { userName: newUserName, id: prevUsers.length + 1 },
//       ]);
//       setFilteredUsers((prevUsers) => [
//         ...prevUsers,
//         { userName: newUserName, id: prevUsers.length + 1 },
//       ]);
//       toast.success("User added successfully!");
//       setNewUserName("");
//       setOpenAddUserDialog(false);
//     } catch (error) {
//       toast.error("Error adding user. Please try again.");
//     }
//   };

//   const handleAddUserCancel = () => {
//     setNewUserName("");
//     setOpenAddUserDialog(false);
//   };

//   return (
//     <div>
//       <ToastContainer
      autoClose={1000} // Toast will close automatically after 5 seconds
      position="top-right" // Position of the toast
      hideProgressBar={false} // Show or hide the progress bar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
//       <PopTypography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           color: "#fff",
//           textAlign: "center",
//           backgroundColor: "#24A0ED",
//           borderRadius: "150px",
//           padding: "10px",
//           marginBottom: "20px",
//         }}
//       >
//         Add Income/Expense
//       </PopTypography>
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl fullWidth>
//               <TextField
//                 select
//                 label="Type"
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 required
//               >
//                 {typeOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <FormControl fullWidth>
//               <TextField
//                 label="User"
//                 name="user"
//                 value={searchTerm} // Use searchTerm for display
//                 onChange={handleChange}
//                 onClick={handleClick}
//                 inputRef={inputRef}
//                 required
//                 autoComplete="off" // Disable autocomplete to avoid browser suggestions
//               />
//               <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={handleClose}
//                 PaperProps={{
//                   style: {
//                     maxHeight: 48 * 4.5, // Adjust height as needed
//                     width: "20ch",
//                   },
//                 }}
//               >
//                 <MenuItem onClick={handleAddUserClick}>
//                   <Button
//                     onClick={handleAddUserClick}
//                     color="primary"
//                     size="small"
//                   >
//                     Add User
//                   </Button>
//                 </MenuItem>
//                 {filteredUsers.map((user) => (
//                   <MenuItem
//                     key={user.id}
//                     onClick={() => handleSelect(user.userName)}
//                   >
//                     {user.userName}
//                   </MenuItem>
//                 ))}
//               </Menu>
//             </FormControl>
//           </Grid>
//           {/* The rest of your form fields remain unchanged */}
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Date"
//               name="date"
//               type="date"
//               value={formData.date}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               required
//               InputLabelProps={{ shrink: true, className: "required-asterisk" }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Category"
//                 name="category"
//                 value={formData.category}
//                 required
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 onChange={handleChange}
//                 select
//               >
//                 {categories.map((option) => (
//                   <MenuItem key={option.id} value={option.categoryName}>
//                     {option.categoryName}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Particular"
//               name="particular"
//               value={formData.particular}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Amount"
//               name="amount"
//               type="number"
//               value={formData.amount}
//               required
//               onChange={handleChange}
//               fullWidth
//               InputLabelProps={{ className: "required-asterisk" }}
//               variant="outlined"
//             />
//           </Grid>

//           {/* GST Checkbox */}
//           <Grid item xs={12} sm={3}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={showGst}
//                   onChange={handleChange}
//                   name="showGst"
//                 />
//               }
//               label="Include GST"
//             />
//           </Grid>
//           {showGst && (
//             <>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   type="number"
//                   label="GST (%)"
//                   name="gst"
//                   value={formData.gst}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   type="number"
//                   label="GST Number"
//                   name="gstNumber"
//                   value={formData.gstNumber}
//                   onChange={handleChange}
//                   fullWidth
//                 />
//               </Grid>
//             </>
//           )}

//           <Grid item xs={12} sm={3}>
//             <TextField
//               label="Total"
//               name="total"
//               type="number"
//               value={formData.total}
//               onChange={handleChange}
//               fullWidth
//               variant="outlined"
//               InputProps={{ readOnly: true }}
//             />
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Payment Method"
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 required
//                 InputLabelProps={{ className: "required-asterisk" }}
//                 onChange={handleChange}
//                 select
//               >
//                 {paymentMethodOption.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>

//           {formData.paymentMethod === "Partial" ||
//           formData.paymentMethod === "Pending" ? (
//             <>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   label="Amount Paying"
//                   name="payingAmount"
//                   value={formData.payingAmount}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   InputLabelProps={{ className: "required-asterisk" }}
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   label="Amount Pending"
//                   name="pendingAmount"
//                   value={formData.pendingAmount}
//                   onChange={handleChange}
//                   fullWidth
//                   variant="outlined"
//                   InputProps={{ readOnly: true }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <TextField
//                   label="Due Date"
//                   name="duedate"
//                   type="date"
//                   value={formData.duedate}
//                   onChange={handleChange}
//                   fullWidth
//                   required
//                   variant="outlined"
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>
//             </>
//           ) : null}

//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Bill Type"
//                 name="billType"
//                 value={formData.billType}
//                 required
//                 onChange={handleChange}
//                 select
//                 InputLabelProps={{ className: "required-asterisk" }}
//               >
//                 {billTypeOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Paid Using"
//                 name="paidBy"
//                 value={formData.paidBy}
//                 required
//                 onChange={handleChange}
//                 select
//                 InputLabelProps={{ className: "required-asterisk" }}
//               >
//                 {paidByOptions.map((option) => (
//                   <MenuItem key={option.value} value={option.value}>
//                     {option.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </FormControl>
//           </Grid>
//           {formData.paidBy !== "Cash" && (
//             <Grid item xs={12} sm={3}>
//               <TextField
//                 label="Transaction ID"
//                 name="transactionId"
//                 value={formData.transactionId}
//                 onChange={handleChange}
//                 fullWidth
//                 variant="outlined"
//               />
//             </Grid>
//           )}

//           <Grid item xs={12} sm={12}>
//             <FormControl fullWidth variant="outlined">
//               <TextField
//                 label="Remark"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleChange}
//               />
//             </FormControl>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ height: "56px" }}
//             >
//               Submit
//             </Button>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleCancel}
//               fullWidth
//               sx={{ height: "56px" }}
//             >
//               Cancel
//             </Button>
//           </Grid>
//         </Grid>
//         {/* Your submit and cancel buttons remain unchanged */}
//       </form>

//       {/* Add User Dialog */}
//       <Dialog
//         open={openAddUserDialog}
//         onClose={handleAddUserCancel}
//         aria-labelledby="add-user-dialog-title"
//       >
//         <DialogTitle id="add-user-dialog-title">Add New User</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="User Name"
//             type="text"
//             fullWidth
//             value={newUserName}
//             onChange={(e) => setNewUserName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleAddUserCancel} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleAddUserSubmit} color="primary">
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default AddIncomeExpense;
