// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Box,
//   Typography,
//   IconButton,
//   Grid,
// } from "@mui/material";
// import logo from "../img/logo.jpg";

// import { Link } from "react-router-dom";
// import {
//   Add,
//   Remove,
//   Dashboard as DashboardIcon,
//   Announcement as AnnouncementIcon,
//   People as PeopleIcon,
//   Person,
//   AddIcCallOutlined,
// } from "@mui/icons-material";
// import { useLocation } from "react-router-dom";
// import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// import NotificationsIcon from "@mui/icons-material/Notifications";
// import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
// import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
// import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
// import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
// import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
// import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
// import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
// import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
// import WorkspacesIcon from "@mui/icons-material/Workspaces";
// import CategoryIcon from "@mui/icons-material/Category";
// import SubjectIcon from "@mui/icons-material/Subject";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import GroupIcon from "@mui/icons-material/Group";
// import NoteAddIcon from "@mui/icons-material/NoteAdd";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
// import AodIcon from "@mui/icons-material/Aod";
// import LightbulbIcon from "@mui/icons-material/Lightbulb";
// import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
// import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
// import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// import HelpIcon from "@mui/icons-material/Help";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import NoteAltIcon from "@mui/icons-material/NoteAlt";
// import StickyNote2Icon from "@mui/icons-material/StickyNote2";
// import MapsUgcIcon from "@mui/icons-material/MapsUgc";
// import PriceCheckIcon from "@mui/icons-material/PriceCheck";
// import Header from "./header";

// const drawerWidth = 240;
// const collapsedWidth = 60;

// const Sidebar = () => {
//   const [expanded, setExpanded] = useState({});
//   const location = useLocation();
//   const [open, setOpen] = useState(true);
//   const [systemValues, setSystemValues] = useState(null);
//   const institutecode = () => localStorage.getItem("institutecode");
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8081/getSystemValueByInstitutecode?institutecode=${institutecode()}`
//         );
//         const data = await response.json();
//         setSystemValues(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDrawerToggle = () => {
//     setOpen(!open);
//     setIsSidebarCollapsed((prev) => !prev);
//   };

//   const isActive = (route) => location.pathname === route;

//   const handleToggle = (option) => {
//     setExpanded((prevExpanded) => ({
//       ...prevExpanded,
//       [option]: !prevExpanded[option],
//     }));
//   };

//   const sidebarOptions = [
//     {
//       name: "Main Dashboard",
//       icon: <DashboardIcon sx={{ color: "#fff" }} />,
//       route: "/layout/combineDash",
//       subOptions: [],
//     },
//     {
//       name: "Enquiry System",
//       icon: <PersonSearchRoundedIcon sx={{ color: "#fff" }} />,
//       show: systemValues?.enquirymanagementsystem,
//       subOptions: [
//         {
//           name: "Enquiry Manager",
//           icon: <DashboardIcon sx={{ color: "#fff" }} />,
//           route: "/layout/Enquiry-manager", // Route for the manager
//           // show: systemValues?.incomeandexpense,
//         },
//       ],
//     },
//     {
//       name: "Admission System",
//       icon: <AddHomeRoundedIcon sx={{ color: "#fff" }} />,
//       show: systemValues?.admissionmanagementsystem,
//       subOptions: [
//         {
//           name: "Admission Manager",
//           icon: <CurrencyRupeeRoundedIcon sx={{ color: "#fff" }} />,
//           route: "/layout/Admission-manager", // Route for the manager
//           // show: systemValues?.incomeandexpense,
//         },
//       ],
//     },
//     {
//       name: "Income & Expense",
//       icon: <CurrencyRupeeRoundedIcon sx={{ color: "#fff" }} />,
//       show: systemValues?.incomeandexpense,
//       subOptions: [
//         {
//           name: "Income Expense Manager",
//           icon: <CurrencyRupeeRoundedIcon sx={{ color: "#fff" }} />,
//           route: "/layout/income-expense-manager", // Route for the manager
//           show: systemValues?.incomeandexpense,
//         },
//       ],
//     },
//     {
//       name: "Employee System",
//       icon: <PeopleIcon sx={{ color: "#fff" }} />,
//       show: systemValues?.employeemanagementsystem,
//       subOptions: [
//         {
//           name: "Employee Manager",
//           icon: <CurrencyRupeeRoundedIcon sx={{ color: "#fff" }} />,
//           route: "/layout/Employee-manager",
//         },
//         {
//           name: "Attendance",
//           icon: <SupervisorAccountRoundedIcon sx={{ color: "#fff" }} />,
//           route: "/layout/attendance-manager",
//         },
//         {
//           name: "Leave",
//           icon: <CategoryIcon sx={{ color: "#fff" }} />,
//           route: "/layout/ManageLeave",
//         },
//         {
//           name: "Salary",
//           icon: <AttachMoneyIcon sx={{ color: "#fff" }} />,
//           route: "/layout/employee-salary-manager",
//         },
//         {
//           name: "Memo",
//           icon: <NoteAltIcon sx={{ color: "#fff" }} />,
//           route: "/layout/Memo-manager",
//         },
//         {
//           name: "Notice",
//           icon: <StickyNote2Icon sx={{ color: "#fff" }} />,
//           route: "/layout/AddNotice",
//         },
//       ],
//     },
//     {
//       name: "Student System",
//       icon: <EmojiPeopleRoundedIcon sx={{ color: "#fff" }} />,
//       show: systemValues?.studentmanagementsystem,
//       subOptions: [
//         {
//           name: "Dashboard",
//           route: "/layout/StudentDashboard",
//           icon: <DashboardIcon sx={{ color: "#fff" }} />,
//         },
//         {
//           name: "Student Form",
//           route: "/layout/StudentForm",
//           icon: <WorkspacesIcon sx={{ color: "#fff" }} />,
//         },
//         {
//           name: "Student List",
//           route: "/layout/StudentLists",
//           icon: <FormatListBulletedIcon sx={{ color: "#fff" }} />,
//         },
//         {
//           name: "Student Report",
//           route: "/layout/StudentReport",
//           icon: <AssessmentIcon sx={{ color: "#fff" }} />,
//         },
//         {
//           name: "Student Request",
//           route: "/layout/StudentRequest",
//           icon: <DoneOutlineIcon sx={{ color: "#fff" }} />,
//         },
//         {
//           name: "Add Fields",
//           route: "/layout/ADDField",
//           icon: <CategoryIcon sx={{ color: "#fff" }} />,
//         },

//         {
//           name: "Fees System",
//           icon: <AttachMoneyIcon sx={{ color: "#fff" }} />,
//           subSubOptions: [
//             {
//               name: "Dashboard",
//               route: "/layout/FeesDashboard",
//               icon: <DashboardIcon sx={{ color: "#fff" }} />,
//             },
//             {
//               name: "Fees Invoice",
//               route: "/layout/FeeInvoice",
//               icon: <CurrencyRupeeIcon sx={{ color: "#fff" }} />,
//             },
//             {
//               name: "Fees Invoice List",
//               route: "/layout/InvoiceList",
//               icon: <AssessmentIcon sx={{ color: "#fff" }} />,
//             },
//             {
//               name: "Add Fees",
//               route: "/layout/AddFee",
//               icon: <AssessmentIcon sx={{ color: "#fff" }} />,
//             },
//             {
//               name: "Fees Table",
//               route: "/layout/FeeTable",
//               icon: <AssessmentIcon sx={{ color: "#fff" }} />,
//             },
//             {
//               name: "Add Medium",
//               route: "/layout/AddMedium",
//               icon: <AssessmentIcon sx={{ color: "#fff" }} />,
//             },
//             {
//               name: "Fees Report",
//               route: "/layout/FeeReport",
//               icon: <AssessmentIcon sx={{ color: "#fff" }} />,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: "Classroom Management",
//       icon: <SchoolRoundedIcon sx={{ color: "#fff" }} />,
//       subOptions: [
//         { name: "Classroom", icon: <AnnouncementIcon /> },
//         { name: "Subject", icon: <SubjectIcon /> },
//         { name: "Account", icon: <AccountCircleIcon /> },
//         { name: "Timetable", icon: <CalendarMonthIcon /> },
//         { name: "Teachers", icon: <GroupIcon /> },
//         { name: "Students", icon: <Person /> },
//         {
//           name: "Attendance",
//           icon: <NotificationsIcon />,
//         },
//         { name: "Homework", icon: <NotificationsIcon /> },
//         { name: "Exam", icon: <NotificationsIcon /> },
//         { name: "Result", icon: <NotificationsIcon /> },
//       ],
//     },
//     {
//       name: "Add Sub-Admin",
//       icon: <AdminPanelSettingsIcon sx={{ color: "#fff" }} />,
//       route: "/layout/subadmin",
//       subOptions: [],
//     },
//     {
//       name: "Help Desk",
//       icon: <HelpIcon sx={{ color: "#fff" }} />,
//       route: "/layout/helpDesk",
//       subOptions: [],
//     },
//     {
//       name: "Billing Section",
//       icon: <PriceCheckIcon sx={{ color: "#fff" }} />,
//       route: "/layout/bill",
//       subOptions: [],
//     },
//     {
//       name: "Settings",
//       icon: <SettingsRoundedIcon sx={{ color: "#fff" }} />,
//       route: "/layout/Settings",
//       subOptions: [],
//     },
//   ];

//   const filteredSidebarOptions = sidebarOptions.filter(
//     (option) => option.show !== false
//   );

//   return (
//     <Drawer
//       variant="persistent"
//       anchor="left"
//       open
//       sx={{
//         width: open ? drawerWidth : collapsedWidth,
//         transition: "width 0.3s",
//         //opacity: 0.8,
//         "& .MuiDrawer-paper": {
//           width: open ? drawerWidth : collapsedWidth,
//           transition: "width 0.3s",
//           overflowX: "hidden",
//           backgroundColor: "#3498DB",
//           //opacity: 0.8,
//         },
//       }}
//     >
//       <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
//         <IconButton
//           onClick={handleDrawerToggle}
//           sx={{
//             marginLeft: "auto",
//             marginTop: "60px",
//             color: "white",
//             marginBottom: "-30px",
//           }}
//         >
//           {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
//         </IconButton>
//       </Box>
//       <Box sx={{ overflowY: "auto" }}>
//         <List sx={{ color: "white" }}>
//           {filteredSidebarOptions.map((option, index) => (
//             <div key={index}>
//               <ListItem
//                 button
//                 onClick={() => handleToggle(option.name)}
//                 component={Link}
//                 to={option.route}
//                 sx={{
//                   backgroundColor: isActive(option.route)
//                     ? "rgba(0, 0, 0, 0.05)"
//                     : "transparent",
//                   "&:hover": {
//                     backgroundColor: isActive(option.route)
//                       ? "rgba(0, 0, 0, 0.05)"
//                       : "rgba(0, 0, 0, 0.02)",
//                     //   marginLeft: "-10px",
//                   },
//                 }}
//               >
//                 <ListItemIcon>{option.icon}</ListItemIcon>
//                 {open && (
//                   <ListItemText
//                     primary={
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontWeight: "normal", // Set to normal instead of bold
//                           fontSize: "13px", // Increase size by 3px from 12px to 15px
//                           marginLeft: "-20px",
//                           fontFamily: "Arial", // You can modify the font as desired
//                         }}
//                       >
//                         {option.name}
//                       </Typography>
//                     }
//                   />
//                 )}
//                 {option.subOptions.length > 0 && (
//                   <ListItemIcon>
//                     {expanded[option.name] ? (
//                       <Remove sx={{ color: "red" }} />
//                     ) : (
//                       <Add sx={{ color: "#FFF" }} />
//                     )}
//                   </ListItemIcon>
//                 )}
//               </ListItem>
//               {open && option.subOptions.length > 0 && (
//                 <Collapse
//                   in={expanded[option.name]}
//                   timeout="auto"
//                   unmountOnExit
//                   sx={{ transition: "all 0.3s ease" }}
//                 >
//                   <List component="div" disablePadding>
//                     {option.subOptions.map((subOption, subIndex) => (
//                       <div key={subIndex}>
//                         <ListItem
//                           button
//                           onClick={() => handleToggle(subOption.name)}
//                           component={Link}
//                           to={subOption.route}
//                           sx={{
//                             pl: 4,
//                             backgroundColor: isActive(subOption.route)
//                               ? "rgba(0, 0, 0, 0.1)"
//                               : "transparent",
//                             "&:hover": {
//                               backgroundColor: isActive(subOption.route)
//                                 ? "rgba(0, 0, 0, 0.1)"
//                                 : "rgba(0, 0, 0, 0.05)",
//                               // marginLeft: "-10px",
//                             },
//                           }}
//                         >
//                           <ListItemIcon>{subOption.icon}</ListItemIcon>
//                           {open && (
//                             <ListItemText
//                               primary={
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     fontSize: "12px",
//                                     marginLeft: "-20px",
//                                     fontWeight: "normal",
//                                     fontFamily:
//                                       '"Roboto", "Helvetica", "Arial", sans-serif',
//                                   }}
//                                 >
//                                   {subOption.name}
//                                 </Typography>
//                               }
//                             />
//                           )}
//                           {subOption.subSubOptions?.length > 0 && (
//                             <ListItemIcon>
//                               {expanded[subOption.name] ? (
//                                 <Remove sx={{ color: "red" }} />
//                               ) : (
//                                 <Add sx={{ color: "green" }} />
//                               )}
//                             </ListItemIcon>
//                           )}
//                         </ListItem>
//                         {open && subOption.subSubOptions?.length > 0 && (
//                           <Collapse
//                             in={expanded[subOption.name]}
//                             timeout="auto"
//                             unmountOnExit
//                             sx={{ transition: "all 0.3s ease" }}
//                           >
//                             <List component="div" disablePadding>
//                               {subOption.subSubOptions.map(
//                                 (subSubOption, subSubIndex) => (
//                                   <ListItem
//                                     button
//                                     key={subSubIndex}
//                                     component={Link}
//                                     to={subSubOption.route}
//                                     sx={{
//                                       pl: 8,
//                                       backgroundColor: isActive(
//                                         subSubOption.route
//                                       )
//                                         ? "rgba(0, 0, 0, 0.1)"
//                                         : "transparent",
//                                       "&:hover": {
//                                         backgroundColor: isActive(
//                                           subSubOption.route
//                                         )
//                                           ? "rgba(0, 0, 0, 0.1)"
//                                           : "rgba(0, 0, 0, 0.05)",
//                                       },
//                                     }}
//                                   >
//                                     <ListItemIcon sx={{ marginLeft: "-20px" }}>
//                                       {subSubOption.icon}
//                                     </ListItemIcon>
//                                     {open && (
//                                       <ListItemText
//                                         primary={
//                                           <Typography
//                                             variant="body2"
//                                             sx={{
//                                               fontSize: "12px",
//                                               marginLeft: "-20px",
//                                               fontWeight: "normal",
//                                               fontFamily:
//                                                 '"Roboto", "Helvetica", "Arial", sans-serif',
//                                             }}
//                                           >
//                                             {subSubOption.name}
//                                           </Typography>
//                                         }
//                                       />
//                                     )}
//                                   </ListItem>
//                                 )
//                               )}
//                             </List>
//                           </Collapse>
//                         )}
//                       </div>
//                     ))}
//                   </List>
//                 </Collapse>
//               )}
//             </div>
//           ))}
//         </List>
//       </Box>
//     </Drawer>
//   );
// };

// export default Sidebar;

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";

import { Link } from "react-router-dom";
import {
  Add,
  Remove,
  Dashboard as DashboardIcon,
  Announcement as AnnouncementIcon,
  People as PeopleIcon,
  Person,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import CategoryIcon from "@mui/icons-material/Category";
import SubjectIcon from "@mui/icons-material/Subject";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from '@mui/icons-material/Person';
import HelpIcon from "@mui/icons-material/Help";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuIcon from '@mui/icons-material/Menu';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import WorkOffIcon from '@mui/icons-material/WorkOff';
const drawerWidth = 255; // Full sidebar width
const iconOnlyWidth = 60; // Width when showing icons only
const Sidebar = () => {
  const [expanded, setExpanded] = useState("");
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [systemValues, setSystemValues] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isCompletelyHidden, setIsCompletelyHidden] = useState(false); // Fully hide sidebar
  const [isMinimized, setIsMinimized] = useState(false); // Controls sidebar minimized state
  const institutecode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/getSystemValueByInstitutecode?institutecode=${institutecode()}`
        );
        const data = await response.json();
        setSystemValues(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

 // Handle toggling between minimized and expanded states
 const handleDrawerToggle = () => {
  setIsMinimized((prev) => !prev); // Toggle between minimized and expanded
};

// Toggle expanding sub-options
const handleToggle = (optionName) => {
  setExpanded((prev) => (prev === optionName ? "" : optionName));
};

const isActive = (route) => location.pathname === route;
  const sidebarOptions = [
    {
      name: "Main Dashboard",
      icon: <ViewQuiltIcon sx={{ color: "#fff" }} />,
      route: "/layout/combineDash",
      subOptions: [],
    },
    {
      name: "Enquiry System",
      icon: <PersonSearchRoundedIcon sx={{ color: "#fff" }} />,
      show: systemValues?.enquirymanagementsystem,
      subOptions: [
        {
          name: "Enquiry Manager",
          icon: <DashboardIcon sx={{ color: "#fff" }} />,
          route: "/layout/Enquiry-manager", // Route for the manager
        },
      ],
    },
    {
      name: "Admission System",
      icon: <AddHomeRoundedIcon sx={{ color: "#fff" }} />,
      show: systemValues?.admissionmanagementsystem,
      subOptions: [
        {
          name: "Admission Manager",
          icon: <DashboardIcon sx={{ color: "#fff" }} />,
          route: "/layout/Admission-manager", // Route for the manager
        },
      ],
    },
    {
      name: "Income & Expense",
      icon: <CurrencyRupeeRoundedIcon sx={{ color: "#fff" }} />,
      show: systemValues?.incomeandexpense,
      subOptions: [
        {
          name: "Income Expense Manager",
          icon: <DashboardIcon sx={{ color: "#fff" }} />,
          route: "/layout/income-expense-manager", // Route for the manager
          show: systemValues?.incomeandexpense,
        },
      ],
    },
    {
      name: "Employee System",
      icon: <PeopleIcon sx={{ color: "#fff" }} />,
      show: systemValues?.employeemanagementsystem,
      subOptions: [
        {
          name: "Employee Manager",
          icon: <PersonIcon sx={{ color: "#fff" }} />,
          route: "/layout/employee-manager",
        },
        {
          name: "Attendance",
          icon: <SupervisorAccountRoundedIcon sx={{ color: "#fff" }} />,
          route: "/layout/attendance-manager",
        },
        {
          name: "Leave",
          icon: <WorkOffIcon sx={{ color: "#fff" }} />,
          route: "/layout/ManageLeave",
        },
        {
          name: "Salary",
          icon: <CurrencyRupeeRoundedIcon sx={{ color: "#fff" }} />,
          route: "/layout/employee-salary-manager",
        },
        {
          name: "Memo",
          icon: <NoteAltIcon sx={{ color: "#fff" }} />,
          route: "/layout/Memo-manager",
        },
        {
          name: "Notice",
          icon: <StickyNote2Icon sx={{ color: "#fff" }} />,
          route: "/layout/AddNotice",
        },
      ],
    },
    {
      name: "Student System",
      icon: <EmojiPeopleRoundedIcon sx={{ color: "#fff" }} />,
      show: systemValues?.studentmanagementsystem,
      subOptions: [
        {
          name: "Dashboard",
          route: "/layout/StudentDashboard",
          icon: <DashboardIcon sx={{ color: "#fff" }} />,
        },
        {
          name: "Student Form",
          route: "/layout/StudentForm",
          icon: <WorkspacesIcon sx={{ color: "#fff" }} />,
        },
        {
          name: "Student List",
          route: "/layout/StudentLists",
          icon: <FormatListBulletedIcon sx={{ color: "#fff" }} />,
        },
        {
          name: "Student Report",
          route: "/layout/StudentReport",
          icon: <AssessmentIcon sx={{ color: "#fff" }} />,
        },
        {
          name: "Student Request",
          route: "/layout/StudentRequest",
          icon: <DoneOutlineIcon sx={{ color: "#fff" }} />,
        },
        {
          name: "Add Fields",
          route: "/layout/ADDField",
          icon: <CategoryIcon sx={{ color: "#fff" }} />,
        },

        {
          name: "Fees System",
          icon: <AttachMoneyIcon sx={{ color: "#fff" }} />,
          route: "/layout/FeesDashboard",
        },
      ],
    },
    {
      name: "Classroom Management",
      icon: <SchoolRoundedIcon sx={{ color: "#fff" }} />,
      subOptions: [
        { name: "Classroom", icon: <AnnouncementIcon /> },
        { name: "Subject", icon: <SubjectIcon /> },
        { name: "Account", icon: <AccountCircleIcon /> },
        { name: "Timetable", icon: <CalendarMonthIcon /> },
        { name: "Teachers", icon: <GroupIcon /> },
        { name: "Students", icon: <Person /> },
        {
          name: "Attendance",
          icon: <NotificationsIcon />,
        },
        { name: "Homework", icon: <NotificationsIcon /> },
        { name: "Exam", icon: <NotificationsIcon /> },
        { name: "Result", icon: <NotificationsIcon /> },
      ],
    },
    {
      name: "Shipment System",
      icon: <PersonSearchRoundedIcon sx={{ color: "#fff" }} />,
      show: systemValues?.enquirymanagementsystem,
      subOptions: [
        {
          name: "Shipment Manager",
          icon: <DashboardIcon sx={{ color: "#fff" }} />,
          route: "/layout/shipment-manager", // Route for the manager
        },
      ],
    },
    {
      name: "Add Sub-Admin",
      icon: <AdminPanelSettingsIcon sx={{ color: "#fff" }} />,
      route: "/layout/subadmin",
      subOptions: [],
    },
    {
      name: "Help Desk",
      icon: <HelpIcon sx={{ color: "#fff" }} />,
      route: "/layout/helpDesk",
      subOptions: [],
    },
    {
      name: "Billing Section",
      icon: <PriceCheckIcon sx={{ color: "#fff" }} />,
      route: "/layout/bill",
      subOptions: [],
    },
    {
      name: "Settings",
      icon: <SettingsRoundedIcon sx={{ color: "#fff" }} />,
      route: "/layout/Settings",
      subOptions: [],
    },
  ];

  const filteredSidebarOptions = sidebarOptions.filter(
    (option) => option.show !== false
  );
  
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open
      sx={{
        width: isMinimized ? iconOnlyWidth : drawerWidth,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: isMinimized ? iconOnlyWidth : drawerWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor: "#3498DB",
        
        },
      }}
    >
      {/* Drawer Header with Toggle Button */}
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            marginLeft: "auto",
            color: "white",
              marginTop:"60px"
          }}
        >
          {isMinimized ? <MoreVertIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
  
      {/* Sidebar Options */}
      <Box sx={{ overflowY: "auto",marginTop:"-20px" }}>
        <List sx={{ color: "white" }}>
          {sidebarOptions.map((option, index) => (
            <div key={index}>
              <ListItem
                button
                onClick={() => handleToggle(option.name)}
                component={Link}
                to={option.route}
                sx={{
                  backgroundColor: isActive(option.route)
                    ? "#2980B9"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "#1F618D",
                  },
                }}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
  
                {/* Show option name only if not minimized */}
                {!isMinimized && (
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "normal",
                          fontSize: "12.5px",
                          marginLeft: "-20px",
                        }}
                      >
                        {option.name}
                      </Typography>
                    }
                  />
                )}
  
                {/* Dropdown Icon for options with sub-options */}
                {option.subOptions.length > 0 && (
                  <ListItemIcon>
                    {expanded === option.name ? (
                      <Remove sx={{ color: "red", marginLeft: "auto", }} />
                    ) : (
                      <Add sx={{ color: "#FFF", marginLeft: "auto", }} />
                    )}
                  </ListItemIcon>
                )}
              </ListItem>
  
              {/* Sub-options with collapse */}
              {!isMinimized && option.subOptions.length > 0 && (
                <Collapse
                  in={expanded === option.name}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {option.subOptions.map((subOption, subIndex) => (
                      <ListItem
                        key={subIndex}
                        button
                        component={Link}
                        to={subOption.route}
                        sx={{
                          pl: 4,
                          backgroundColor: isActive(subOption.route)
                            ? "#2980B9"
                            : "transparent",
                          "&:hover": {
                            backgroundColor: "#1F618D",
                            
                          },
                        }}
                      >
                        <ListItemIcon sx={{ml:"-8px"}}>{subOption.icon}</ListItemIcon>
  
                        {/* Sub-option text */}
                        {!isMinimized && (
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "11px",
                                  marginLeft: "-20px",
                                  fontWeight: "normal",
                                }}
                              >
                                {subOption.name}
                              </Typography>
                            }
                          />
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
export default Sidebar;