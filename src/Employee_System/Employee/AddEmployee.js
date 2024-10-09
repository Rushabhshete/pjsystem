import React, { useEffect, useState } from "react";
import { Button, Container, Paper, Typography, Grid, Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import UserService from "../Employee/Userservice";
import Upload from "./Upload";
import EmployeePersonalInfo from "../Employee/EmployeePersonalInfo";
import EmployeeDetails from "../Employee/EmployeeDetails";
import PreviewComponent from "../Employee/PreviewComponent"; // Import PreviewComponent
//import '../../CSS/asterick.css';
import { styled } from "@mui/system";

const UserComponent = () => {
  const [user, setUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );
  const [email, setEmail] = useState(null);
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    adharNo: "",
    panNo: "",
    institutecode: localStorage.getItem("institutecode") || "",
    email: "",
    password: "",
    confirmPassword: "",
    bloodGroup: "",
    gender: "",
    mobileNo: "",
    parentNo: "",
    taluka:"",
    city: "",
    permanentcity: "",
    permanentAddress: "",
    joiningDate: "",
    department: "",
    employeecategory: "",
    dutyType: "",
    salary: "",
    workDetail: "",
    country: "",
    workLocation: "",
    landmark: "",
    permanentlandmark: "",
    state: "",
    permanentstate: "",
    cpfNo: "",
    employeeType: "",
    // enddate: "",
    esicNo: "",
    pinCode: "",
    permanentpinCode: "",
    district: "",
    permanentdistrict: "",
    basicQualification: "",
    professionalQualification: "",
    shiftStartTime: "",
    shiftEndTime: "",
    status: "Joined",
    shift: "",
  });

  const requiredFields = {
    1: [
      "fullName",
      "bloodGroup",
      "gender",
      "email",
      "password",
      "confirmPassword",
      "dob",
      "adharNo",
      "panNo",
      "currentAddress",
      "pinCode",
      "landmark",
      "district",
      "city",
      "taluka",
      "state",
      "permanentAddress",
      "permanentpinCode",
      "permanentlandmark",
      "permanentdistrict",
      "permanentcity",
      "permanenttaluka",
      "permanentstate",
      "country",
      "mobileNo",
      "parentNo",
    ],
    2: [
      "joiningDate",
      "department",
      "employeecategory",
      "dutyType",
      "salary",
      "workDetail",
      "workLocation",
      "cpfNo",
      "employeeType",
      "enddate",
      "esicNo",
      "basicQualification",
      "professionalQualification",
      "shiftStartTime",
      "shiftEndTime",
      "status",
      "shift",
    ],
  };

  const loadCategory = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8082/categories/all?institutecode=${institutecode}`
      );
      setCategory(result.data);
    } catch (error) {
      console.error("Error fetching in Category of Employee", error);
    }
  };

  useEffect(() => {
    loadCategory();
  }, [institutecode]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmitData = async () => {
    try {
      const dataToSubmit = {
        ...formData,
        status: formData.status,
      };

      const response = await fetch(
        `http://localhost:8082/addEmp?institutecode=${institutecode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setEmail(result.email);
        console.log("Generated emailAddress:", result.email);
        setCurrentPage(3); // Move to document upload page
      } else {
        const errorMessage = await response.text();
        console.error("HTTP Error:", response.status, errorMessage);
        toast.error(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleDocumentUpload = async () => {
    // Assuming you have the logic to upload the document
    // Once the document is uploaded, we can move to the preview page
    setCurrentPage(4);
    toast.success("Form submitted successfully!");
  };

  const validateForm = () => {
    const currentRequiredFields = requiredFields[currentPage] || [];

    // Password and Confirm Password Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      toast.error("Password should be at least 8 characters long");
      return false;
    }

    // Mobile Number and Parent Contact Number Validation
    if (
      formData.mobileNo.length !== 10 ||
      !/^\d{10}$/.test(formData.mobileNo)
    ) {
      toast.error("Mobile Number should be exactly 10 digits");
      return false;
    }
    if (
      formData.parentNo.length !== 10 ||
      !/^\d{10}$/.test(formData.parentNo)
    ) {
      toast.error("Parent Contact Number should be exactly 10 digits");
      return false;
    }

    // Aadhaar Number Validation
    if (formData.adharNo.length !== 12 || !/^\d{12}$/.test(formData.adharNo)) {
      toast.error("Aadhaar Number should be exactly 12 digits");
      return false;
    }

    // PAN Number Validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo)) {
      toast.error("PAN Number is not valid");
      return false;
    }

    for (const field of currentRequiredFields) {
      if (!formData[field]) {
        toast.error(
          `Please fill in the ${field.replace(/([A-Z])/g, " $1")} field.`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPage === 2) {
      if (window.confirm("Are you sure you want to submit the form?")) {
        await handleSubmitData();
      }
    } else if (currentPage === 3) {
      await handleDocumentUpload();
    } else {
      if (validateForm()) {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, 4));
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getUser();
        console.log("Data fetched:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUsers();
  }, [institutecode]);

  const prevPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <EmployeePersonalInfo
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <EmployeeDetails
            formData={formData}
            handleChange={handleChange}
            category={category}
          />
        );
      case 3:
        return (
          <Upload
            email={email}
            setFormData={setFormData}
            onUploadComplete={handleDocumentUpload}
          />
        );
      case 4:
        return <PreviewComponent formData={formData} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  const PopTypography = styled(Typography)`
    @keyframes pop {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;

  return (
    <>
      <br />
      <div component="main" maxWidth="lg">
        <Paper elevation={3} style={{ padding: "20px" }}>
          <form onSubmit={handleSubmit}>
            {renderPage()}
            {currentPage !== 4 && (
              <Grid container spacing={3} style={{ marginTop: "20px" }}>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {currentPage > 1 && currentPage !== 3 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={prevPage}
                        style={{ marginRight: "10px" }}
                      >
                        Previous
                      </Button>
                    )}
                    <Button type="submit" variant="contained" color="primary">
                      {currentPage === 3 ? "Submit" : "Next"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </form>
        </Paper>
        <ToastContainer />
      </div>
    </>
  );
};

export default UserComponent;
