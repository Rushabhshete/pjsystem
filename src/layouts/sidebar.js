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
} from "@mui/material";
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
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

const drawerWidth = 240;
const collapsedWidth = 60;

const Sidebar = () => {
  const [expanded, setExpanded] = useState({});
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [systemValues, setSystemValues] = useState(null);
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

  const handleDrawerToggle = () => {
    setOpen(!open);
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
      // show:
      //   systemValues?.incomeandexpense &&
      //   systemValues?.enquirymanagementsystem &&
      //   systemValues?.admissionmanagementsystem,
    },

    {
      name: "Enquiry System",
      icon: <PersonSearchRoundedIcon sx={{ color: "orange" }} />,
      show: systemValues?.enquirymanagementsystem, // Conditionally render based on API response
      subOptions: [
        {
          name: "Dashboard",
          route: "/layout/dashboard",
          icon: <DashboardIcon sx={{ color: "blue" }} />,
        },
        {
          name: "Add Inquiry",
          route: "/layout/add",
          icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Add Exam / Course",
          route: "/layout/exam",
          icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Add Source",
          route: "/layout/source",
          icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Add Conduct",
          route: "/layout/conduct",
          icon: <NoteAddIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Enquiry List",
          route: "/layout/report",
          icon: <AssessmentIcon sx={{ color: "#4682b4" }} />,
        },
      ],
    },
    {
      name: "Admission System",
      icon: <AddHomeRoundedIcon sx={{ color: "#FF1493" }} />,
      show: systemValues?.admissionmanagementsystem,
      subOptions: [
        {
          name: "Dashboard",
          route: "/layout/admission-dashboard",
          icon: <DashboardIcon sx={{ color: "blue" }} />,
        },
        {
          name: "Admission Form",
          route: "/layout/admission-form",
          icon: <PeopleIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Admission List",
          route: "/layout/students",
          icon: <RemoveRedEyeIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Add Cource/Exams",
          route: "/layout/add-course",
          icon: <AddToPhotosIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Admission Source",
          route: "/layout/admission-source",
          icon: <AodIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Admission Guide",
          route: "/layout/add-guide",
          icon: <LightbulbIcon sx={{ color: "#4682b4" }} />,
        },
      ],
    },
    {
      name: "Income  & Expense",
      icon: <CurrencyRupeeRoundedIcon sx={{ color: "green" }} />,
      show: systemValues?.incomeandexpense,
      subOptions: [
        {
          name: "Dashboard",
          route: "/layout/Income-Expense-dashboard",
          icon: <DashboardIcon sx={{ color: "blue" }} />,
        },
        {
          name: "Add income-expense",
          route: "/layout/AddIncomeExpense",
          icon: <PlaylistAddIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Income-Expense List",
          route: "/layout/incomeExpenseList",
          icon: <FormatListBulletedIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Add Category",
          route: "/layout/AddCategory",
          icon: <CategoryIcon sx={{ color: "#4682b4" }} />,
        },
        {
          name: "Add User",
          route: "/layout/AddUser",
          icon: <PersonSearchRoundedIcon sx={{ color: "#4682b4" }} />,
        },
      ],
    },

    {
      name: "Employee System",
      icon: <PeopleIcon sx={{ color: "blue" }} />,
      show: systemValues?.employeemanagementsystem, // Conditionally render based on API response

      subOptions: [
        {
          name: "Employee",
          icon: <Person sx={{ color: "#4682b4" }} />,
          subSubOptions: [
            {
              name: "Dashboard",
              route: "/layout/empDashboard",
              icon: <DashboardIcon sx={{ color: "blue" }} />,
            },
            {
              name: "Add Employee",
              route: "/layout/empAdd",
              icon: <PlaylistAddIcon sx={{ color: "#76A7FA" }} />,
            },
            {
              name: "Employee List",
              route: "/layout/empList",
              icon: <FormatListBulletedIcon sx={{ color: "#76A7FA" }} />,
            },
            {
              name: "Report",
              route: "/layout/empReport",
              icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
            },
            {
              name: "Add Category",
              route: "/layout/addEmpcategory",
              icon: <PlaylistAddIcon sx={{ color: "#76A7FA" }} />,
            },
            {
              name: "Add Department",
              route: "/layout/AddDepartment",
              icon: <PlaylistAddIcon sx={{ color: "#76A7FA" }} />,
            },
            {
              name: "Add Holiday",
              route: "/layout/ManageHoliday",
              icon: <PlaylistAddIcon sx={{ color: "#76A7FA" }} />,
            },
          ],
        },
        {
          name: "Attendance",
          icon: <SupervisorAccountRoundedIcon sx={{ color: "#4682b4" }} />,
          subSubOptions: [
            {
              name: "Attendance Dashboard",
              route: "/layout/TodaysAttendance",
              icon: <DashboardIcon sx={{ color: "blue" }} />,
            },
            {
              name: "Attendance report",
              route: "/layout/ManageAttendance",
              icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
            },
          ],
        },
        {
          name: "Leave",
          icon: <TimeToLeaveIcon sx={{ color: "#4682b4" }} />,
          subSubOptions: [
            // {
            //   name: "Dashboard",
            //   // route: "/employee/hr/add",
            //   icon: <DashboardIcon />,
            // },
            {
              name: "Manage Leave",
              route: "/layout/ManageLeave",
              icon: <CategoryIcon sx={{ color: "#76A7FA" }} />,
            },
            // {
            //   name: "Delete Employee",
            //   // route: "/employee/hr/delete",
            //   icon: <NotificationsIcon />,
            // },
          ],
        },
        {
          name: "Salary",
          icon: <AttachMoneyIcon sx={{ color: "#4682b4" }} />,
          subSubOptions: [
            {
              name: "Dashboard",
              route: "/layout/SalaryDashboard",
              icon: <DashboardIcon sx={{ color: "blue" }} />,
            },
            {
              name: "Employee Salary",
              route: "/layout/EmpDetails",
              icon: <CurrencyRupeeIcon sx={{ color: "#76A7FA" }} />,
            },
            {
              name: "Report",
              route: "/layout/SalaryTable",
              icon: <AssessmentIcon sx={{ color: "#76A7FA" }} />,
            },
          ],
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
      icon: <EmojiPeopleRoundedIcon sx={{ color: "brown" }} />,
      show: systemValues?.studentmanagementsystem,
      subOptions: [
        { name: "Dashboard",
          route: "/layout/StudentDashboard",
          icon: <DashboardIcon /> 
        },
        { name: "Student Form", 
          route:"/layout/StudentForm",
          icon: <WorkspacesIcon /> },
        {
          name: "Student List",
          route: "/layout/StudentLists",
          icon: <FormatListBulletedIcon />,
        },
        {
          name: "Student Report",
          route: "/layout/StudentReport",
          icon: <AssessmentIcon />,
        },
        {
          name: "Student Request",
          route: "/layout/StudentRequest",
          icon: <DoneOutlineIcon />,
        },
        { name: "Add Fields",
          route:"/layout/ADDField",
          icon: <CategoryIcon /> },

          {
            name: "Fees System",
            icon: <AttachMoneyIcon sx={{ color: "#4682b4" }} />,
            subSubOptions: [
              {
                name: "Dashboard",
                route: "/layout/FeesDashboard",
                icon: <DashboardIcon sx={{ color: "blue" }} />,
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
      icon: <SchoolRoundedIcon sx={{ color: "purple" }} />,

      subOptions: [
        { name: "Classroom", icon: <AnnouncementIcon /> },
        { name: "Subject", icon: <SubjectIcon /> },
        { name: "Account", icon: <AccountCircleIcon /> },
        { name: "Timetable", icon: <CalendarMonthIcon /> },
        { name: "Teachers", icon: <GroupIcon /> },
        { name: "Students", icon: <Person /> },
        {
          name: "Attendance",
          // route: "/memo/delete",
          icon: <NotificationsIcon />,
        },
        { name: "Homework", icon: <NotificationsIcon /> },
        { name: "Exam", icon: <NotificationsIcon /> },
        { name: "Result", icon: <NotificationsIcon /> },
      ],
    },
    // {
    //   name: "Memo / Notification",
    //   icon: <AnnouncementIcon sx={{ color: "purple" }} />,
    //   subOptions: [
    //     {
    //       name: "Memo",
    //       route: "/layout/memo",
    //       icon: <AnnouncementIcon sx={{ color: "blue" }} />,
    //     },
    //     {
    //       name: "Manage Memo",
    //       route: "/layout/manage-memo",
    //       icon: <NotificationsIcon sx={{ color: "#4682b4" }} />,
    //     },
    //     {
    //       name: "Manage Notification",
    //       route: "/layout/manage-notifications",
    //       icon: <NotificationsIcon sx={{ color: "#4682b4" }} />,
    //     },
    //   ],
    // },
    {
      name: "Add Sub-Admin",
      icon: <AdminPanelSettingsIcon color="primary" />,
      route: "/layout/subadmin",
      subOptions: [],
    },
    {
      name: "Help Desk",
      icon: <HelpIcon color="success" />,
      route: "/layout/helpDesk",
      subOptions: [],
    },
    {
      name: "Billing Section",
      icon: <PriceCheckIcon color="success" />,
      route: "/layout/bill",
      subOptions: [],
    },
    {
      name: "Settings",
      icon: <SettingsRoundedIcon color="black" />,
      route: "/layout/Settings",
      subOptions: [],
    },
    // Add more options similarly
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
          overflowX: "hidden", // Prevent horizontal scroll
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ marginLeft: "auto", marginTop: "60px" }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Box sx={{ overflowY: "auto" }}>
        <List>
          {filteredSidebarOptions.map((option, index) => (
            <div key={index}>
              <ListItem
                button
                onClick={() => handleToggle(option.name)}
                component={Link}
                to={option.route}
                sx={{
                  backgroundColor: isActive(option.route)
                    ? "rgba(0, 0, 0, 0.05)" // Subtle light gray for active state
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive(option.route)
                      ? "rgba(0, 0, 0, 0.05)" // Consistent with active state
                      : "rgba(0, 0, 0, 0.02)", // Even softer gray on hover for inactive items
                    marginLeft: "-10px",
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
                          fontWeight: "bold",
                          fontSize: "12px",
                          marginLeft: "-20px",
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
                      <Add sx={{ color: "green" }} />
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
                              marginLeft: "-10px",
                            },
                          }}
                        >
                          <ListItemIcon>{subOption.icon}</ListItemIcon>
                          {open && (
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "13px", marginLeft: "-20px" }}
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