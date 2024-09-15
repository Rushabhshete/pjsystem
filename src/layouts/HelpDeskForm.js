import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  studentManagementErrors,
  systems,
} from "../Income Expense/DropdownData";

const HelpDeskForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    error: "",
    description: "",
    systemName: "",
    image: null,
  });

  const institutecode = () => localStorage.getItem("institutecode");
  const email = localStorage.getItem("email"); // Retrieve email from localStorage

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Handle file input
    }));
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    // Append form data
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append("emailaddress", email); // Append email address

    try {
      const response = await axios.post(
        `http://13.233.43.240:8081/createTicket?institutecode=${institutecode()}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure content type is set for file upload
          },
        }
      );
      console.log("Ticket created:", response.data);
      toast.success("Ticket is raised");
      onClose();
    } catch (error) {
      console.error("There was an error creating the ticket!", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg">
        <DialogTitle>Help Desk Form</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <TextField
              label="Select System"
              name="systemName"
              value={formData.systemName}
              onChange={handleChange}
              required
              select
            >
              {systems.map((system) => (
                <MenuItem key={system.value} value={system.value}>
                  {system.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextField
              select
              label="Select Issues"
              name="error"
              value={formData.error}
              onChange={handleChange}
              required
            >
              {Object.keys(studentManagementErrors).map((errorKey) => (
                <MenuItem key={errorKey} value={errorKey}>
                  {studentManagementErrors[errorKey]}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="dense">
     
            <input
              type="file"
              name="image" // This should match the name in your backend @RequestParam
              label="Upload Image"
              onChange={handleChange}
              required
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer
        autoClose={1000}
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default HelpDeskForm;
