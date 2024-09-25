

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

  // const downloadReceipt = () => {
  //   const receiptElement = document.getElementById("receipt");
  //   const opt = {
  //     margin: 0.5,
  //     filename: "receipt.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  //   };
  //   html2pdf().from(receiptElement).set(opt).save();
  // };

  const downloadReceipt = () => {
    const receiptElement = document.getElementById("receipt");
    
    // Ensure that images are fully loaded before creating the PDF
    html2pdf().from(receiptElement).set({
      margin: 0.2,
      filename: "receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: true, // Set this to true to get logs about image loading
        useCORS: true, // Enables cross-origin loading for images
      },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }).save();
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

                 {/* Right side content (Institute Image) */}
                 {selectedInstitute.instituteimage && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <img
                      src={selectedInstitute.instituteimage}
                      alt="Institute Logo"
                      style={{ maxWidth: "100px", maxHeight: "100px", borderRadius:'50%'}} // Adjust size as needed
                    />
                  </Box>
                )}
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
