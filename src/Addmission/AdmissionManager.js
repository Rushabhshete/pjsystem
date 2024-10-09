// import React, { useState } from "react";
// import AdmissionDashboard from "./AdmissionDashboard";
// import AdmissionForm from "./AdmissionForm";
// import StudentList from "./StudentList";
// import AdmissionAddCourse from "./AdmissionAddCourse";
// import AddmissionSource from "./AddmissionSource";
// import AddGuide from "./AddGuide";

// // Base styles for the navbar items with hover effect and transitions
// const navItemStyle = {
//   padding: "10px 20px",
//   cursor: "pointer",
//   fontSize: "16px",
//   fontWeight: "bold",
//   color: "#333",
//   textAlign: "center",
//   flex: 1,
//   transition: "background-color 0.3s ease, color 0.3s ease, transform 0.2s ease",
//   borderRadius: "35px",
// };

// // Active item styles
// const activeNavItemStyle = {
//   ...navItemStyle,
//       backgroundColor: "#3498DB",
//   color: "white",
//   transform: "scale(1.1)", // Slightly larger for active state
//   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for active
// };

// // Subnavbar container style
// const subNavBarStyle = {
//   display: "flex",
//   justifyContent: "space-around",
//   marginBottom: "20px",
//   backgroundColor: "#f0f0f0",
//   padding: "10px",
//   borderRadius: "35px",
//   boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Slight shadow for navbar
// };

// const AdmissionManager = () => {
//   const [activeComponent, setActiveComponent] = useState("AdmissionDashboard");

//   const components = {
//     AdmissionDashboard: <AdmissionDashboard />,
//     AdmissionForm: <AdmissionForm />,
//     StudentList: <StudentList />,
//     AdmissionAddCourse: <AdmissionAddCourse />,
//     AddmissionSource: <AddmissionSource />,
//     AddGuide: <AddGuide />,
//   };

//   return (
//     <div>
//       {/* Mini navbar (subnavbar) */}
//       <div style={subNavBarStyle}>
//         <div
//           style={
//             activeComponent === "AdmissionDashboard"
//               ? activeNavItemStyle
//               : navItemStyle
//           }
//           onClick={() => setActiveComponent("AdmissionDashboard")}
//         >
//           Dashboard
//         </div>
//         <div
//           style={
//             activeComponent === "AdmissionForm"
//               ? activeNavItemStyle
//               : navItemStyle
//           }
//           onClick={() => setActiveComponent("AdmissionForm")}
//         >
//           Admission Form
//         </div>
//         <div
//           style={
//             activeComponent === "AdmissionAddCourse"
//               ? activeNavItemStyle
//               : navItemStyle
//           }
//           onClick={() => setActiveComponent("AdmissionAddCourse")}
//         >
//           Add Course
//         </div>
//         <div
//           style={
//             activeComponent === "AddmissionSource"
//               ? activeNavItemStyle
//               : navItemStyle
//           }
//           onClick={() => setActiveComponent("AddmissionSource")}
//         >
//           Add Source
//         </div>
//         <div
//           style={
//             activeComponent === "AddGuide" ? activeNavItemStyle : navItemStyle
//           }
//           onClick={() => setActiveComponent("AddGuide")}
//         >
//           Add Guide
//         </div>
//         <div
//           style={
//             activeComponent === "StudentList"
//               ? activeNavItemStyle
//               : navItemStyle
//           }
//           onClick={() => setActiveComponent("StudentList")}
//         >
//           Student List
//         </div>
//       </div>

//       {/* Render the selected component */}
//       <div>{components[activeComponent]}</div>
//     </div>
//   );
// };

// export default AdmissionManager;

import React from "react";
import { Routes, Route } from "react-router-dom";
import AdmissionDashboard from "./AdmissionDashboard";
import AdmissionForm from "./AdmissionForm";
import StudentList from "./StudentList";
import AdmissionAddCourse from "./AdmissionAddCourse";
import AddmissionSource from "./AddmissionSource";
import AddGuide from "./AddGuide";
import AdmissionManagerLayout from "./AdmissionManagerLayout";

const AdmissionManager = () => {
  return (
    <Routes>
      {/* Main route that renders the layout with the sidebar */}
      <Route path="/" element={<AdmissionManagerLayout />}>
        {/* Nested routes inside AdmissionManagerLayout */}
        <Route index element={<AdmissionDashboard />} />
        <Route path="admission-form" element={<AdmissionForm />} />
        <Route path="add-course" element={<AdmissionAddCourse />} />
        <Route path="add-source" element={<AddmissionSource />} />
        <Route path="add-guide" element={<AddGuide />} />
        <Route path="student-list" element={<StudentList />} />
      </Route>
    </Routes>
  );
};

export default AdmissionManager;



