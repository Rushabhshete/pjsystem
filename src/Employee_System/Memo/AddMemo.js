import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

export default function AddMemo() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [memoName, setMemoName] = useState("");
  const [memoDescription, setMemoDescription] = useState("");
  const [memoDate, setMemoDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query

  useEffect(() => {
    const institutecode = localStorage.getItem("institutecode");
    if (institutecode) {
      // Fetch employees
      axios
        .get(
          `http://localhost:8082/employees/status/Joined?institutecode=${institutecode}`
        )
        .then((response) => {
          setEmployees(response.data);
          setFilteredEmployees(response.data);
        })
        .catch((error) => console.error("Error fetching employees:", error));

      // Fetch departments
      axios
        .get(
          `http://localhost:8082/departments/allDepartment?institutecode=${institutecode}`
        )
        .then((response) => setDepartments(response.data))
        .catch((error) => console.error("Error fetching departments:", error));

      // Fetch categories
      axios
        .get(
          `http://localhost:8082/categories/all?institutecode=${institutecode}`
        )
        .then((response) => setCategories(response.data))
        .catch((error) => console.error("Error fetching categories:", error));
    }
  }, []);

  useEffect(() => {
    // Filter employees based on selected department, category, and search query
    let filtered = employees;

    if (selectedDepartment) {
      filtered = filtered.filter(
        (employee) => employee.department === selectedDepartment
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (employee) => employee.employeecategory === selectedCategory
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (employee) =>
          employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.workLocation
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [selectedDepartment, selectedCategory, searchQuery, employees]);

  const handleAddMemoClick = (employee) => {
    setSelectedEmployee(employee);
    setMemoDate(new Date().toISOString().split("T")[0]);
    setOpenDialog(true);
  };

  const handleSubmitMemo = () => {
    const institutecode = localStorage.getItem("institutecode");

    // Create the memo data object
    const memoData = {
      memoName,
      memoDescription,
      createdAt: memoDate, // Use the selected date in yyyy-mm-dd format
      email: selectedEmployee.email,
      fullName:selectedEmployee.fullName,
      institutecode,
      isDeleted: false,
    };

    // Send memo data to backend
    axios
      .post(
        `http://localhost:8082/memos/addmemo?institutecode=${institutecode}`,
        memoData
      )
      .then(() => {
        alert("Memo added successfully");
        resetForm();
      })
      .catch((error) => {
        console.error(
          "Error adding memo:",
          error.response ? error.response.data : error.message
        );
        alert(
          `Failed to add memo: ${
            error.response ? error.response.data.message : error.message
          }`
        );
      });
  };

  const resetForm = () => {
    setMemoName("");
    setMemoDescription("");
    setMemoDate(new Date().toISOString().split("T")[0]);
    setSelectedEmployee(null);
    setOpenDialog(false);
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={6} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Department</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.department}>
                  {department.department}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.categoryName}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="h6">{`Total Employees: ${filteredEmployees.length}`}</Typography>
        </Grid>
      </Grid>

      <TableContainer>
        <Table size="small" aria-label="exam table" sx={{ width: "100%" }}>
          <TableHead sx={{ backgroundColor: "#f2f2f2" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Employee ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Full Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Work Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Add Memo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.empID}>
                <TableCell>{employee.empID}</TableCell>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.employeecategory}</TableCell>
                <TableCell>{employee.workLocation}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddMemoClick(employee)}
                  >
                    Add Memo
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={resetForm}>
        <DialogTitle>Add Memo for {selectedEmployee?.fullName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Memo Subject"
            type="text"
            fullWidth
            variant="outlined"
            value={memoName}
            onChange={(e) => setMemoName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Memo Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={memoDescription}
            onChange={(e) => setMemoDescription(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Memo Date"
            type="date"
            fullWidth
            variant="outlined"
            value={memoDate}
            onChange={(e) => setMemoDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitMemo} color="primary">
            Add Memo
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
