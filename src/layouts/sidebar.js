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
import logo from "../img/logo.jpg";

import { Link } from "react-router-dom";
import {
  Add,
  Remove,
  Dashboard as DashboardIcon,
  Announcement as AnnouncementIcon,
  People as PeopleIcon,
  Person,
  AddIcCallOutlined,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import NotificationsIcon from "@mui/icons-material/Notifications";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import AddHomeRoundedIcon from "@mui/icons-material/AddHomeRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import EmojiPeopleRoundedIcon from "@mui/icons-material/EmojiPeopleRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupervisorAccountRoundedIcon from "@mui/icons-material/SupervisorAccountRounded";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import CategoryIcon from "@mui/icons-material/Category";
import SubjectIcon from "@mui/icons-material/Subject";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import GroupIcon from "@mui/icons-material/Group";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import AodIcon from "@mui/icons-material/Aod";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import HelpIcon from "@mui/icons-material/Help";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import Header from "./header";

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = () => {
  const [expanded, setExpanded] = useState({});
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [systemValues, setSystemValues] = useState(null);
  const institutecode = () => localStorage.getItem("institutecode");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const handleDrawerToggle = () => {
    setOpen(!open);
    setIsSidebarCollapsed((prev) => !prev);
  };

  const isActive = (route) => location.pathname === route;

  const handleToggle = (option) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [option]: !prevExpanded[option],
    }));
  };

  const sidebarOptions = [
    {
      name: "Main Dashboard",
      icon: <DashboardIcon color="primary" />,
      route: "/layout/combineDash",
      subOptions: [],
    },
    {
      name: "Enquiry System",
      icon: <PersonSearchRoundedIcon color="primary" />,
      show: systemValues?.enquirymanagementsystem,
      subOptions: [
        {
          name: "Enquiry Manager",
          icon: <DashboardIcon color="primary" />,
          route: "/layout/Enquiry-manager", // Route for the manager
         // show: systemValues?.incomeandexpense,
        },

      ],
    },
    {
      name: "Admission System",
      icon: <AddHomeRoundedIcon color="primary" />,
      show: systemValues?.admissionmanagementsystem,
      subOptions: [
        {
          name: "Admission Manager",
          icon: <CurrencyRupeeRoundedIcon color="primary" />,
          route: "/layout/Admission-manager", // Route for the manager
         // show: systemValues?.incomeandexpense,
        },
   
      ],
    },
    {
      name: "Income & Expense",
      icon: <CurrencyRupeeRoundedIcon color="primary" />,
      show: systemValues?.incomeandexpense,
      subOptions: [

        {
          name: "Income Expense Manager",
          icon: <CurrencyRupeeRoundedIcon color="primary" />,
          route: "/layout/income-expense-manager", // Route for the manager
          show: systemValues?.incomeandexpense,
        },
   
      ],
    },
    {
      name: "Employee System",
      icon: <PeopleIcon color="primary" />,
      show: systemValues?.employeemanagementsystem,
      subOptions: [
        {
          name: "Employee Manager",
          icon: <CurrencyRupeeRoundedIcon color="primary" />,
          route: "/layout/Employee-manager",
        },
        {
          name: "Attendance",
          icon: <SupervisorAccountRoundedIcon sx={{ color: "#4682b4" }} />,
          route: "/layout/Attendance-manager",
        },
        {
          name: "Leave",
          icon: <CategoryIcon sx={{ color: "#4682b4" }} />,
          route: "/layout/ManageLeave",
         
        },
        {
          name: "Salary",
          icon: <AttachMoneyIcon sx={{ color: "#4682b4" }} />,
          route: "/layout/EmployeeSalaryManager",
        
        },
        {
          name: "Memo",
          icon: <NoteAltIcon sx={{ color: "#4682b4" }} />,
          subSubOptions: [
            {
              name: "Add Memo",
              route: "/layout/AddMemo",
              icon: <MapsUgcIcon sx={{ color: "#76A7FA" }} />,
            },
            {
              name: "Manage Memo",
              route: "/layout/ManageEmpMemo",
              icon: <CurrencyRupeeIcon sx={{ color: "#76A7FA" }} />,
            }
          ]
        },
        {
          name: "Notice",
          icon: <StickyNote2Icon sx={{ color: "#4682b4" }} />,
          subSubOptions: [
            {
              name: "Add Notice",
              route: "/layout/AddNotice",
              icon: <MapsUgcIcon sx={{ color: "#76A7FA" }} />,
            }
          ]
        },
      ],
    },
    {
      name: "Student System",
      icon: <EmojiPeopleRoundedIcon color="primary" />,
      show: systemValues?.studentmanagementsystem,
      subOptions: [
        { name: "Dashboard",
          route: "/layout/StudentDashboard",
          icon: <DashboardIcon sx={{ color: "#4682b4" }}  /> 
        },
        { name: "Student Form", 
          route:"/layout/StudentForm",
          icon: <WorkspacesIcon sx={{ color: "#4682b4" }}  /> },
        {
          name: "Student List",
          route: "/layout/StudentLists",
          icon: <FormatListBulletedIcon sx={{ color: "#4682b4" }}  />,
        },
        {
          name: "Student Report",
          route: "/layout/StudentReport",
          icon: <AssessmentIcon sx={{ color: "#4682b4" }}  />,
        },
        {
          name: "Student Request",
          route: "/layout/StudentRequest",
          icon: <DoneOutlineIcon sx={{ color: "#4682b4" }} />,
        },
        { name: "Add Fields",
          route:"/layout/ADDField",
          icon: <CategoryIcon sx={{ color: "#4682b4" }} /> },

          {
            name: "Fees System",
            icon: <AttachMoneyIcon sx={{ color: "#4682b4" }} />,
            subSubOptions: [
              {
                name: "Dashboard",
                route: "/layout/FeesDashboard",
                icon: <DashboardIcon sx={{ color: "#4682b4" }} />,
              },
              {
                name: "Fees Invoice",
                route: "/layout/FeeInvoice",
                icon: <CurrencyRupeeIcon sx={{ color: "#76A7FA" }} />,
              },
              {
                name: "Fees Invoice List",
                route: "/layout/InvoiceList",
                icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
              },
              {
                name: "Add Fees",
                route: "/layout/AddFee",
                icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
              },
              {
                name: "Fees Table",
                route: "/layout/FeeTable",
                icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
              },
              {
                name: "Add Medium",
                route: "/layout/AddMedium",
                icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
              },
              {
                name: "Fees Report",
                route: "/layout/FeeReport",
                icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
              },
            ],
          },
      ],
    },
    {
      name: "Classroom Management",
      icon: <SchoolRoundedIcon color="primary" />,
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
      name: "Add Sub-Admin",
      icon: <AdminPanelSettingsIcon color="primary" />,
      route: "/layout/subadmin",
      subOptions: [],
    },
    {
      name: "Help Desk",
      icon: <HelpIcon color="primary" />,
      route: "/layout/helpDesk",
      subOptions: [],
    },
    {
      name: "Billing Section",
      icon: <PriceCheckIcon color="primary" />,
      route: "/layout/bill",
      subOptions: [],
    },
    {
      name: "Settings",
      icon: <SettingsRoundedIcon color="primary" />,
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
        width: open ? drawerWidth : collapsedWidth,
        transition: "width 0.3s",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          backgroundColor:"black",
    
        },
      }}
    >
     
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ marginLeft: "auto", marginTop: "60px",color:"white",marginBottom:"-30px" }}
          
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Box sx={{ overflowY: "auto" }}>
        <List sx={{color:"white"}}>
          {filteredSidebarOptions.map((option, index) => (
            <div key={index}>
              <ListItem
                button
                onClick={() => handleToggle(option.name)}
                component={Link}
                to={option.route}
                sx={{
                  backgroundColor: isActive(option.route)
                    ? "rgba(0, 0, 0, 0.05)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive(option.route)
                      ? "rgba(0, 0, 0, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                 //   marginLeft: "-10px",
          
                  },
                }}
              >
                <ListItemIcon>{option.icon}</ListItemIcon>
                {open && (
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "normal", // Set to normal instead of bold
                          fontSize: "13px", // Increase size by 3px from 12px to 15px
                          marginLeft: "-20px",
                          fontFamily:  "Arial" // You can modify the font as desired
                        }}
                      >
                        {option.name}
                      </Typography>
                    }
                  />
                )}
                {option.subOptions.length > 0 && (
                  <ListItemIcon>
                    {expanded[option.name] ? (
                      <Remove sx={{ color: "red" }} />
                    ) : (
                      <Add sx={{ color: "#269DD7" }} />
                    )}
                  </ListItemIcon>
                )}
              </ListItem>
              {open && option.subOptions.length > 0 && (
                <Collapse
                  in={expanded[option.name]}
                  timeout="auto"
                  unmountOnExit
                  sx={{ transition: "all 0.3s ease" }}
                >
                  <List component="div" disablePadding>
                    {option.subOptions.map((subOption, subIndex) => (
                      <div key={subIndex}>
                        <ListItem
                          button
                          onClick={() => handleToggle(subOption.name)}
                          component={Link}
                          to={subOption.route}
                          sx={{
                            pl: 4,
                            backgroundColor: isActive(subOption.route)
                              ? "rgba(0, 0, 0, 0.1)"
                              : "transparent",
                            "&:hover": {
                              backgroundColor: isActive(subOption.route)
                                ? "rgba(0, 0, 0, 0.1)"
                                : "rgba(0, 0, 0, 0.05)",
                             // marginLeft: "-10px",
                            },
                          }}
                        >
                          <ListItemIcon>{subOption.icon}</ListItemIcon>
                          {open && (
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "12px", marginLeft: "-20px", fontWeight: "normal", fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}
                                >
                                  {subOption.name}
                                </Typography>
                              }
                            />
                          )}
                          {subOption.subSubOptions?.length > 0 && (
                            <ListItemIcon>
                              {expanded[subOption.name] ? (
                                <Remove sx={{ color: "red" }} />
                              ) : (
                                <Add sx={{ color: "green" }} />
                              )}
                            </ListItemIcon>
                          )}
                        </ListItem>
                        {open && subOption.subSubOptions?.length > 0 && (
                          <Collapse
                            in={expanded[subOption.name]}
                            timeout="auto"
                            unmountOnExit
                            sx={{ transition: "all 0.3s ease" }}
                          >
                            <List component="div" disablePadding>
                              {subOption.subSubOptions.map(
                                (subSubOption, subSubIndex) => (
                                  <ListItem
                                    button
                                    key={subSubIndex}
                                    component={Link}
                                    to={subSubOption.route}
                                    sx={{
                                      pl: 8,
                                      backgroundColor: isActive(
                                        subSubOption.route
                                      )
                                        ? "rgba(0, 0, 0, 0.1)"
                                        : "transparent",
                                      "&:hover": {
                                        backgroundColor: isActive(
                                          subSubOption.route
                                        )
                                          ? "rgba(0, 0, 0, 0.1)"
                                          : "rgba(0, 0, 0, 0.05)",
                                      },
                                    }}
                                  >
                                    <ListItemIcon sx={{ marginLeft: "-20px" }}>
                                      {subSubOption.icon}
                                    </ListItemIcon>
                                    {open && (
                                      <ListItemText
                                        primary={
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              fontSize: "12px",
                                              marginLeft: "-20px",
                                              fontWeight: "normal",
                                              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
                                            }}
                                          >
                                            {subSubOption.name}
                                          </Typography>
                                        }
                                      />
                                    )}
                                  </ListItem>
                                )
                              )}
                            </List>
                          </Collapse>
                        )}
                      </div>
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
};

export default Sidebar;
