

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";

const FeeReport = () => {
  const [fees, setFees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [medium, setMedium] = useState("");
  const [standard, setStandard] = useState("");
  const [feeStatus, setFeeStatus] = useState("");
  const [feesCollectionType, setFeesCollectionType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();
  const institutecode = () => localStorage.getItem("institutecode");

  // Fetch all fees once
  const fetchAllFees = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8083/getAllFees?institutecode=${institutecode()}`);
      if (response.status === 200 && Array.isArray(response.data)) {
        setFees(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setFees([]);
      }
    } catch (error) {
      console.error("There was an error fetching the Fees!", error);
      setFees([]);
    }
  }, []);

  useEffect(() => {
    fetchAllFees();
  }, [fetchAllFees]);

  // Extract unique values for filter dropdowns
  const uniqueMediums = useMemo(() => {
    const mediums = fees.map(fee => fee.medium);
    return [...new Set(mediums)];
  }, [fees]);

  const uniqueStandards = useMemo(() => {
    const standards = fees.map(fee => fee.standard);
    return [...new Set(standards)];
  }, [fees]);

  const uniqueFeeStatuses = useMemo(() => {
    const statuses = fees.map(fee => fee.feesStatus);
    return [...new Set(statuses)];
  }, [fees]);

  const uniqueFeesCollectionTypes = useMemo(() => {
    const collectionTypes = fees.map(fee => fee.feesCollectionType);
    return [...new Set(collectionTypes)];
  }, [fees]);

  // Compute filtered fees
  const filteredFees = useMemo(() => {
    return fees.filter(fee => {
      // Search filter
      const matchesSearch = fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            fee.rollNo.toLowerCase().includes(searchQuery.toLowerCase());

      // Standard filter
      const matchesStandard = standard ? fee.standard === standard : true;

      // Medium filter
      const matchesMedium = medium ? fee.medium === medium : true;

      // Fee Status filter
      const matchesFeeStatus = feeStatus ? fee.feesStatus === feeStatus : true;

      // Fees Collection Type filter
      const matchesFeesCollectionType = feesCollectionType ? fee.feesCollectionType === feesCollectionType : true;

      // Date filter
      let matchesDate = true;
      const feeDate = new Date(fee.registrationDate);
      const today = new Date();

      if (filter === "7") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        matchesDate = feeDate >= sevenDaysAgo;
      } else if (filter === "30") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        matchesDate = feeDate >= thirtyDaysAgo;
      } else if (filter === "365") {
        const threeSixtyFiveDaysAgo = new Date();
        threeSixtyFiveDaysAgo.setDate(today.getDate() - 365);
        matchesDate = feeDate >= threeSixtyFiveDaysAgo;
      } else if (filter === "Custom") {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          matchesDate = feeDate >= start && feeDate <= end;
        }
      }

      return matchesSearch && matchesStandard && matchesMedium && matchesFeeStatus && matchesFeesCollectionType && matchesDate;
    });
  }, [fees, searchQuery, standard, medium, feeStatus, feesCollectionType, filter, startDate, endDate]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        ["Student Name", "Roll No", "Standard", "Medium", "Division", "Tuition Fee", "Admission Fee", "Practical Fee", "Computer Class Fee", "Exam Fees", "Uniform Fee", "Transport Bus Fee", "Hostel Fee", "Building Fund Fee", "Library Fees", "Sport Fees", "Fees Amount", "Discount", "GST", "Late Fee Charges", "Pending Fees Amount", "Fees CollectionType", "Fees Status", "Transaction ID", "GST No", "Show GST No", "Registration Date", "Receipt Number"],
      ],
      body: filteredFees.map((fee) => [
        fee.studentName,
        fee.rollNo,
        fee.standard,
        fee.medium,
        fee.division,
        fee.tuitionFee,
        fee.admissionFee,
        fee.practicalFee,
        fee.computerClassFee,
        fee.examFees,
        fee.uniformFee,
        fee.transportBusFee,
        fee.hostelFee,
        fee.buildingFundFee,
        fee.libraryFees,
        fee.sportFees,
        fee.feesAmount,
        fee.discount,
        fee.gst,
        fee.lateFeeCharges,
        fee.pendingFeesAmount,
        fee.feesCollectionType,
        fee.feesStatus,
        fee.transactionId,
        fee.gstNo,
        fee.showGstNo ? "Yes" : "No",
        fee.registrationDate,
        fee.receiptNumber,
      ]),
    });
    doc.save("fee_report.pdf");
  };

  return (
    <Container
    component="main"
    maxWidth={false}
    sx={{
      overflow: 'hidden',
      padding: '16px',
      marginTop: '16px',
      marginLeft: "20px",
      width: '1000px', // Custom width between md and lg
      maxWidth: '1100px' // Ensures the width doesn't exceed 1100px
    }}
  >
      <Paper style={{ padding: 16 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search Field */}
          <Grid item>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              onChange={handleSearch}
            />
          </Grid>

          {/* Date Filter */}
          <Grid item>
            <FormControl variant="outlined" size="small">
              <InputLabel>Filter</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filter"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="7">Last 7 Days</MenuItem>
                <MenuItem value="30">Last 30 Days</MenuItem>
                <MenuItem value="365">Last 365 Days</MenuItem>
                <MenuItem value="Custom">Custom Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Custom Date Range */}
          {filter === "Custom" && (
            <>
              <Grid item>
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setStartDate(e.target.value)}
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setEndDate(e.target.value)}
                  size="small"
                  variant="outlined"
                />
              </Grid>
            </>
          )}

          {/* Standard Dropdown */}
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              select
              label="Standard"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              variant="outlined"
              size="small"
            >
              <MenuItem value="">All Standards</MenuItem>
              {uniqueStandards.map((std) => (
                <MenuItem key={std} value={std}>
                  {std}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Medium Dropdown */}
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Medium</InputLabel>
              <Select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                label="Medium"
              >
                <MenuItem value="">All Mediums</MenuItem>
                {uniqueMediums.map((med) => (
                  <MenuItem key={med} value={med}>
                    {med}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fee Status Dropdown */}
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Fee Status</InputLabel>
              <Select
                value={feeStatus}
                onChange={(e) => setFeeStatus(e.target.value)}
                label="Fee Status"
              >
                <MenuItem value="">All Statuses</MenuItem>
                {uniqueFeeStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fees Collection Type Dropdown */}
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Fees Collection Type</InputLabel>
              <Select
                value={feesCollectionType}
                onChange={(e) => setFeesCollectionType(e.target.value)}
                label="Fees Collection Type"
              >
                <MenuItem value="">All Types</MenuItem>
                {uniqueFeesCollectionTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Download Buttons */}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <CSVLink
              data={filteredFees}
              headers={[
                { label: "Student Name", key: "studentName" },
                { label: "Roll No", key: "rollNo" },
                { label: "Standard", key: "standard" },
                { label: "Medium", key: "medium" },
                { label: "Division", key: "division" },
                { label: "Tuition Fee", key: "tuitionFee" },
                { label: "Admission Fee", key: "admissionFee" },
                { label: "Practical Fee", key: "practicalFee" },
                { label: "Computer Class Fee", key: "computerClassFee" },
                { label: "Exam Fees", key: "examFees" },
                { label: "Uniform Fee", key: "uniformFee" },
                { label: "Transport Bus Fee", key: "transportBusFee" },
                { label: "Hostel Fee", key: "hostelFee" },
                { label: "Building Fund Fee", key: "buildingFundFee" },
                { label: "Library Fees", key: "libraryFees" },
                { label: "Sport Fees", key: "sportFees" },
                { label: "Fees Amount", key: "feesAmount" },
                { label: "Discount", key: "discount" },
                { label: "GST", key: "gst" },
                { label: "Late Fee Charges", key: "lateFeeCharges" },
                { label: "Pending Fees Amount", key: "pendingFeesAmount" },
                { label: "Fees CollectionType", key: "feesCollectionType" },
                { label: "Fees Status", key: "feesStatus" },
                { label: "Transaction ID", key: "transactionId" },
                { label: "GST No", key: "gstNo" },
                { label: "Show GST No", key: "showGstNo" },
                { label: "Registration Date", key: "registrationDate" },
                { label: "Receipt Number", key: "receiptNumber" },
              ]}
              filename="fee_report.csv"
            >
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: 16 }}
              >
                Download CSV
              </Button>
            </CSVLink>
          </Grid>
        </Grid>

        {/* Fee Records Table */}
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <Table>
            <TableHead sx={{backgroundColor:'#f2f2f2'}}>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>Standard</TableCell>
                <TableCell>Medium</TableCell>
                <TableCell>Division</TableCell>
                <TableCell>Tuition Fee</TableCell>
                <TableCell>Admission Fee</TableCell>
                <TableCell>Practical Fee</TableCell>
                <TableCell>Computer Class Fee</TableCell>
                <TableCell>Exam Fees</TableCell>
                <TableCell>Uniform Fee</TableCell>
                <TableCell>Transport Bus Fee</TableCell>
                <TableCell>Hostel Fee</TableCell>
                <TableCell>Building Fund Fee</TableCell>
                <TableCell>Library Fees</TableCell>
                <TableCell>Sport Fees</TableCell>
                <TableCell>Fees Amount</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>GST</TableCell>
                <TableCell>Late Fee Charges</TableCell>
                <TableCell>Pending Fees Amount</TableCell>
                <TableCell>Fees CollectionType</TableCell>
                <TableCell>Fees Status</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>GST No</TableCell>
                <TableCell>Show GST No</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.studentName}</TableCell>
                  <TableCell>{fee.rollNo}</TableCell>
                  <TableCell>{fee.standard}</TableCell>
                  <TableCell>{fee.medium}</TableCell>
                  <TableCell>{fee.division}</TableCell>
                  <TableCell>{fee.tuitionFee}</TableCell>
                  <TableCell>{fee.admissionFee}</TableCell>
                  <TableCell>{fee.practicalFee}</TableCell>
                  <TableCell>{fee.computerClassFee}</TableCell>
                  <TableCell>{fee.examFees}</TableCell>
                  <TableCell>{fee.uniformFee}</TableCell>
                  <TableCell>{fee.transportBusFee}</TableCell>
                  <TableCell>{fee.hostelFee}</TableCell>
                  <TableCell>{fee.buildingFundFee}</TableCell>
                  <TableCell>{fee.libraryFees}</TableCell>
                  <TableCell>{fee.sportFees}</TableCell>
                  <TableCell>{fee.feesAmount}</TableCell>
                  <TableCell>{fee.discount}</TableCell>
                  <TableCell>{fee.gst}</TableCell>
                  <TableCell>{fee.lateFeeCharges}</TableCell>
                  <TableCell>{fee.pendingFeesAmount}</TableCell>
                  <TableCell>{fee.feesCollectionType}</TableCell>
                  <TableCell>{fee.feesStatus}</TableCell>
                  <TableCell>{fee.transactionId}</TableCell>
                  <TableCell>{fee.gstNo}</TableCell>
                  <TableCell>{fee.showGstNo ? "Yes" : "No"}</TableCell>
                  <TableCell>{fee.registrationDate}</TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() => {
                        setSelectedFeeId(fee.id);
                        setOpenDialog(true);
                      }}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this fee record?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                const response = await axios.delete(`http://localhost:8083/deleteFee/${selectedFeeId}`);
                if (response.status === 200) {
                  setFees((prevFees) => prevFees.filter((fee) => fee.id !== selectedFeeId));
                } else {
                  console.error("Unexpected response format:", response);
                }
              } catch (error) {
                console.error("There was an error deleting the fee!", error);
              }
              setOpenDialog(false);
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FeeReport;

