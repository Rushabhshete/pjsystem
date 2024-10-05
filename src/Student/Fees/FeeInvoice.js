import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Grid,
  Typography,
  Container,
  Snackbar,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import axios from "axios";
import { useReactToPrint } from "react-to-print";





const Newform = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    standard: "",
    medium: "",
    division: "",
    tuitionFee: 0,
    admissionFee: 0,
    practicalFee: 0,
    computerClassFee: 0,
    examFees: 0,
    uniformFee: 0,
    transportBusFee: 0,
    hostelFee: 0,
    buildingFundFee: 0,
    libraryFees: 0,
    sportFees: 0,
    totalFeesAmount:0,
    feesAmount: "",
    discount: 0,
    discountedAmount: 0,
    gst: 0,
    GSTAmount: 0,
    netfeeamount: 0,
    lateFeeCharges: 0,
    pendingFeesAmount: 0,
    feesCollectionType: "",
    feesStatus: "",
    feesType: "",
    installments: [],
    transactionId: "",
    gstNo: "",
    showGstNo: false,
    registrationDate: "",
    receiptnumber: "",
    date: "",
    // motherName: "",
    // course: "MBA",
    // branch: "",
    modeOfPayment: "",
    AmountinWords: "",
    remark: "",
    userName: "",
  });

  

  const [standards, setStandards] = useState([]);
  const [standardData, setStandardData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [mediums, setMediums] = useState([]);
  const institutecode = () => localStorage.getItem("institutecode");


  useEffect(() => {
    fetchMediums();
  }, []);

  const fetchMediums = async () => {
    try {
      const response = await axios.get(`http://13.233.43.240:8083/getAllMediums?institutecode=${institutecode()}`);
      setMediums(response.data); // Assuming response.data is an array of mediums
    } catch (error) {
      console.error('Error fetching mediums:', error);
    }
  };



  const fetchStandardsByMediumAndStandard = async (medium, standard) => {
    try {
      const response = await axios.get(`http://13.233.43.240:8083/standards/bymedium/bystandard?medium=${medium}&standard=${standard}&institutecode=${institutecode()}`);
      return response.data; // Assuming the API returns an array of standards
    } catch (error) {
      console.error('Error fetching standards:', error);
      return []; // Return an empty array or handle error as per your application's requirement
    }
  };


  useEffect(() => {
    const fetchStandards = async () => {
      try {
        const response = await axios.get(
          `http://13.233.43.240:8083/getallStandered?institutecode=${institutecode()}`
        );
        setStandards(response.data);
      } catch (error) {
        console.error("Error fetching standards:", error);
      }
    };

    fetchStandards();
  }, []);

  const fetchStandardData = async (standard) => {
    try {
      const response = await axios.get(
        `http://13.233.43.240:8083/getstanderedByName/${standard}&institutecode=${institutecode()}`
      );
      setStandardData(response.data);
    } catch (error) {
      console.error("Error fetching standard data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
      
      // Calculate the total fees
      const totalFeesAmount =
        parseFloat(updatedData.tuitionFee) +
        parseFloat(updatedData.admissionFee) +
        parseFloat(updatedData.practicalFee) +
        parseFloat(updatedData.computerClassFee) +
        parseFloat(updatedData.examFees) +
        parseFloat(updatedData.uniformFee) +
        parseFloat(updatedData.transportBusFee) +
        parseFloat(updatedData.hostelFee) +
        parseFloat(updatedData.buildingFundFee) +
        parseFloat(updatedData.libraryFees) +
        parseFloat(updatedData.sportFees) +
        parseFloat(updatedData.lateFeeCharges);

      updatedData.totalFeesAmount = totalFeesAmount;

      // Calculate the discounted amount
      // const discountedAmount = totalFeesAmount - parseFloat(updatedData.discount);
      // updatedData.discountedAmount = discountedAmount;

      // Assuming updatedData.discount is the discount percentage
const discountPercentage = parseFloat(updatedData.discount);

// Calculate the discount amount
const discountAmount = (totalFeesAmount * discountPercentage) / 100;

// Subtract the discount amount from the total fees
const discountedAmount = totalFeesAmount - discountAmount;

// Update the discounted amount in the updatedData object
updatedData.discountedAmount = discountedAmount;

      // Calculate the GST amount
      const GSTAmount = (discountedAmount * parseFloat(updatedData.gst)) / 100;
      updatedData.GSTAmount = GSTAmount;

      // Calculate the net fee amount
      const netFeeAmount = discountedAmount + GSTAmount;
      updatedData.netfeeamount = netFeeAmount;

       // Calculate pending fees amount
    const pendingFeesAmount = netFeeAmount - parseFloat(updatedData.feesAmount);
    updatedData.pendingFeesAmount = pendingFeesAmount;


      return updatedData;
    });

    if (name === "standard") {
      fetchStandardData(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://13.233.43.240:8083/SaveFees?institutecode=${institutecode()}`,
        formData
      );
      setSnackbarMessage("Form submitted successfully");
      setSnackbarOpen(true);
      handlePrint();
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(standardData).length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        ...standardData,
      }));
    }
  }, [standardData]);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const [randomNumber, setRandomNumber] = useState(null);

  // Function to generate unique random number
  const generateRandomNumber = () => {
    const min = 1000;
    const max = 9999;
    const generatedNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return generatedNumber;
  };

  useEffect(() => {
    const randomNum = generateRandomNumber();
    setRandomNumber(randomNum); // Set the generated random number
  }, []);

  
  return (
    <Container  marginLeft="50px"   >
      <Paper marginBottom="50px">
        <Box p={2}  >
          
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" align="center" gutterBottom>
              Fees Invoice
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="  InvoiceNumber"
                  name="receiptnumber"
                  value={randomNumber || ""}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              {/* 
        <Grid item xs={8} sm={3}>
              <TextField
                fullWidth
                label="Receiptnumber"
                name="receiptnumber"
                value={randomNumber || ''}
            variant="outlined"
               InputProps={{
             readOnly: true,
              }}
              />
            </Grid>

 */}      


 {/* Conditional Rendering for Standard Selection */}
 {formData.medium && (  // Render only if formData.medium is truthy
        <Grid item xs={8} sm={3}>
          <TextField
            fullWidth
            select
            label="Standard"
            name="standard"
            value={formData.standard || ""}
            onChange={handleChange}
            variant="outlined"
            required
          >
            {standards.map((standardItem) => (
              <MenuItem
                key={standardItem.id}
                value={standardItem.standard}
              >
                {standardItem.standard}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      )}
            
              {/* <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="Standard"
                  name="standard"
                  value={formData.standard || ""}
                  onChange={handleChange}
                  variant="outlined"
                  required
                >
                  {standards.map((standardItem) => (
                    <MenuItem
                      key={standardItem.id}
                      value={standardItem.standard}
                    >
                      {standardItem.standard}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> */}
             


             {/* Medium Selection */}
      <Grid item xs={8} sm={3}>
        <TextField
          fullWidth
          select
          label="Medium"
          name="medium"
          value={formData.medium}
          onChange={handleChange}
          variant="outlined"
          required
        >
          {mediums.map((medium) => (
            <MenuItem key={medium.mediumID} value={medium.mediumName}>
              {medium.mediumName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="Division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  variant="outlined"
                >
                  {["A", "B", "C", "D", "E"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Student Name"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Roll No"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={3}>
                  <Box p={2} mt={2} mb={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Tuition Fee"
                          type="number"
                          name="tuitionFee"
                          value={formData.tuitionFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Admission Fee"
                          type="number"
                          name="admissionFee"
                          value={formData.admissionFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Practical Fee"
                          type="number"
                          name="practicalFee"
                          value={formData.practicalFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Computer Class Fee"
                          type="number"
                          name="computerClassFee"
                          value={formData.computerClassFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Exam Fees"
                          type="number"
                          name="examFees"
                          value={formData.examFees}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Uniform Fee"
                          type="number"
                          name="uniformFee"
                          value={formData.uniformFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Transport Bus Fee"
                          type="number"
                          name="transportBusFee"
                          value={formData.transportBusFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Hostel Fee"
                          type="number"
                          name="hostelFee"
                          value={formData.hostelFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Building Fund Fee"
                          type="number"
                          name="buildingFundFee"
                          value={formData.buildingFundFee}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                        <TextField
                          fullWidth
                          label="Library Fee"
                          type="number"
                          name="libraryFees"
                          value={formData.libraryFees}
                          onChange={handleChange}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Sports Fee"
                  type="number"
                  name="sportFees"
                  value={formData.sportFees}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Late Fee Charges"
                  type="number"
                  name="lateFeeCharges"
                  value={formData.lateFeeCharges}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Total Fees Amount"
                  type="number"
                  name="totalFeesAmount"
                  value={formData.totalFeesAmount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  name="discount"
                   value={formData.discount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="DiscountedAmount"
                  type="number"
                  name="discountedAmount"
                  value={formData.discountedAmount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>


              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="GST"
                  type="number"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>


              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="GSTAmount"
                  type="number"
                  name="GSTAmount"
                  value={formData.GSTAmount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Netfeeamount"
                  type="number"
                  name="netfeeamount"
                  value={formData.netfeeamount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="PaidAmount"
                  type="number"
                  name="feesAmount"
                  value={formData.feesAmount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>


              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Pending Fees Amount"
                  type="number"
                  name="pendingFeesAmount"
                  value={formData.pendingFeesAmount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>


                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              
            
              
              {/* <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Discount"
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid> */}
              {/* <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="GST"
                  type="number"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid> */}
             
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  select
                  label="Fees Status"
                  name="feesStatus"
                  value={formData.feesStatus}
                  onChange={handleChange}
                  variant="outlined"
                  required
                >
                  {["Complete", "Incomplete"].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>



              <Grid item xs={8} sm={3}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="fees-collection-type-label">
                    Fees Collection Type
                  </InputLabel>
                  <Select
                    labelId="fees-collection-type-label"
                    id="fees-collection-type"
                    label="Fees Collection Type"
                    name="feesCollectionType"
                    value={formData.feesCollectionType}
                    onChange={handleChange}
                  >
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="online">Online</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Late Fee Charges"
                  type="number"
                  name="lateFeeCharges"
                  value={formData.lateFeeCharges}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid> */}

              {/* <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Pending Fees Amount"
                  type="number"
                  name="pendingFeesAmount"
                  value={formData.pendingFeesAmount}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid> */}
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Transaction ID/CheckNo"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={8} sm={3}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={8} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="showGstNo"
                      checked={formData.showGstNo}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Show GST No."
                />
              </Grid>



              
              {formData.showGstNo && (
                <Grid item xs={8} sm={3}>
                  <TextField
                    fullWidth
                    label="GST No."
                    name="gstNo"
                    value={formData.gstNo}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
              )}
            </Grid>
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                halfWidth
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
      <div style={{ display: "none" }}>
        <ComponentToPrint
          ref={componentRef}
          formData={formData}
          receiptNumber={randomNumber}
        />
      </div>
    </Container>
  );
};


// Utility function to convert number to words
const numberToWords = (num) => {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const scales = ['', 'Thousand', 'Million', 'Billion'];

  if (num === 0) return 'Zero';

  let words = '';

  for (let i = 0; i < scales.length; i++) {
    let tempNumber = num % (100 * Math.pow(1000, i));
    if (Math.floor(tempNumber / Math.pow(1000, i)) !== 0) {
      if (Math.floor(tempNumber / Math.pow(1000, i)) < 20) {
        words = ones[Math.floor(tempNumber / Math.pow(1000, i))] + ' ' + scales[i] + ' ' + words;
      } else {
        words = tens[Math.floor(tempNumber / (10 * Math.pow(1000, i)))] + '-' + ones[Math.floor(tempNumber / Math.pow(1000, i)) % 10] + ' ' + scales[i] + ' ' + words;
      }
    }

    tempNumber = num % Math.pow(1000, i + 1);
    if (Math.floor(tempNumber / (100 * Math.pow(1000, i))) !== 0) {
      words = ones[Math.floor(tempNumber / (100 * Math.pow(1000, i)))] + ' Hundred ' + words;
    }
  }

  return words.trim();
};

const ComponentToPrint = React.forwardRef(
  ({ formData, receiptNumber }, ref) => (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial, sans-serif", border: "1px solid black", maxWidth: "1200px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ textAlign: "center" }}>
          <Typography variant="h6">Office Copy</Typography>
        </div>
        <div style={{ textAlign: "center" }}>
          <Typography variant="h6">Original</Typography>
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <Typography variant="h5" style={{ fontWeight: "bold" }}>
          PjSoftech Pvt Ltd
        </Typography>
        <Typography variant="body1">
          2th Floor, Mangalmurti Complex Swargate
        </Typography>
        <Typography variant="body1">
          Phone No: 020-00000000 Website: www.pjsofttech.com
        </Typography>
        <Typography
          variant="h6"
          style={{ fontWeight: "bold", marginTop: "10px" }}
        >
          FEE RECEIPT
        </Typography>
      </div>

      <Table size="small" style={{ marginBottom: "20px", border: "1px solid black", borderCollapse: "collapse" }}>
        <TableBody>
          <TableRow>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Invoice Number
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{receiptNumber}</TableCell>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Date
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{formData.registrationDate}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Standard
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{formData.standard}</TableCell>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Roll No
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{formData.rollNo}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Medium
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{formData.medium}</TableCell>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Student Name
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{formData.studentName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Division
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{formData.division}</TableCell>
            <TableCell style={{ border: "1px solid black" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                Transaction ID/Cheque No
              </Typography>
            </TableCell>
            <TableCell style={{ border: "1px solid black" }}>{formData.transactionId}</TableCell>
            
          </TableRow>
        </TableBody>
      </Table>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Table size="small" style={{ border: "1px solid black", borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Sr. No.
                  </Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Fees
                  </Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Amount
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { label: "Tuition Fee", value: formData.tuitionFee },
                { label: "Admission Fee", value: formData.admissionFee },
                { label: "Practical Fee", value: formData.practicalFee },
                {
                  label: "Computer Class Fee",
                  value: formData.computerClassFee,
                },
                { label: "Exam Fees", value: formData.examFees },
                { label: "Uniform Fee", value: formData.uniformFee },
                { label: "Transport Bus Fee", value: formData.transportBusFee },
                { label: "Hostel Fee", value: formData.hostelFee },
                { label: "Building Fund Fee", value: formData.buildingFundFee },
                { label: "Library Fee", value: formData.libraryFees },
                { label: "Sports Fee", value: formData.sportFees },
              ].map((fee, index) => (
                <TableRow key={index}>
                  <TableCell style={{ border: "1px solid black" }}>{index + 1}</TableCell>
                  <TableCell style={{ border: "1px solid black" }}>{fee.label}</TableCell>
                  <TableCell style={{ border: "1px solid black" }}>{fee.value}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}></TableCell>
                <TableCell style={{ border: "1px solid black" }}>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Total Fees Amount
                  </Typography>
                </TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.totalFeesAmount}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
       
        <Grid item xs={6}>
          <Table size="small" style={{ border: "1px solid black", borderCollapse: "collapse" }}>
            <TableBody>
            <br/>
      
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Discount</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.discount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Discounted Amount</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.discountedAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>GST</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.gst}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>GST Amount</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.GSTAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Net Fee Amount</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.netfeeamount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Late Fee Charges</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.lateFeeCharges}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Fees Amount</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.feesAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Pending Fees Amount</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.pendingFeesAmount}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Fees Status</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.feesStatus}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ border: "1px solid black" }}>Mode Of Payment:</TableCell>
                <TableCell style={{ border: "1px solid black" }}>{formData.feesCollectionType}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: "15px" }}>
        {/* <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Fees Status:</strong> {formData.feesStatus}
          </Typography>
        </Grid> */}
 <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Amount in Words:</strong> {numberToWords(formData.totalFeesAmount)}
          </Typography>
        </Grid>

 
{/* <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Mode Of Payment:</strong> {formData.modeOfPayment}
          </Typography>
        </Grid> */}
         <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>GST No:</strong> {formData.gstNo || "N/A"}
          </Typography>
        </Grid>
         
       
        {/* <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Remark:</strong> {formData.remark || "N/A"}
          </Typography>
        </Grid> */}
        {/* <Grid item xs={10} sm={6}>
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            Name Of Student: {formData.userName}
          </Typography>
        </Grid> */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" style={{ marginTop: "20px", textAlign: "center" }}>
            <strong>Student Signature</strong>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" style={{ marginTop: "20px", textAlign: "center" }}>
            <strong>Authorized Signature</strong>
          </Typography>
        </Grid>
      </Grid>
    </div>
   
  )
);


export default Newform;
