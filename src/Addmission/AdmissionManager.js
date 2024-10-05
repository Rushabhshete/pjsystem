import React, { useState } from "react";
import AdmissionDashboard from "./AdmissionDashboard";
import AdmissionForm from "./AdmissionForm";
import StudentList from "./StudentList";
import AdmissionAddCourse from "./AdmissionAddCourse";
import AddmissionSource from "./AddmissionSource";
import AddGuide from "./AddGuide";

const baseButtonStyle = {
  backgroundColor: "#FF6969",
  color: "#333",
  border: "none",
  borderRadius: "35px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  transition: "background-color 0.3s ease, transform 0.2s ease",
  width: "180px",
  flexGrow: 1,
  margin: "0 10px",
  textAlign: "center",
};

const activeButtonStyle = {
  ...baseButtonStyle,
  backgroundColor: "#624E88",
  transform: "scale(1.15)", // Slightly larger to indicate it is active
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow for emphasis
  color: "white",
};

const AdmissionManager = () => {
  const [activeComponent, setActiveComponent] = useState("AdmissionDashboard");

  const components = {
    AdmissionDashboard: <AdmissionDashboard />,
    AdmissionForm: <AdmissionForm />,
    StudentList: <StudentList />,
    AdmissionAddCourse: <AdmissionAddCourse />,
    AddmissionSource: <AddmissionSource />,
    AddGuide: <AddGuide />,
  };

  return (
    <div>
      {/* Horizontal buttons for navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <button
          style={
            activeComponent === "AdmissionDashboard"
              ? activeButtonStyle
              : baseButtonStyle
          }
          onClick={() => setActiveComponent("AdmissionDashboard")}
        >
          Dashboard
        </button>
        <button
          style={
            activeComponent === "AdmissionForm"
              ? activeButtonStyle
              : baseButtonStyle
          }
          onClick={() => setActiveComponent("AdmissionForm")}
        >
          Admission Form
        </button>
        <button
          style={
            activeComponent === "StudentList"
              ? activeButtonStyle
              : baseButtonStyle
          }
          onClick={() => setActiveComponent("StudentList")}
        >
          Student List
        </button>
        <button
          style={
            activeComponent === "AdmissionAddCourse"
              ? activeButtonStyle
              : baseButtonStyle
          }
          onClick={() => setActiveComponent("AdmissionAddCourse")}
        >
          Add Course
        </button>
        <button
          style={
            activeComponent === "AddmissionSource"
              ? activeButtonStyle
              : baseButtonStyle
          }
          onClick={() => setActiveComponent("AddmissionSource")}
        >
          Add Sourse
        </button>
        <button
          style={
            activeComponent === "AddGuide" ? activeButtonStyle : baseButtonStyle
          }
          onClick={() => setActiveComponent("AddGuide")}
        >
          Add Guide
        </button>
      </div>

      {/* Render the selected component */}
      <div>{components[activeComponent]}</div>
    </div>
  );
};

export default AdmissionManager;
