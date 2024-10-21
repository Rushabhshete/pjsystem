import React, { useEffect, useState } from "react";
import EmpIDCard from "./EmpIDCard.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  Paper,
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Info, Edit, Delete, Cancel } from "@mui/icons-material";
import UpdateEmployee from "./UpdateEmployee"; // Import the update component
import InfoEmployee from "./InfoEmployee"; // Import the info component
import Userservice from "./Userservice";
import { toast } from "react-toastify";
import BadgeIcon from "@mui/icons-material/Badge";
import axios from "axios";

const EmployeeList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [uniqueDepartments, setUniqueDepartments] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [uniqueDesignations, setUniqueDesignations] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const getStatusColor = (status) => {
    switch (status) {
      case "Joined":
        return "green";
      case "Terminated":
        return "red";
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await Userservice.getUser();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchUsersAndFilters = async () => {
      try {
        const usersResponse = await Userservice.getUser();
        setUsers(usersResponse.data);

        // Extract unique departments, categories, and designations
        const departments = [
          ...new Set(usersResponse.data.map((user) => user.department)),
        ];
        const categories = [
          ...new Set(usersResponse.data.map((user) => user.employeecategory)),
        ];
        const designations = [
          ...new Set(usersResponse.data.map((user) => user.workDetail)),
        ];

        setUniqueDepartments(departments);
        setUniqueCategories(categories);
        setUniqueDesignations(designations);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users.");
      }
    };

    fetchUsersAndFilters();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filtering users based on selected filters
    if (selectedDepartment) {
      filtered = filtered.filter(
        (user) => user.department === selectedDepartment
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(
        (user) => user.employeecategory === selectedCategory
      );
    }
    if (selectedDesignation) {
      filtered = filtered.filter(
        (user) => user.workDetail === selectedDesignation
      );
    }
    if (selectedStatus) {
      filtered = filtered.filter((user) => user.status === selectedStatus);
    }
    setFilteredUsers(filtered);
  }, [
    users,
    selectedDepartment,
    selectedCategory,
    selectedDesignation,
    selectedStatus,
  ]);

  const handleCancel = async (empID) => {
    const confirmation = window.confirm(
      "Are You Sure You Want To Terminate This Employee?"
    );
    if (confirmation) {
      try {
        const response = await axios.put(
          `https://pjsofttech.in:10443/updateEmployeeStatus/${empID}`,
          {
            status: "Terminated", // Or whatever status you want to set
          }
        );
        if (response.status === 200) {
          // toast.success('Employee status updated successfully.');
        }
        fetchUsers(); // Refresh users after status update
      } catch (error) {
        console.error("Error updating employee status:", error);
        toast.error("Error updating employee status.");
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Userservice.getUser();
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        toast.error("Error fetching users.");
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term.toLowerCase()) ||
        user.employeecategory.toLowerCase().includes(term.toLowerCase()) ||
        user.gender.toLowerCase().includes(term.toLowerCase()) ||
        user.city.toLowerCase().includes(term.toLowerCase()) ||
        user.workDetail.toLowerCase().includes(term.toLowerCase()) ||
        user.status.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleUpdate = (userId) => {
    const user = users.find((u) => u.empID === userId);
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleShowInfo = (userId) => {
    const user = users.find((u) => u.empID === userId);
    setSelectedUser(user);
    setShowInfoModal(true);
  };
  const handleOpenDialog = (empID) => {
    console.log("Dialogue opening for ID: ", empID);
    setSelectedEmployee(empID);
    setDialogOpen(true);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (confirmDelete) {
      try {
        await Userservice.deleteUser(userId);
        const updatedUsers = users.filter((user) => user.empID !== userId);
        setUsers(updatedUsers);
        toast.success("Employee deleted successfully");
      } catch (error) {
        toast.error("Error deleting employee.");
      }
    }
  };

  const handleCloseIDDialog = () => {
    setSelectedEmployee(null);
    setDialogOpen(false);
  };

  const handleDownloadCsv = () => {
    const csvData = filteredUsers.map((user) => ({
      Id: user.empID,
      "Full Name": user.fullName,
      DOB: user.dob,
      "Blood Group": user.bloodGroup,
      Gender: user.gender,
      "Aadhar No": user.adharNo,
      "PAN No": user.panNo,
      Email: user.email,
      Password: user.password,
      "Confirm Password": user.confirmPassword,
      "Current Address": user.currentAddress,
      "Permanent Address": user.permanentAddress,
      "PIN Code": user.pinCode,
      "Permanent PinCode": user.permanentpinCode,
      Landmark: user.landmark,
      "Permanent Landmark": user.permanentlandmark,
      District: user.district,
      "Permanent District": user.permanentdistrict,
      City: user.city,
      "Permanent City": user.permanentcity,
      State: user.state,
      "Permanent State": user.permanentstate,
      Country: user.country,
      "Mobile No": user.mobileNo,
      "Parent No": user.parentNo,
      "Joining Date": user.joiningDate,
      Department: user.department,
      "Duty Type": user.dutyType,
      Salary: user.salary,
      "Work Detail": user.workDetail,
      "Work Location": user.workLocation,
      "CPF No": user.cpf_no,
      "Employee Type": user.employee_type,
      "Employee Category": user.employeecategory,
      "End Date": user.enddate,
      "ESIC No": user.esic_no,
      "Basic Qualification": user.basicQualification,
      "Professional Qualification": user.professionalQualification,
      "Shift Start Time": user.shiftStartTime,
      "Shift End Time": user.shiftEndTime,
      Status: user.status,
      Shift: user.shift,
    }));

    const csvContent = [
      [
        "Id",
        "Full Name",
        "DOB",
        "Blood Group",
        "Gender",
        "Aadhar No",
        "PAN No",
        "Email",
        "Password",
        "Confirm Password",
        "Current Address",
        "Permanent Address",
        "PIN Code",
        "Permanent PinCode",
        "Landmark",
        "Permanent Landmark",
        "District",
        "Permanent District",
        "City",
        "Taluka",
        "Permanent City",
        "Permanent Taluka",
        "State",
        "Permanent State",
        "Country",
        "Joining Date",
        "Department",
        "Duty Type",
        "Salary",
        "Work Detail",
        "Work Location",
        "Mobile No",
        "Parent No",
        "CPF No",
        "Employee Type",
        "Employee Category",
        "End Date",
        "ESIC No",
        "Basic Qualification",
        "Professional Qualification",
        "Shift Start Time",
        "Shift End Time",
        "Status",
        "Shift",
      ],
      ...csvData.map((row) => Object.values(row)),
    ]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Grid container spacing={2} sx={{ padding: "20px" }}>
        <Grid container spacing={2} className="textField-root">
          <Grid item xs={6} md={1.8}>
            <FormControl fullWidth>
              <TextField
                size="small"
                select
                label="Department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {uniqueDepartments.map((department) => (
                  <MenuItem key={department} value={department}>
                    {department}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={1.8}>
            <FormControl fullWidth>
              <TextField
                size="small"
                select
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {uniqueCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={1.8}>
            <FormControl fullWidth>
              <TextField
                size="small"
                select
                label="Designation"
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {uniqueDesignations.map((designation) => (
                  <MenuItem key={designation} value={designation}>
                    {designation}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>{" "}
          <Grid item xs={6} md={1.8}>
            <FormControl fullWidth>
              <TextField
                size="small"
                select
                label="Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value=""> All</MenuItem>
                <MenuItem value="Joined">Joined</MenuItem>
                <MenuItem value="Terminated">Terminated</MenuItem>
              </TextField>
            </FormControl>
          </Grid>{" "}
          <Grid item xs={6} md={1.8}>
            <FormControl fullwidth>
              <TextField
                size="small"
                label="Search"
                id="search-input"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search"
              />
            </FormControl>
          </Grid>
          <Button
            variant="contained"
            onClick={handleDownloadCsv}
            sx={{ ml: 2, mt: 2 }}
          >
            Download CSV
          </Button>
        </Grid>
      </Grid>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value))}
      />

      <TableContainer>
        <Table className="table-root">
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell>
                
                  Id
               
              </TableCell>
              <TableCell>
                
                  Name
               
              </TableCell>
              <TableCell>
                
                  Email
               
              </TableCell>
              <TableCell>
                
                  Department
               
              </TableCell>
              <TableCell>
                
                  Category
               
              </TableCell>
              <TableCell>
                
                  Designation
               
              </TableCell>
              <TableCell>
                
                  City
               
              </TableCell>
              <TableCell>
                
                  Joining Date
               
              </TableCell>
              <TableCell>
                
                  End Date
               
              </TableCell>
              <TableCell>
                
                  Status
               
              </TableCell>
              <TableCell>
                
                  Actions
               
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.empID}>
                <TableCell>{user.empID}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.employeecategory}</TableCell>
                <TableCell>{user.workDetail}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>
                  {new Date(user.joiningDate).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>
                  {user.enddate
                    ? new Date(user.enddate).toLocaleDateString("en-GB")
                    : ""}
                </TableCell>
                <TableCell
                  style={{
                    color: getStatusColor(user.status),
                    fontWeight: "bold",
                  }}
                >
                  {user.status}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleShowInfo(user.empID)}
                  >
                    <Info />
                  </IconButton>
                  <IconButton
                    sx={{ color: "blue" }}
                    onClick={() => handleUpdate(user.empID)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => handleDelete(user.empID)}
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    sx={{ color: "red" }}
                    onClick={() => handleCancel(user.empID)}
                  >
                    <Cancel />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpenDialog(user.empID)}
                  >
                    <BadgeIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value))}
      />

      {showUpdateModal && selectedUser && (
        <UpdateEmployee
          user={selectedUser}
          onClose={() => setShowUpdateModal(false)}
        />
      )}

      {showInfoModal && selectedUser && (
        <InfoEmployee
          user={selectedUser}
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {/* id card dialog  */}

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseIDDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle textAlign={"center"}>Id Card</DialogTitle>
        <DialogContent style={{ width: "auto", padding: "20px" }}>
          <EmpIDCard
            id={selectedEmployee}
            onClose={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeList;
