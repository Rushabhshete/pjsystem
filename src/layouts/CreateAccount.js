import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  AppBar,
  Toolbar,
  FormControl,
  MenuItem,
  Divider,
  FormControlLabel,
  Checkbox,
  CardContent,
  Paper,
  styled,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableRow,TableHead, DialogActions, IconButton 
} from "@mui/material";
import html2pdf from 'html2pdf.js'; // Importing html2pdf.js
//import logo from '../img/logo.jpg'; 
import { policies } from "./policies";
import axios from "axios";
import logo from "../img/logo.jpg";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import indianStatesAndDistricts from "./indianStatesAndDistricts";
import PolicyPopup from "./PolicyPopup ";
import { useNavigate } from "react-router-dom";
import phonepe from "../../src/img/phonepe.png"
import gpay from "../../src/img/gpay.png";
import paytm from "../../src/img/paytm.jpg";
import upilite from "../../src/img/upilite.png";
import { Login as LoginIcon } from "@mui/icons-material"; // Importing login icon

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
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(1);
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [amount, setAmount] = useState(0);
  const [amountPerMonth, setAmountPerMonth] = useState(0);
  const [imageUpload, setImageUpload] = useState(null);
  const [isSaveSuccessful, setIsSaveSuccessful] = useState(false);
  const [institutecode, setInstituteCode] = useState("");
  const [subscriptionYear, setSubscriptionYear] = useState(1);
  const [gstAmount, setGstAmount] = useState(0);
  const [yearlyAmount, setYearlyAmount] = useState(0);
  const [selectedPolicy, setSelectedPolicy] = useState([]);
  const [open, setOpen] = useState(false);
  const [savings, setSavings] = useState(0); // Initialize savings state
  const [originalYearlyAmount, setOriginalYearlyAmount] = useState(0); // Initialize original amount state
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [openReceipt, setOpenReceipt] = useState(false);
  const gstPercentage = 18;
  const handleSubscriptionYearChange = (e) => {
    setSubscriptionYear(e.target.value);
  };
  const handleCardSelect = (cardIndex) => {
    setSelectedCard(cardIndex);
  };
  const calculateAmount = () => {
    let amountPerMonth;

    // Determine the amount per month based on the selected card
    if (selectedCard === 0) {
      amountPerMonth = 1; // Demo / Free plan
    } else if (selectedCard === 1) {
      amountPerMonth = 699; // Basic plan
    } else if (selectedCard === 2) {
      amountPerMonth = 899; // Premium plan
    } else if (selectedCard === 3) {
      amountPerMonth = 1299; // Business plan
    } else {
      return { finalAmount: 0, amountPerMonth: 0, gstAmount: 0 };
    }

    // Ensure subscriptionYear is a number
    const subscriptionYearInt = Number(subscriptionYear) || 0;

    // Calculate the total amount for the selected plan and subscription years
    const yearlyAmount = amountPerMonth * 12 * subscriptionYearInt;

    // Calculate GST amount
    const gstAmount = yearlyAmount * (gstPercentage / 100);

    // Calculate the final amount including GST
    const finalAmount = yearlyAmount + gstAmount;

    // Return all calculated amounts
    return {
      finalAmount: finalAmount * 100, // converting to paisa
      amountPerMonth,
      yearlyAmount,
      gstAmount,
    };
  };
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const b = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const c = ['', 'Hundred', 'Thousand', 'Lakh', 'Crore'];
  // Function to convert numbers to words
  function convertNumberToWords(num) {
    const numberToWords = (n) => {
      if (n === 0) return 'Zero';
      if (n < 10) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + numberToWords(n % 100) : '');
      if (n < 100000) {
        const thousands = Math.floor(n / 1000);
        const rest = n % 1000;
        return numberToWords(thousands) + ' Thousand' + (rest !== 0 ? ' ' + numberToWords(rest) : '');
      }
      if (n < 10000000) {
        const lakhs = Math.floor(n / 100000);
        const rest = n % 100000;
        return numberToWords(lakhs) + ' Lakh' + (rest !== 0 ? ' ' + numberToWords(rest) : '');
      }
      // Extend this function for larger numbers as needed (e.g., Crores)

      return n; // Fallback in case of any issues
    };

    return numberToWords(num);
  }

  const calculateSavings = (selectedCard, subscriptionYear) => {
    let originalAmountPerMonth;

    // Set the original price per month based on the selected plan
    if (selectedCard === 0) {
      originalAmountPerMonth = 99; // Demo / Free original price
    } else if (selectedCard === 1) {
      originalAmountPerMonth = 499; // Basic original price
    } else if (selectedCard === 2) {
      originalAmountPerMonth = 699; // Premium original price
    } else if (selectedCard === 3) {
      originalAmountPerMonth = 999; // Business original price
    }

    const subscriptionYearInt = Number(subscriptionYear) || 0;

    // Calculate the original yearly amount based on the original price
    const originalYearlyAmount =
      originalAmountPerMonth * 12 * subscriptionYearInt;

    // Calculate the discounted price based on the selected card
    const { amountPerMonth } = calculateAmount();

    // Calculate the savings
    const savings =
      originalYearlyAmount - amountPerMonth * 12 * subscriptionYearInt;

    return {
      savings,
      originalYearlyAmount,
    };
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      // Now you can use window.Razorpay
    };
    document.body.appendChild(script);
  }, []);
  useEffect(() => {
    const { finalAmount, amountPerMonth, gstAmount, yearlyAmount } =
      calculateAmount();
    const { savings, originalYearlyAmount } = calculateSavings(
      selectedCard,
      subscriptionYear
    );

    setAmount(finalAmount / 100); // Update amount (converted to INR)
    setAmountPerMonth(amountPerMonth);
    setYearlyAmount(yearlyAmount);
    setSavings(savings); // Set the savings
    setOriginalYearlyAmount(originalYearlyAmount); // Set the original yearly amount
    setGstAmount(gstAmount);
  }, [selectedCard, subscriptionYear]);

  const handlePayment = () => {
    const { finalAmount } = calculateAmount();
    const options = {
      // key: "rzp_live_x3jjvYlvtgh6Ke",
      // key_secret: "FAQE2PwPBrTkB0xC2pzPM3I", // Replace with your Razorpay key
      key: "rzp_test_vv1FCZvuDRF6lQ",
      key_secret: "P4JAUwn4VdE6xDLJ6p2Zy8RQ", // Replace with your Razorpay key
      amount: finalAmount, // Amount in paisa (10000 paisa = INR 100)
      currency: "INR",
      name: "PJSOFTTECH PTV. LTD",
      description: "Plan Subscription",
      handler: function (response) {
        // After successful payment
      //  alert(response.razorpay_payment_id);
      //  const paymentId = response.razorpay_payment_id;
        setPaymentDetails({
          instituteName: formData.institutename,
          amount: finalAmount / 100,
          date: new Date().toLocaleDateString(),
        });
        setShowReceipt(true); // Show receipt
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
  const plans = ["Demo / Free", "Basic", "Premium", "Business"];
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      emailaddress: formData.emailaddress,
      password: formData.password,
      confirmpassword: formData.confirmpassword,
      phonenumber: formData.phonenumber,
      institutename: formData.institutename,
      mobilenumber: formData.mobilenumber,
      websitename: formData.websitename,
      address: formData.address,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      district: formData.district,
      aadhar: formData.aadhar,
      pancard: formData.pancard,
      country: formData.country,
      employeemanagementsystem: formData.employeemanagementsystem,
      studentmanagementsystem: formData.studentmanagementsystem,
      feesmanagementsystem: formData.feesmanagementsystem,
      incomeandexpense: formData.incomeandexpense,
      enquirymanagementsystem: formData.enquirymanagementsystem,
      admissionmanagementsystem: formData.admissionmanagementsystem,
      gstNo: formData.gstNo,
      pincode: formData.pincode,
      incomeandexpense: formData.incomeandexpense,
      plan: plans[selectedCard],
      subscriptionyear: subscriptionYear,
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/saveinstitude",
        dataToSubmit
      );
      setIsSaveSuccessful(true);
      console.log(response.data); // handle response
    } catch (error) {
      console.error(error); // handle error
    }
  };
  const state = Object.keys(indianStatesAndDistricts);
  const district = formData.state
    ? indianStatesAndDistricts[formData.state]
    : [];

  const handleImageUpload = async () => {
    const email = localStorage.getItem("email");

    if (email && imageUpload) {
      const formDataImage = new FormData();
      formDataImage.append("instituteimage", imageUpload);

      try {
        const response = await axios.post(
          `http://localhost:8081/uploadimage/${email}`,
          formDataImage,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Alert the user about image upload success
        alert("Image Uploaded Successfully");
        console.log("Image uploaded successfully:", response.data);
        // Clear the image upload state
        setImageUpload(null);
      } catch (error) {
        console.error("Error uploading image:", error);
        alert(
          "Error uploading image: " + (error.response?.data || error.message)
        );
      }
    } else {
      alert("Email or file not found!");
    }
  };

  const handleClickOpen = (policy) => {
    setSelectedPolicy(policy);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleGetInstituteCode = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/findInstitutesby/email?emailaddress=${formData.emailaddress}`
      );

      if (response.data && response.data.institutecode) {
        setInstituteCode(response.data.institutecode);
        setIsPopupOpen(true);
      } else {
        console.error("No institute code found for the provided email.");
      }
    } catch (error) {
      console.error("API call failed", error);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(institutecode);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    navigate("/systems");
  };

  const ImageUploadButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }));
  const renderFeatureIcon = (isAvailable) => {
    return isAvailable ? (
      <CheckIcon color="success" />
    ) : (
      <CloseIcon color="error" />
    );
  };

  const featureList = {
    0: {
      crm: true,
      employeeManagement: true,
      subAdmin: false,
      multipleBranches: false,
      unlimitedEntries: false,
      support: true,
    },
    1: {
      crm: true,
      employeeManagement: true,
      subAdmin: false,
      multipleBranches: false,
      unlimitedEntries: false,
      support: true,
    },
    2: {
      crm: true,
      employeeManagement: true,
      subAdmin: true,
      multipleBranches: true,
      unlimitedEntries: false,
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

  // const renderFeatureIcon = (isAvailable) => {
  //   return isAvailable ? "✔" : "✘";
  // };

  const downloadReceipt = () => {
    const receiptElement = document.getElementById('receipt'); // Reference to receipt element
    const opt = {
      margin: 0.5,
      filename: 'receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(receiptElement).set(opt).save();
  };
  return (
    <>
<AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundImage: "#00649F",
      }}
    >
      <Toolbar>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item display="flex" alignItems="center">
            <img
              src={logo}
              alt="Logo"
              style={{ marginRight: "8px", height: "30px" }}
            />
            <Typography
              variant="h5"
              color="white"
              textAlign="center"
              fontWeight="bold"
            >
              PJSOFTTECH
            </Typography>
          </Grid>
        </Grid>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => navigate("/")} // Navigating to "/" on click
          sx={{ position: 'absolute', right: 16 }} // Position the icon on the right
        >
          <LoginIcon />
        </IconButton>
      </Toolbar>
    </AppBar>

      <div
        style={{ marginRight: "50px", marginLeft: "50px", marginTop: "80px" }}
      >
        {/* Grid to align image and text on the same line */}
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Text */}
          <Grid item>
            <Typography
              variant="h4"
              align="left"
              color="purple"
              fontWeight="19px"
            >
              You’re almost there! Complete your order
            </Typography>
          </Grid>

          {/* Money-back guarantee text */}
          <Grid item>
            <Typography variant="h6" align="right" color="purple">
              <img
                src="https://cart.hostinger.com/assets/MoneyBackGuarantee.svg"
                alt="30-day money-back guarantee"
                style={{ maxWidth: "40px" }}
              />{" "}
              30-day money-back guarantee
            </Typography>
          </Grid>
        </Grid>
      </div>

      <div
        style={{ marginLeft: "50px", marginRight: "50px", marginTop: "20px" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} lg={4}>
            <Typography
              variant="h4"
              style={{ marginBottom: "2px" }}
              color="purple"
              textAlign="center"
            >
              Select Plan
            </Typography>
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
                              ? 699
                              : index === 2
                              ? 899
                              : 1299}
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
                            ? 1399
                            : index === 2
                            ? 1799
                            : 2599}
                        </Typography>

                        <div style={{ textAlign: "left", fontSize: "14px" }}>
                          {/* Feature List */}
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
                            <span>24/7 Support</span>
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

            {/* Add the TextField below the cards */}
            <Grid item xs={12} marginTop={2}>
              <FormControl fullWidth>
                <TextField
                  select
                  label="Subscription Years"
                  name="subscriptionyear"
                  value={subscriptionYear} // Corrected to use the state variable
                  onChange={handleSubscriptionYearChange}
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
          </Grid>

          {/* Right side: Form (60% width) */}
          <Grid item xs={12} md={7} lg={8} className="textField-root">
            <Typography
              variant="h4"
              textAlign="center"
              //style={{ marginTop: "10px" }}
              color="purple"
            >
              Create your account
            </Typography>
            <Paper elevation={3} style={{ padding: "30px", marginTop: "20px" }}>
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
                        label="Pan No."
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
                    elevation={3}
                    style={{
                      padding: "16px",
                      marginTop: "10px",
                      background:
                        "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)", // Use gradient background
                      // Use textAlign for center alignment
                    }}
                  >
                    <Grid container justifyContent="space-between">
                      {/* Checkboxes for Management Systems */}
                      <Grid item xs={12}>
                        <Grid
                          container
                          spacing={1}
                          justifyContent="space-between"
                         
                        >
                          {" "}
                          <Grid item xs={5}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.studentmanagementsystem}
                                  onChange={handleChange}
                                  name="studentmanagementsystem"
                                  color="primary"
                                />
                              }
                              label="Student System(School & College)"
                              style={{ whiteSpace: "nowrap" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
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
                                  checked={formData.incomeandexpense}
                                  onChange={handleChange}
                                  name="incomeandexpense"
                                  color="primary"
                                />
                              }
                              label="Income & Expense System"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Income and Expense, Enquiry, Admission */}
                      <Grid item xs={12}>
                        <Grid
                          container
                          spacing={2}
                          justifyContent="space-evenly"
                          marginLeft="3%"
                        >
                          {" "}
                          <Grid item xs={6}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.admissionmanagementsystem}
                                  onChange={handleChange}
                                  name="admissionmanagementsystem"
                                  color="primary"
                                />
                              }
                              label="Admission System(Classroom & Institute)"
                            />
                          </Grid>
                          <Grid item xs={3}>
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
                          <Grid item xs={3}>
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
                          fontWeight: "bold",
                          justifyContent: "space-between",
                        }}
                      >
                        <strong>Plan Value</strong>
                        <span>₹ {amountPerMonth || 0}/ Month</span>
                      </Typography>

                      <Typography
                        variant="body1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          marginTop: "5px",
                        }}
                      >
                        <strong>Total Subscription Years</strong>
                        <span>{subscriptionYear || 0} Years</span>
                      </Typography>

                      <Typography
                        variant="body1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          marginTop: "5px",
                        }}
                      >
                        <strong>Total Amount (Excluding GST)</strong>
                        <span>₹ {yearlyAmount.toFixed(2)}</span>
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
                        <strong>Total Savings</strong>
                        <span>₹ {savings.toFixed(2)}</span>{" "}
                        {/* Display savings */}
                      </Typography>

                      <Typography
                        variant="body1"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: "bold",
                          marginTop: "5px",
                        }}
                      >
                        <strong>Tax & Fees ({gstPercentage}%)</strong>
                        <span>₹ {gstAmount.toFixed(2)}</span>
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
                        <strong>Grand Total (Including GST)</strong>
                        <span>₹ {amount.toFixed(2)}</span>
                      </Typography>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      justifyContent="space-around"
                      sx={{ marginTop: "24px" }}
                    >
                      <Grid item>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={
                            <Typography
                              variant="body1"
                              align="center"
                              onClick={() =>
                                handleClickOpen(policies.privacyPolicy)
                              }
                              sx={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Privacy Policy
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={
                            <Typography
                              variant="body1"
                              align="center"
                              onClick={() =>
                                handleClickOpen(policies.termsConditions)
                              }
                              sx={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Terms & Conditions
                            </Typography>
                          }
                        />
                      </Grid>
                      <Grid item>
                        <FormControlLabel
                          control={<Checkbox />}
                          label={
                            <Typography
                              variant="body1"
                              align="center"
                              onClick={() =>
                                handleClickOpen(policies.dataProductPolicy)
                              }
                              sx={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Data & Product Policy
                            </Typography>
                          }
                        />
                      </Grid>
                    </Grid>
                    {/* Dialog for Policy Information */}
                    {selectedPolicy && (
                      <PolicyPopup
                        open={open}
                        onClose={handleClose}
                        policy={selectedPolicy}
                      />
                    )}
                    {/* Payment Button */}
                    <Grid
                      container
                      spacing={2}
                      marginLeft="10px"
                      marginTop="10px"
                    >
                      <Grid item xs={12} sm={4}>
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

                      <Grid item xs={12} sm={4}>
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
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    mt={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    {/* Upload Image Button */}
                    <Grid
                      item
                      xs={12}
                      mt={2}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      {/* Upload Image Button */}
                      <ImageUploadButton
                        variant="contained"
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                        disabled={!paymentSuccessful}
                        sx={{ backgroundColor: "#003366", color: "gold" }}
                      >
                        Upload Image / Logo
                      </ImageUploadButton>

                      {/* Hidden Input for File Upload */}
                      <input
                        type="file"
                        id="image-upload"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          setImageUpload(e.target.files[0]);
                        }}
                      />

                      {/* Conditionally Render Confirm Button if Image is Selected */}
                      {imageUpload && (
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleImageUpload} // function to confirm upload
                        >
                          Confirm Image Upload
                        </Button>
                      )}
                      {isSaveSuccessful && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleGetInstituteCode}
                        >
                          Get Your Institute Code
                        </Button>
                      )}
                    </Grid>
                  </Grid>

                  {/* <Grid item xs={12}>
                    {imageUpload && (
                      <Button
                        variant="contained"
                        onClick={handleImageUpload}
                        mt={2}
                      >
                        Confirm Image Upload
                      </Button>
                    )}
                  </Grid> */}

                  <Modal
                    open={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                  >
                    <Box
                      sx={{
                        padding: 4,
                        backgroundColor: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6">Payment Successful!</Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setIsPopupOpen(false)}
                      >
                        Close
                      </Button>
                    </Box>
                  </Modal>

                  <Modal open={isPopupOpen} onClose={handleClosePopup}>
                    <Box
                      sx={{
                        padding: 4,
                        backgroundColor: "white",
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6">
                        Institute Code: {institutecode}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "red", marginTop: 1 }}
                      >
                        Write Down Institute Code, do not forget, cannot recover
                      </Typography>
                      <Button variant="outlined" onClick={handleCopy}>
                        Copy
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClosePopup}
                      >
                        Close
                      </Button>
                    </Box>
                  </Modal>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        maxWidth="md"
        fullWidth
      >
        {/* <DialogContent sx={{ p: 2 }}>
          {formData ? (
            <Box id="receipt">
              <DialogTitle
                align="center"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ width: "50px", marginRight: "10px" }}
                  />
                  <Typography variant="h4" >PJSOFTTECH PVT LTD.</Typography>
                </div>
                
              </DialogTitle>
              <Typography variant="h5" align="center">Billing Receipt</Typography>

              <Typography
                variant="body2"
                align="left"
                sx={{ mb: 0.5, ml: 1 }}
                mt={3}
              >
                <strong>Bill To:</strong>
                <br /> {formData.institutename}
                <br />
              </Typography>

              <Typography variant="body2" align="left" sx={{ mb: 1, ml: 1 }}>
                <strong>Address:</strong>
                <br />
                {formData.address}, {formData.city},{" "}
                {formData.state}, {formData.country},{" "}<br />
                {formData.pincode},
                <br />
                {formData.emailaddress},<br />{" "}
                {formData.mobilenumber}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box flex="1" ml={1}>
                 
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    <strong>Plan:</strong> {plans[selectedCard]} Plan
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    <strong>Contact:</strong> {formData.mobilenumber}
                  </Typography>
                  
                </Box>
                <Box flex="1" mr={1}>
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    <strong>GST No:</strong> {formData.gstNo}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    <strong>Subscription Year:</strong>{" "}
                    {subscriptionYear} Years
                  </Typography>
                 
                </Box>
              </Box>

              <Typography variant="h6" align="center" gutterBottom>
                Payment Details
              </Typography>

              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  p: 1,
                  mb: 1,
                }}
              >
                <Table>
                  <TableBody>
                    {[
                      { label: "Plan Name", value: `${plans[selectedCard]} Plan`  },
                      {
                        label: "Plan Value",
                        value: `${amountPerMonth}/Month`,
                      },
                      {
                        label: "Plan Valid For",
                        value: `${subscriptionYear} Years`,
                      },
                      
                      {
                        label: "Amount",
                        value: `₹ ${yearlyAmount}`,
                      },
                      
                      {
                        label: "GST Percentage",
                        value: `${gstPercentage}%`,
                      },
                      {
                        label: "GST Amount",
                        value: `₹ ${gstAmount} `,
                      },
                      {
                        label: <strong>Total Amount</strong>,
                        value: (
                          <strong>
                            ₹ {amount}
                          </strong>
                        ),
                      },
                      // {
                      //   label: "GST Amount",
                      //   value: {paymentId},
                      // },
                    ].map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell>{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>

              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                <strong>Total Amount in Words:</strong>{" "}
                {convertNumberToWords(amount)} Only
              </Typography>

              <Box mt={2} display="flex" justifyContent="space-between" mb={2}>
                <Box textAlign="center">
                  <Typography variant="body2">Authorized Signature</Typography>
                  <Box mt={4} borderBottom="1px solid #000" width="150px" />
                </Box>
                <Box textAlign="center">
                  <Typography variant="body2">Client Signature</Typography>
                  <Box mt={4} borderBottom="1px solid #000" width="150px" />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                203, 2nd floor, Mangalmurti Complex, behind ABIL Tower hirabaugh
                chowk, Tilak Road
                <br />
              </Typography>
              <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                Website: http://www.pjsofttech.com | Phone: +919923570901
              </Typography>
              <Typography variant="body2" align="center">
                Email: sales@pjsofttech.com
              </Typography>

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="primary"
                onClick={downloadReceipt}
              >
                Download Receipt
              </Button>
            </Box>
          ) : (
            <Typography variant="body2" color="red" align="center">
              Receipt data is not available.
            </Typography>
          )}
        </DialogContent> */}
        <DialogContent sx={{ p: 2 }}>
          {formData ? (
            <Box id="receipt">
              {/* Header Section */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="h6" align="left">
                  <Typography
                    variant="h6"
                    align="left"
                    sx={{ fontSize: "30px", color: "purple" }}
                  >
                    <strong>{formData.institutename}</strong>
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5, // Reduced margin-bottom for less space between the two addresses
                    }}
                  >
                    <Box>
                      <Typography variant="body2">
                        {formData.address}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 0, // Reduced margin-top to bring the addresses closer
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Mobile : </strong>
                      {formData.phonenumber}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 0, // Reduced margin-top to bring the addresses closer
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Email : </strong>
                      {formData.emailaddress}
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  borderTop: "8px solid purple", // Thick top border
                  padding: "10px", // Padding for spacing
                  display: "flex", // To align the content in a row with space between
                  justifyContent: "space-between", // Evenly space the items
                  gap: "20px", // Gap between the data elements for spacing
                  backgroundColor: "#f3e5f5", // Light purple background
                }}
              >
                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Invoice No:
                  </Typography>{" "}
                  {formData.invoiceNo}
                </Typography>
                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Invoice Date:
                  </Typography>{" "}
                  {formData.createdAt}
                </Typography>
                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Due Date:
                  </Typography>{" "}
                  {formData.subscriptendDate}
                </Typography>
              </Typography>

              <Box mt={1}>
                <strong>Bill To:</strong>
                <br />
                <strong>PJSofttech pvt, ltd.,</strong>
              </Box>

              {/* Items Table */}

              <Table sx={{ marginTop: "10px" }}>
  <TableHead>
    <TableRow
      sx={{
        borderTop: "3px solid purple", // Thick top border
        borderBottom: "3px solid purple",
      }}
    >
      <TableCell>
        <strong>PLAN</strong>
      </TableCell>
      <TableCell>
        <strong>Validity</strong>
      </TableCell>
      <TableCell>
        <strong>Plan Value</strong>
      </TableCell>
      <TableCell>
        <strong>AMOUNT</strong>
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>{plans[selectedCard]} plan</TableCell>
      <TableCell>{subscriptionYear} Year</TableCell>
      <TableCell>₹ {amountPerMonth}/Month</TableCell>
      <TableCell>₹ {yearlyAmount}</TableCell>
    </TableRow><br/><br/>

    {/* Subtotal Row */}
    {/* <TableRow
      sx={{
        borderTop: "3px solid purple", // Thick top border
        borderBottom: "3px solid purple",
      }}
    >
      <TableCell colSpan={3} sx={{ textAlign: "left" }}>
        <strong>Subtotal:</strong>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <strong>{formData.amount}</strong>
        </Box>
      </TableCell>
    </TableRow> */}

    {/* GST Percentage and Amount Row */}
    <TableRow sx={{
        borderTop: "3px solid purple", // Thick top border
        borderBottom: "3px solid purple",
      }} >
      <TableCell colSpan={3} sx={{ textAlign: "left" }}>
        <strong>GST (18%):</strong>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <strong>
            ₹ {gstAmount} {/* Calculated GST */}
          </strong>
        </Box>
      </TableCell>
    </TableRow>

    {/* Total After GST Row */}
    <TableRow
      sx={{
        borderTop: "3px solid purple", // Thick top border
        borderBottom: "3px solid purple",
      }}
    >
      <TableCell colSpan={3} sx={{ textAlign: "left" }}>
        <strong>Total Amount (including GST):</strong>
      </TableCell>
      <TableCell>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <strong>
            ₹ {amount}
            {/* Subtotal + GST */}
          </strong>
        </Box>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>

              {/* Parent Box to Hold Both Sections */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                {/* Left Box for Bank Details */}
                <Box>
                  {/* Payment Details  */}

                  <Box mt={3}>
                    <Typography fontWeight={"bold"}>PAYMENT PARTIES</Typography>

                    {/* Box for Image and Text */}
                    <Box
                      sx={{
                        display: "flex", // Align image and text horizontally
                        justifyContent: "space-between", // Maintain space between items
                        alignItems: "center", // Vertically align items
                        mb: 0.2,
                        gap: 3, // Add more space between image and text, increase the value for more space
                      }}
                    >
                      {/* UIP ID and Name */}
                      <Box>
                        {/* Row of payment images */}
                        <Box
                          sx={{
                            display: "flex", // Align images horizontally
                            gap: 1, // Space between the images
                            mt: 1, // Add margin-top for some space between text and images
                          }}
                        >
                          {/* PhonePe Image */}
                          <Box
                            component="img"
                            src={phonepe}
                            alt="PhonePe"
                            sx={{
                              width: 50, // Adjust the size as per your need
                              height: 30,
                            }}
                          />

                          {/* GPay Image */}
                          <Box
                            component="img"
                            src={gpay}
                            alt="GPay"
                            sx={{
                              width: 50, // Adjust the size as per your need
                              height: 30,
                            }}
                          />

                          {/* Paytm Image */}
                          <Box
                            component="img"
                            src={paytm}
                            alt="Paytm"
                            sx={{
                              width: 50, // Adjust the size as per your need
                              height: 30,
                            }}
                          />

                          {/* UPI Lite Image */}
                          <Box
                            component="img"
                            src={upilite}
                            alt="UPI Lite"
                            sx={{
                              width: 50, // Adjust the size as per your need
                              height: 30,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box mt={2}>
                    {/* Terms & Conditions Heading */}
                    <Typography fontWeight={"bold"}>
                      TERMS AND CONDITIONS
                    </Typography>

                    {/* First Term */}
                    <Typography variant="body2">
                      1. Payment must be made within 30 days of the invoice
                      date.
                    </Typography>

                    {/* Second Term */}
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      2. 25% Complete Work
                    </Typography>
                  </Box>
                </Box>

                {/* Right Box for Amount in Words */}
                <Box sx={{ mt: 3.5, mb: -1 , marginLeft:"20px"}}>
                  {" "}
                  {/* Reducing space from the top and bottom */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: "1px solid gray", // Add bottom border
                      mb: -1, // Reduce space from the bottom
                      gap:2,
                    }}
                  >
                    {/* Total Amount Label */}
                    <Typography variant="body2" fontWeight="bold">
                      Total Amount: ₹   {amount}
                    </Typography>

                    {/* Total Amount Value */}
                    <Typography variant="body2" fontWeight="bold">
                      {formData.amount}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt:2 }}>
                    {" "}
                    {/* Making text bold and adjusting space */}
                    <strong>
                      Total Amount (in words): <br />
                    </strong>
                    {convertNumberToWords(amount)} Only
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} mt={5}/>
                <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                  203, 2nd floor, Mangalmurti Complex, behind ABIL Tower
                  hirabaugh chowk, Tilak Road
                  <br />
                </Typography>
                <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                  Website: http://www.pjsofttech.com | Phone: +919923570901
                </Typography>
                <Typography variant="body2" align="center">
                  Email: sales@pjsofttech.com
                </Typography>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={downloadReceipt}>
            Download PDF
          </Button>
          <Button onClick={() => setOpenReceipt(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateAccount;
