import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Container,
  TablePagination,
  Typography,
} from "@mui/material";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";

const StudentRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(0);
  const institutecode = () => localStorage.getItem("institutecode");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [infoFields] = useState([
    "title",
    "firstName",
    "middleName",
    "motherName",
    "surname",
    "full_name",
    "whatsappNumber",
    "dateOfBirth",
    "dateOfRegistration",
    "gender",
    "maritalStatus",
    "bloodGroup",
    "fatherProfession",
    "birthPlace",
    "nationality",
    "religion",
    "castCategory",
    "address",
    "phoneNumber",
    "emailAddress",
    "country",
    "district",
    "city",
    "taluka",
    "permanentAddress",
    "aadharNumber",
    "panNumber",
    "domicileNumber",
    "pincode",
    "totalMarks",
    "obtainedMarks",
    "cgpa",
    "percentage",
    "grade",
    "handicap",
    "minority",
    "earthquake",
    "projectDifferentiated",
    "ebc",
    "scholarship",
    "scholarshipName",
    "sportsName",
    "role",
    "sportYesNo",
    "height",
    "weight",
    "achievement",
    "noOfYearsPlayed",
    "levelOfParticipation",
    "sportsInjuries",
    "medium",
    "motherTongue",
    "minorityType",
    "casteCertificateNumber",
    "casteValidation",
    "casteValidationNumber",
    "subCaste",
    "birthCountry",
    "birthState",
    "birthDistrict",
    "birthTaluka",
    "fathersName",
    "fathersContact",
    "udiseNo",
    "saralNo",
    "specialPercentage",
    "disabilityType",
    "standardOptions",
    "earthquakeNumber",
    "projectDifferentiatedNumber",
  ]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/getAllStudent?institutecode=${institutecode()}`)
      .then((response) => {
        setLeaveRequests(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the leave requests!", error);
      });
  }, []);

  const handleOpen = (request) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRequest(null);
  };

  const handleOpenInfoDialog = (studentId) => {
    const selectedStudent = leaveRequests.find(
      (student) => student.id === studentId
    );
    setSelectedStudent(selectedStudent);
    setInfoDialogOpen(true);
  };

  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleUpdateStatus = (status) => {
    const updatedRequest = { ...selectedRequest, status };
    axios
      .put(
        `http://localhost:8080/updateStudent/${selectedRequest.id}`,
        updatedRequest
      )
      .then((response) => {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === selectedRequest.id ? { ...req, status } : req
          )
        );
        handleClose();
      })
      .catch((error) => {
        console.error(
          "There was an error updating the leave request status!",
          error
        );
      });
  };

  const handleDeleteRequest = (id) => {
    setRequestToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRequest = () => {
    axios
      .delete(`http://localhost:8080/deleteMapping/${requestToDelete}`)
      .then((response) => {
        setLeaveRequests((prevRequests) =>
          prevRequests.filter((req) => req.id !== requestToDelete)
        );
        setDeleteDialogOpen(false);
        setRequestToDelete(null);
      })
      .catch((error) => {
        console.error("There was an error deleting the leave request!", error);
      });
  };

  const cancelDeleteRequest = () => {
    setDeleteDialogOpen(false);
    setRequestToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      case "Pending":
        return "orange";
      default:
        return "";
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };
  return (
    <>
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
        Student Request
      </Typography>
      <div>
        <div>        
          <TableContainer component={Paper} style={{ margin: "auto" }}>         
            <Table>
              <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Student Full Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Date Of Registration
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Standard</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Medium</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Phone Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.id}</TableCell>
                      <TableCell>{request.full_name}</TableCell>
                      <TableCell>{request.dateOfRegistration}</TableCell>
                      <TableCell>{request.standardOptions}</TableCell>
                      <TableCell>{request.medium}</TableCell>
                      <TableCell>{request.phoneNumber}</TableCell>
                      <TableCell
                        style={{ color: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </TableCell>
                      <TableCell>
                      <IconButton
                          color="success"
                          onClick={() => handleOpenInfoDialog(request.id)}
                        >
                          <InfoIcon />
                        </IconButton>
                        <IconButton
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(request)}
                        >
                        <EditIcon />
                        </IconButton>
                        <IconButton
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteRequest(request.id)}
                          style={{ marginLeft: "5px" }}
                        >
                            <DeleteForeverTwoToneIcon />
                        </IconButton>
                        
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {selectedRequest && (
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>
                Update Student Application Request Status
              </DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="ID"
                  type="text"
                  fullWidth
                  value={selectedRequest.id}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Student Full Name"
                  type="text"
                  fullWidth
                  value={selectedRequest.full_name}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Date Of Registration"
                  type="text"
                  fullWidth
                  value={selectedRequest.dateOfRegistration}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Standard"
                  type="text"
                  fullWidth
                  value={selectedRequest.standardname}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Medium"
                  type="text"
                  fullWidth
                  value={selectedRequest.medium}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Phone Number"
                  type="text"
                  fullWidth
                  value={selectedRequest.phoneNumber}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Status"
                  type="text"
                  fullWidth
                  value={selectedRequest.status}
                  disabled
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("Approved")}
                  color="primary"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("Rejected")}
                  color="secondary"
                >
                  Reject
                </Button>
              </DialogActions>
            </Dialog>
          )}
          {selectedStudent && (
            <Dialog
              open={infoDialogOpen}
              maxWidth="md"
              onClose={handleCloseInfoDialog}
            >
              <DialogTitle>Student Information</DialogTitle>
              <DialogContent>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img
                    src={selectedStudent.studentphoto}
                    alt="Student Photo"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {infoFields.map((field, index) => (
                    <div
                      key={field}
                      style={{
                        flex: "0 0 50%",
                        boxSizing: "border-box",
                        padding: "4px",
                      }}
                    >
                      <p>
                        <strong>
                          {field
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                          :
                        </strong>{" "}
                        {String(selectedStudent[field])}
                      </p>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "right", marginTop: "20px" }}>
                  <img
                    src={selectedStudent.studentSign}
                    alt="Student Signature"
                    style={{ width: "150px", height: "50px" }}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseInfoDialog} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}

          <Dialog open={deleteDialogOpen} onClose={cancelDeleteRequest}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this request?
            </DialogContent>
            <DialogActions>
              <Button onClick={cancelDeleteRequest} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmDeleteRequest} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={leaveRequests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ position: "absolute", left: 300 }}
      />
    </>
  );
};

export default StudentRequest;