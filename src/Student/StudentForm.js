import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonalDetails from "./PersonalDetails";
import EducationalDetails from "./EducationalDetails";
import OtherDetails from "./OtherDetails";
import SportsDetail from "./SportsDetail";
// import PaymentGateway from "./PaymentGateway";
import UploadDocuments from "./UploadDocuments";
import PreviewPage from "./PreviewPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = [
  "Personal Details",
  "Educational Details",
  "Sports Details",
  "Other Details",
  "Upload Document",
  "Payment",
];

const StudentForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const institutecode = () => localStorage.getItem("institutecode");
  const [formData, setFormData] = useState({
    id: null, // Will be set after submitting initial data
    // Personal Details
    standardOptions: "",
    medium: "",
    title: "",
    firstName: "",
    middleName: "",
    surname: "",
    full_name: "",
    gender: "",
    bloodGroup: "",
    motherTongue: "",
    maritalStatus: "",
    emailAddress: "",

    // Caste Info
    religion: "",
    minority: false,
    minorityType: "",
    castCategory: "",
    casteCertificateNumber: "",
    casteValidation: false,
    casteValidationNumber: "",
    subCaste: "",

    // Birth Info
    dateOfBirth: "",
    age: "",
    birthPlace: "",
    birthTaluka: "",
    birthDistrict: "",
    birthState: "",
    birthCountry: "",

    // Family Info
    fathersName: "",
    motherName: "",
    fatherProfession: "",
    fathersContact: "",
    phoneNumber: "",
    whatsappNumber: "",
    panNumber: "",
    aadharNumber: "",
    // Personal Extra
    udiseNo: "",
    saralNo: "",
    incomeRanges: "",
    nationality: "",
    othernationality: "",

    // Educational
    exams: [],

    // Sports
    sportYesNo: false,
    sportsName: "",
    role: "",
    levelOfParticipation: "",
    internationaldetail: "",
    noOfYearsPlayed: "",
    achievement: "",
    sportsInjuries: "",
    height: "",
    weight: "",

    // Other Details
    handicap: false,
    disabilityType: "",
    specialPercentage: "",
    domicilebool: false,
    domicileNumber: "",
    earthquake: false,
    earthquakeNumber: "",
    //ebc: false,
    projectDifferentiated: false,
    projectDifferentiatedNumber: "",
    scholarship: false,
    scholarshipName: "",
    dateOfRegistration: "",

    // Address Details
    address: "",
    landmark: "",
    city: "",
    taluka: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    permanentAddress: "",
    plandmark: "",
    pcity: "",
    ptaluka: "",
    pdistrict: "",
    pstate: "",
    pcountry: "",
    ppincode: "",
    institutecode: `${institutecode()}`,

    //standards: "",

    // Image
    // studentphoto: "",
    // studentSign: "",
    // aadharcard: "",
    // pancard: "",
    // castevalidationphoto: "",
    // castecertificate: "",
    // leavingcertificate: "",
    // domicile: "",
    // birthcertificate: "",
    // disabilitycertificate: "",
  });

  const navigate = useNavigate();

  const handleNext = async () => {
    if (
      activeStep === 0 ||
      activeStep === 1 ||
      activeStep === 2 ||
      activeStep === 3 ||
      activeStep === 4
    ) {
      try {
        console.log("Submitting form data:", formData);
        if (activeStep !== 4) {
          const studentResponse = await axios.post(
            `http://13.233.43.240:8080/saveStudent?institutecode=${institutecode()}`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // toast.success("Success");
          console.log("Student response:", studentResponse.data);

          const generatedId = studentResponse.data.id;

          setFormData((prevData) => ({
            ...prevData,
            id: generatedId,
          }));
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } catch (error) {
        console.error("There was an error submitting the form!", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }

        toast.error("Failed to submit section data");
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setShowPreview(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // Final submission logic - showing popup and redirecting to dashboard
    toast.success("Final submission successful");
    navigate("/dashboard"); // Redirect to dashboard after successful submission
  };

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
    let parsedValue = value;

    if (
      name === "minority" ||
      name === "casteValidation" ||
      name === "sportYesNo" ||
      name === "projectDifferentiated" ||
      name === "handicap" ||
      name === "earthquake" ||
      name === "scholarship" ||
      name === "domicilebool" ||
      name === "ebc"
    ) {
      parsedValue = value === "Yes";
    }

    if (type === "file") {
      const file = files[0];
      if (file) {
        // Handle file upload
        const formData = new FormData();
        formData.append(name, file);

        axios
          .post("http://13.233.43.240:8080/upload", formData)
          .then((response) => {
            setFormData((prevData) => ({
              ...prevData,
              [name]: response.data.fileUrl, // assuming the response contains the file URL
            }));
            //   toast.success("File uploaded successfully");
          })
          .catch((error) => {
            console.error("There was an error uploading the file!", error);
            toast.error("Failed to upload file");
          });
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parsedValue,
      }));
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <PersonalDetails
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 1:
        return (
          <EducationalDetails
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <SportsDetail
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <OtherDetails
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <UploadDocuments
            emailAddress={formData.emailAddress}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
    //   case 5:
    //     return (
    //       <PaymentGateway
    //         formData={formData}
    //         handleInputChange={handleInputChange}
    //       />
    //     );
      default:
        return "Unknown step";
    }
  };

  if (showPreview) {
    return (
      <Box sx={{ display: "flex" }}>
        <PreviewPage formData={formData} />
      </Box>
    );
  }

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
        Student Application
      </Typography>{" "}
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: "flex" }}></Box>
        <ToastContainer />
        <div
        >
            <Stepper activeStep={activeStep} className="stepper" sx={{marginBottom:'20px'}}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    className="submit-button"
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <div>
                  {getStepContent(activeStep)}
                  <div className="button-group">
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      {activeStep === steps.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
        </div>
      </Box>
    </>
  );
};

export default StudentForm;