// import React, { useEffect, useState } from 'react';
// import { Table, TableBody,
//     TableCell, TableContainer, TableHead,
//     TableRow, Paper, Typography , Button,Dialog, DialogActions, DialogContent, DialogTitle
//     ,Container, Divider, Box,
// MenuItem, FormControl, InputLabel, Select } from '@mui/material';
// import html2pdf from "html2pdf.js"; // Importing html2pdf.js
// import logo from "../../src/Income Expense/logo.jpg";
// import qr from "../../src/img/qr.webp";

// export default function Bill() {

//     const a = [
//         "",
//         "One",
//         "Two",
//         "Three",
//         "Four",
//         "Five",
//         "Six",
//         "Seven",
//         "Eight",
//         "Nine",
//       ];
//       const b = [
//         "",
//         "Ten",
//         "Twenty",
//         "Thirty",
//         "Forty",
//         "Fifty",
//         "Sixty",
//         "Seventy",
//         "Eighty",
//         "Ninety",
//       ];
//       const c = ["", "Hundred", "Thousand", "Lakh", "Crore"];
//   const [instituteData, setInstituteData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedInstitute, setSelectedInstitute] = useState(null);
//   const [openReceipt, setOpenReceipt] = useState(false);

//   const downloadReceipt = () => {
//     const receiptElement = document.getElementById("receipt"); // Reference to receipt element
//     const opt = {
//       margin: 0.5,
//       filename: "receipt.pdf",
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2 },
//       jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//     };

//     html2pdf().from(receiptElement).set(opt).save();
//   };

//    // Function to convert numbers to words
//    function convertNumberToWords(num) {
//     const numberToWords = (n) => {
//       if (n === 0) return "Zero";
//       if (n < 10) return a[n];
//       if (n < 100)
//         return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
//       if (n < 1000)
//         return (
//           a[Math.floor(n / 100)] +
//           " Hundred" +
//           (n % 100 !== 0 ? " " + numberToWords(n % 100) : "")
//         );
//       if (n < 100000) {
//         const thousands = Math.floor(n / 1000);
//         const rest = n % 1000;
//         return (
//           numberToWords(thousands) +
//           " Thousand" +
//           (rest !== 0 ? " " + numberToWords(rest) : "")
//         );
//       }
//       if (n < 10000000) {
//         const lakhs = Math.floor(n / 100000);
//         const rest = n % 100000;
//         return (
//           numberToWords(lakhs) +
//           " Lakh" +
//           (rest !== 0 ? " " + numberToWords(rest) : "")
//         );
//       }
//       // Extend this function for larger numbers as needed (e.g., Crores)

//       return n; // Fallback in case of any issues
//     };

//     return numberToWords(num);
//   }

//   useEffect(() => {
//     const fetchInstituteData = async () => {
//       const institutecode = localStorage.getItem('institutecode');
//       if (!institutecode) {
//         setError('Institute code not found in local storage');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`http://localhost:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`);

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }

//         const data = await response.json();
//         setInstituteData(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInstituteData();
//   }, []);

//   if (loading) return <Typography>Loading...</Typography>;
//   if (error) return <Typography color="error">{error}</Typography>;

//   const handleGenerate = (instituteData) => {
//     setSelectedInstitute(instituteData);
//     setOpenReceipt(true);
//   };

//   // Render table
//   return (
//     <Container>
//          <Typography
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
//         Billing Section
//       </Typography>

//         <TableContainer width="100%">
//       <Table>
//       <TableHead
//           style={{
//             backgroundColor: "#f2f2f2",
//             justifyContent: "center",
//           }}
//         >
//           <TableRow>
//             <TableCell sx={{fontWeight:'bold'}}>Subscription Start at</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Subscription End at</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Institute Code</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Institute Name</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Owner Name</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Institute Mobile No.</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Plan</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>GST No.</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Amount</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Transaction Id.</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Invoice No.</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Status</TableCell>
//             <TableCell sx={{fontWeight:'bold'}}>Bill</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {instituteData && (
//             <TableRow key={instituteData.id}>
//               <TableCell>{instituteData.subscriptstartDate}</TableCell>
//               <TableCell>{instituteData.subscriptendDate}</TableCell>
//               <TableCell>{instituteData.institutecode}</TableCell>
//               <TableCell>{instituteData.institutename}</TableCell>
//               <TableCell>{instituteData.ownerName}</TableCell>
//               <TableCell>{instituteData.mobilenumber}</TableCell>
//               <TableCell>{instituteData.plan}</TableCell>
//               <TableCell>{instituteData.gstNo}</TableCell>
//               <TableCell>{instituteData.amount}</TableCell>
//               <TableCell>{instituteData.transactionId}</TableCell>
//               <TableCell>{instituteData.invoiceNo}</TableCell>
//               <TableCell
//                     align="center"
//                     sx={{ color: "green", fontWeight: "bold" }}
//                   >
//                     Paid
//                   </TableCell>
//                   <TableCell align="center">
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => handleGenerate(instituteData)}
//                     >
//                       Generate
//                     </Button>
//                   </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </TableContainer>

//     <Dialog open={openReceipt} onClose={() => setOpenReceipt(false)} maxWidth="md" fullWidth>
//   <DialogContent sx={{ p: 2 }}>
//     {selectedInstitute ? (
//       <Box id="receipt">
//         {/* Header Section */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//           <Typography variant="h6" align="left">
//             <strong>ARTI Electrical And AC Service</strong>
//           </Typography>
//           <Typography variant="body2" align="right">
//             Invoice No: {selectedInstitute.invoiceNo}
//             <br />
//             Invoice Date: {selectedInstitute.invoiceDate}
//             <br />
//             Due Date: {selectedInstitute.dueDate}
//           </Typography>
//         </Box>
//         <Divider sx={{ my: 1 }} />

//         {/* Bill To Section */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//           <Box>
//             <Typography variant="body2">
//               <strong>Bill To:</strong>
//               <br />
//               {selectedInstitute.instituteName}
//               <br />
//               {selectedInstitute.address}
//             </Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 1 }} />

//         {/* Items Table */}
//         <Typography variant="body1" align="center" sx={{ mb: 1 }}>
//           Items
//         </Typography>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>ITEMS</strong></TableCell>
//               <TableCell><strong>QTY</strong></TableCell>
//               <TableCell><strong>RATE</strong></TableCell>
//               <TableCell><strong>AMOUNT</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {selectedInstitute.selectedInstitute.map((item, index) => (
//               <TableRow key={index}>
//                 <TableCell>{selectedInstitute.name}</TableCell>
//                 <TableCell>{selectedInstitute.plan}</TableCell>
//                 <TableCell>{selectedInstitute.rate}</TableCell>
//                 <TableCell>{selectedInstitute.amount}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         <Divider sx={{ my: 1 }} />

//         {/* Subtotal Section */}
//         <Box display="flex" justifyContent="space-between" mb={1}>
//           <Typography variant="body1"><strong>Subtotal:</strong></Typography>
//           <Typography variant="body1">{selectedInstitute.subtotal} Rs</Typography>
//         </Box>
//         <Box display="flex" justifyContent="space-between" mb={1}>
//           <Typography variant="body1"><strong>Total Amount:</strong></Typography>
//           <Typography variant="body1">{selectedInstitute.totalAmount} Rs</Typography>
//         </Box>
//         <Typography variant="body2" align="center" sx={{ mb: 2 }}>
//           <strong>Total Amount in Words:</strong> {convertNumberToWords(selectedInstitute.totalAmount)} Only
//         </Typography>

//         <Divider sx={{ my: 1 }} />

//         {/* Bank Details */}
//         <Typography variant="body1" sx={{ mb: 1 }}>
//           <strong>Bank Details:</strong>
//         </Typography>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Box>
//             <Typography variant="body2">Name: Rahul Dasharath Thorat</Typography>
//             <Typography variant="body2">IFSC Code: IPOS0000001</Typography>
//             <Typography variant="body2">Account No: 034210230401</Typography>
//             <Typography variant="body2">Bank: India Post Payments Bank</Typography>
//           </Box>
//           <Box>
//             <img src={qr} alt="QR Code" style={{ width: "100px" }} />
//             <Typography variant="body2">UPI ID: sarikalondhe68@okicici</Typography>
//           </Box>
//         </Box>

//         <Divider sx={{ my: 1 }} />

//         {/* Terms and Conditions */}
//         <Typography variant="body1" sx={{ mb: 1 }}>
//           <strong>Terms and Conditions:</strong>
//         </Typography>
//         <Typography variant="body2">1. 1.75% advanced agents po order</Typography>
//         <Typography variant="body2">2. 25% complete work</Typography>

//         <Divider sx={{ my: 1 }} />

//         {/* Footer Section */}
//         <Box sx={{ textAlign: 'center', mt: 3 }}>
//           <Typography variant="body2">
//             203, 2nd floor, Mangalmurti Complex, behind ABIL Tower, Hirabaugh Chowk, Tilak Road
//             <br />
//             Website: http://www.pjsofttech.com | Phone: +919923570901
//             <br />
//             Email: sales@pjsofttech.com
//           </Typography>
//         </Box>
//       </Box>
//     ) : (
//       <Typography variant="body2" color="error" align="center">
//         Receipt data is not available.
//       </Typography>
//     )}
//   </DialogContent>

//   <DialogActions>
//     <Button variant="contained" color="primary" onClick={downloadReceipt}>Download Receipt</Button>
//     <Button onClick={() => setOpenReceipt(false)} color="primary">Close</Button>
//   </DialogActions>
// </Dialog>

//   {/* bill section ends  */}
//     </Container>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Box,
  Divider,
  Container,
} from "@mui/material";
import html2pdf from "html2pdf.js"; // Importing html2pdf.js
import qr2 from "../../src/img/qr2.jpg";
import phonepe from "../../src/img/phonepe.png";
import gpay from "../../src/img/gpay.png";
import paytm from "../../src/img/paytm.jpg";
import upilite from "../../src/img/upilite.png";

export default function Bill() {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const b = [
    "",
    "Ten",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const c = ["", "Hundred", "Thousand", "Lakh", "Crore"];

  const [instituteData, setInstituteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [openReceipt, setOpenReceipt] = useState(false);

  const downloadReceipt = () => {
    const receiptElement = document.getElementById("receipt");
    const opt = {
      margin: 0.5,
      filename: "receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(receiptElement).set(opt).save();
  };

  function convertNumberToWords(num) {
    const numberToWords = (n) => {
      if (n === 0) return "Zero";
      if (n < 10) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 !== 0 ? " " + numberToWords(n % 100) : "")
        );
      if (n < 100000) {
        const thousands = Math.floor(n / 1000);
        const rest = n % 1000;
        return (
          numberToWords(thousands) +
          " Thousand" +
          (rest !== 0 ? " " + numberToWords(rest) : "")
        );
      }
      if (n < 10000000) {
        const lakhs = Math.floor(n / 100000);
        const rest = n % 100000;
        return (
          numberToWords(lakhs) +
          " Lakh" +
          (rest !== 0 ? " " + numberToWords(rest) : "")
        );
      }
      return n;
    };
    return numberToWords(num);
  }

  useEffect(() => {
    const fetchInstituteData = async () => {
      const institutecode = localStorage.getItem("institutecode");
      if (!institutecode) {
        setError("Institute code not found in local storage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setInstituteData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstituteData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleGenerate = (instituteData) => {
    setSelectedInstitute(instituteData);
    setOpenReceipt(true);
  };

  return (
    <Container>
      <Typography
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
        Billing Section
      </Typography>

      <TableContainer>
        <Table>
          <TableHead
            style={{ backgroundColor: "#f2f2f2", justifyContent: "center" }}
          >
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>
                Subscription Start at
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Subscription End at
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Institute Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Institute Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Owner Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Institute Mobile No.
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Plan</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>GST No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Transaction Id.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Invoice No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Bill</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instituteData && (
              <TableRow key={instituteData.id}>
                <TableCell>{instituteData.subscriptstartDate}</TableCell>
                <TableCell>{instituteData.subscriptendDate}</TableCell>
                <TableCell>{instituteData.institutecode}</TableCell>
                <TableCell>{instituteData.institutename}</TableCell>
                <TableCell>{instituteData.ownerName}</TableCell>
                <TableCell>{instituteData.mobilenumber}</TableCell>
                <TableCell>{instituteData.plan}</TableCell>
                <TableCell>{instituteData.gstNo}</TableCell>
                <TableCell>{instituteData.amount}</TableCell>
                <TableCell>{instituteData.transactionId}</TableCell>
                <TableCell>{instituteData.invoiceNo}</TableCell>
                <TableCell sx={{ color: "green", fontWeight: "bold" }}>
                  Paid
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleGenerate(instituteData)}
                  >
                    Generate
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openReceipt}
        onClose={() => setOpenReceipt(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ p: 2 }}>
          {selectedInstitute ? (
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
                    <strong>{selectedInstitute.institutename}</strong>
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
                        {selectedInstitute.address}
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
                      {selectedInstitute.phonenumber}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 0, // Reduced margin-top to bring the addresses closer
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Email : </strong>
                      {selectedInstitute.emailaddress}
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
                  {selectedInstitute.invoiceNo}
                </Typography>
                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Invoice Date:
                  </Typography>{" "}
                  {selectedInstitute.createdAt}
                </Typography>
                <Typography component="span">
                  <Typography component="span" sx={{ fontWeight: "bold" }}>
                    Due Date:
                  </Typography>{" "}
                  {selectedInstitute.subscriptendDate}
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
                      <strong>START DATE</strong>
                    </TableCell>
                    <TableCell>
                      <strong>END DATE</strong>
                    </TableCell>
                    <TableCell>
                      <strong>AMOUNT</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedInstitute.plan} PLAN</TableCell>
                    <TableCell>
                      {selectedInstitute.subscriptstartDate}
                    </TableCell>
                    <TableCell>{selectedInstitute.subscriptendDate}</TableCell>
                    <TableCell>₹ {selectedInstitute.amount}</TableCell>
                  </TableRow>
                  <br />
                  <br />
                  {/* Add more TableRow components here for additional items */}


                  {/* Subtotal Row */}
                  <TableRow
                    sx={{
                      // borderTop: "3px solid purple", // Thick top border
                      borderBottom: "3px solid purple",
                    }}
                  >
                    <TableCell colSpan={3} sx={{ textAlign: "left" }}>
                      <strong>GST %:</strong>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", textAlign: "flex-end" }}>
                        <strong>{selectedInstitute.gstpersent}% (₹ {(selectedInstitute.gstpersent/100) * selectedInstitute.amount})</strong>
                      </Box>
                    </TableCell>
                  </TableRow>

                  {/* Subtotal Row */}
                  <TableRow
                    sx={{
                      borderTop: "3px solid purple", // Thick top border
                      borderBottom: "3px solid purple",
                    }}
                  >
                    <TableCell colSpan={3} sx={{ textAlign: "left" }}>
                      <strong>Total Amount (including gst):</strong>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", textAlign: "flex-end" }}>
                        <strong>₹ {selectedInstitute.totalAmount}</strong>
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
                      Total Amount:
                    </Typography>

                    {/* Total Amount Value */}
                    <Typography variant="body2" fontWeight="bold">
                    ₹ {selectedInstitute.totalAmount}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt:2 }}>
                    {" "}
                    {/* Making text bold and adjusting space */}
                    <strong>
                      Total Amount (in words): <br />
                    </strong>
                    {convertNumberToWords(selectedInstitute.totalAmount)} Only
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
    </Container>
  );
}
