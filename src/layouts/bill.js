import React, { useEffect, useState } from 'react';
import { Table, TableBody, 
    TableCell, TableContainer, TableHead, 
    TableRow, Paper, Typography , Button,Dialog, DialogActions, DialogContent, DialogTitle
    ,Container, Divider, Box,
MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import html2pdf from "html2pdf.js"; // Importing html2pdf.js
import logo from "../../src/Income Expense/logo.jpg";

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
    const receiptElement = document.getElementById("receipt"); // Reference to receipt element
    const opt = {
      margin: 0.5,
      filename: "receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(receiptElement).set(opt).save();
  };

   // Function to convert numbers to words
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
      // Extend this function for larger numbers as needed (e.g., Crores)

      return n; // Fallback in case of any issues
    };

    return numberToWords(num);
  }

  useEffect(() => {
    const fetchInstituteData = async () => {
      const institutecode = localStorage.getItem('institutecode');
      if (!institutecode) {
        setError('Institute code not found in local storage');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8081/findInstitutesby/Institutecode?institutecode=${institutecode}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

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
  
  // Render table
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


        <TableContainer width="100%">
      <Table>
      <TableHead
          style={{
            backgroundColor: "#f2f2f2",
            justifyContent: "center",
          }}
        >
          <TableRow>
            <TableCell sx={{fontWeight:'bold'}}>Subscription Start at</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Subscription End at</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Institute Code</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Institute Name</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Owner Name</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Institute Mobile No.</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Plan</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>GST No.</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Amount</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Transaction Id.</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Invoice No.</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Status</TableCell>
            <TableCell sx={{fontWeight:'bold'}}>Bill</TableCell>
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
              <TableCell
                    align="center"
                    sx={{ color: "green", fontWeight: "bold" }}
                  >
                    Paid
                  </TableCell>
                  <TableCell align="center">
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

    {/* bill section starts */}
    <Dialog
    open={openReceipt}
    onClose={() => setOpenReceipt(false)}
    maxWidth="md"
    fullWidth
  >
    <DialogContent sx={{ p: 2 }}>
      {selectedInstitute ? (
        <Box id="receipt">
          {" "}
          {/* Wrapper for the receipt */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
<Typography variant="body2" align="left">
    <strong>Invoice ID: </strong>
    {selectedInstitute.invoiceNo}
</Typography>
<Typography variant="body2" align="right">
    <strong>Generated At: </strong>
    {selectedInstitute.createdAt}
</Typography>
</Box>

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
              <Typography variant="h5">Billing Receipt</Typography>
            </div>
          </DialogTitle>
          {/* Bill To Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box sx={{ ml: 1 }}>
              <Typography variant="body2" align="left" sx={{ mb: 0.5 }}>
                <strong>Bill To:</strong>
                <br /> {selectedInstitute.institutename}
                <br />
              </Typography>
              <Typography variant="body2" align="left" sx={{ mb: 1 }}>
                <strong>Address:</strong>
                <br />
                {selectedInstitute.address}, {selectedInstitute.city},{" "}
                {selectedInstitute.state},{selectedInstitute.country},{" "}
                {selectedInstitute.pincode}
                <br />
                {selectedInstitute.emailaddress},<br />{" "}
                {selectedInstitute.mobilenumber}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          {/* Basic Info Section */}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Box flex="1" ml={1}>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                <strong>Owner:</strong> {selectedInstitute.ownerName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                <strong>Plan:</strong> {selectedInstitute.plan}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                <strong>Subscription Start Date:</strong>{" "}
                {selectedInstitute.subscriptstartDate}
              </Typography>
            </Box>
            <Box flex="1" mr={1}>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                <strong>GST No:</strong> {selectedInstitute.gstNo}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                <strong>Subscription Year:</strong>{" "}
                {selectedInstitute.subscriptionyear}
              </Typography>
              <Typography variant="body1" sx={{ mb: 0.5 }}>
                <strong>Subscription End Date:</strong>{" "}
                {selectedInstitute.subscriptendDate}
              </Typography>
            </Box>
          </Box>
          {/* Amount Table */}
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
                  { label: "Plan Name", value: selectedInstitute.plan },
                  {
                    label: "Transaction ID",
                    value: selectedInstitute.transactionId,
                  },
                  {
                    label: "Amount",
                    value: `${selectedInstitute.amount.toFixed(2)} Rs.`,
                  },
                  {
                    label: "GST Percentage",
                    value: `${selectedInstitute.gstpersent}%`,
                  },
                  {
                    label: <strong>Total Amount</strong>,
                    value: (
                      <strong>
                        Rs. {selectedInstitute.totalAmount.toFixed(2)}
                      </strong>
                    ),
                  },
                ].map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.label}</TableCell>
                    <TableCell>{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {/* Total Amount in Words */}
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            <strong>Total Amount in Words:</strong>{" "}
            {convertNumberToWords(selectedInstitute.totalAmount)} Only
          </Typography>
          {/* Signature Space */}
          <Box mt={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              mt={2}
              mb={2}
            >
              <Box textAlign="center">
                <Typography variant="body2">
                  Authorized Signature
                </Typography>
                <Box mt={4} borderBottom="1px solid #000" width="150px" />
              </Box>
              <Box textAlign="center">
                <Typography variant="body2">Client Signature</Typography>
                <Box mt={4} borderBottom="1px solid #000" width="150px" />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
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
        </Box>
      ) : (
        <Typography variant="body2" color="red" align="center">
          Receipt data is not available.
        </Typography>
      )}
    </DialogContent>

    <DialogActions>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={downloadReceipt}
        >
          Download Receipt
        </Button>
        <Button onClick={() => setOpenReceipt(false)} color="primary">
          Close
        </Button>
      </Box>
    </DialogActions>
  </Dialog>

  {/* bill section ends  */}
    </Container>
  );
}
