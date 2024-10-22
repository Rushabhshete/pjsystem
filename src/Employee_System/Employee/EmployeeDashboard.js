// import React, { useState, useEffect } from 'react';
// import { Container, Typography, Grid, Paper, MenuItem, FormControl, TextField, Card, CardContent, Box} from '@mui/material';
// import { Chart } from 'react-google-charts';
// import AttenDash from '../../layouts/AttenDash';

// const EmployeeDashboard = () => {
//     const [employeeCount, setEmployeeCount] = useState(0);
//     const [joinedCount, setJoinedCount] = useState(0);
//     const [terminatedCount, setTerminatedCount] = useState(0);
//     const [selectedApi, setSelectedApi] = useState('All');
//     const [departmentData, setDepartmentData] = useState([]);
//     const [categoryData, setCategoryData] = useState([]);
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [error, setError] = useState(null);
//     const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

//     useEffect(() => {
//         const fetchInitialData = async () => {
//             try {
//                 const response = await fetch(`http://localhost:8082/getNonDeleted?institutecode=${institutecode}`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 updateEmployeeData(data);
//             } catch (error) {
//                 setError(error.toString());
//             }
//         };

//         fetchInitialData();
//     }, [institutecode]);

//     useEffect(() => {
//         const fetchStatusData = async (status) => {
//             try {
//                 const response = await fetch(`http://localhost:8082/employees/status/${status}?institutecode=${institutecode}`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 return data.length;
//             } catch (error) {
//                 setError(error.toString());
//                 return 0;
//             }
//         };

//         const fetchAllStatusData = async () => {
//             const joinedData = await fetchStatusData('Joined');
//             const terminatedData = await fetchStatusData('Terminated');
//             setJoinedCount(joinedData);
//             setTerminatedCount(terminatedData);
//         };

//         fetchAllStatusData();
//     }, [institutecode]);

//     useEffect(() => {
//         const apiUrls = {
//             'All': `http://localhost:8082/getNonDeleted?institutecode=${institutecode}`,
//             '7Days': `http://localhost:8082/employees/last7days?institutecode=${institutecode}`,
//             '30Days': `http://localhost:8082/employees/lastMonth?institutecode=${institutecode}`,
//             '365Days': `http://localhost:8082/employees/lastYear?institutecode=${institutecode}`,
//         };

//         const fetchCustomDateRangeData = async (startDate, endDate) => {
//             try {
//                 const response = await fetch(`http://localhost:8082/getNonDeleted?institutecode=${institutecode}`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();

//                 const filteredData = data.filter(emp => {
//                     const empDate = new Date(emp.joiningDate);
//                     return empDate >= new Date(startDate) && empDate <= new Date(endDate);
//                 });
//                 updateEmployeeData(filteredData);
//             } catch (error) {
//                 setError(error.toString());
//             }
//         };

//         if (selectedApi === 'byDateRange' && startDate && endDate) {
//             fetchCustomDateRangeData(startDate, endDate);
//         } else if (apiUrls[selectedApi]) {
//             fetch(apiUrls[selectedApi])
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! status: ${response.status}`);
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     updateEmployeeData(data);
//                 })
//                 .catch(error => {
//                     setError(error.toString());
//                 });
//         }
//     }, [selectedApi, startDate, endDate, institutecode]);

//     const updateEmployeeData = (data) => {
//         setEmployeeCount(data.length);
//         const joined = data.filter(emp => emp.status === 'Joined').length;
//         const terminated = data.filter(emp => emp.status === 'Terminated').length;
//         setJoinedCount(joined);
//         setTerminatedCount(terminated);

//         const departmentCount = {};
//         const categoryCount = {};
//         data.forEach(emp => {
//             const dept = emp.department;
//             const category = emp.employeecategory;
//             if (dept) {
//                 departmentCount[dept] = (departmentCount[dept] || 0) + 1;
//             }
//             if (category) {
//                 categoryCount[category] = (categoryCount[category] || 0) + 1;
//             }
//         });
//         setDepartmentData(Object.entries(departmentCount).map(([dept, count]) => [dept, count]));
//         setCategoryData(Object.entries(categoryCount).map(([category, count]) => [category, count]));
//     }

//     if (error) {
//         return (
//             <Container maxWidth="lg">
//                 <Typography variant="h6" color="error">
//                     {error}
//                 </Typography>
//             </Container>
//         );
//     }

//     const departmentChartData = [
//         ['Department', 'Employee Count', { role: 'style' }],
//         ...(departmentData.length ? departmentData.map(([dept, count], index) => {
//             const colors = ['#3498DB', '#FF6F61', '#F9E79F',];
//             return [dept, count, colors[index % colors.length]];
//         }) : [['No Data', 0, 'color: #DDD']])
//     ];

//     const departmentChartOptions = {
//        // title: 'Employee Distribution by Department',
//         vAxis: { title: 'Employee Count' },
//         hAxis: { title: 'Department' },
//         legend: 'none',
//         chartArea: { width: '70%', height: '70%' },
//         bar: { groupWidth: '75%' },
//     };

//     const categoryChartData = [
//         ['Category', 'Employee Count', { role: 'style' }],
//         ...(categoryData.length ? categoryData.map(([category, count], index) => {
//             const colors = ['#F9E79F', '#FF6F61', '#3498DB',];
//             return [category, count, colors[index % colors.length]];
//         }) : [['No Data', 0, 'color: #DDD']])
//     ];

//     const categoryChartOptions = {
//       //  title: 'Employee Distribution by Category',
//         vAxis: { title: 'Employee Count' },
//         hAxis: { title: 'Category' },
//         legend: 'none',
//         chartArea: { width: '70%', height: '70%' },
//         bar: { groupWidth: '75%' },
//     };

//     return (
//         <div maxWidth="lg">
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={8} container spacing={2}>
//                     <Grid item xs={6} md={4}>
//                         <Card style={{ backgroundColor: '#F9E79F', borderRadius:'15px' }}>
//                             <CardContent>
//                                 <Typography variant="h6">Total Employee</Typography>
//                                 <Typography variant="h4">{employeeCount}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={6} md={4}>
//                         <Card style={{ backgroundColor: '#FF6F61', borderRadius:'15px' }}>
//                             <CardContent>
//                                 <Typography variant="h6">Joined</Typography>
//                                 <Typography variant="h4">{joinedCount}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                     <Grid item xs={6} md={4}>
//                         <Card style={{ backgroundColor: '#3498DB', borderRadius:'15px' }}>
//                             <CardContent>
//                                 <Typography variant="h6">Terminated</Typography>
//                                 <Typography variant="h4">{terminatedCount}</Typography>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//                 <Grid item xs={12} md={4} container spacing={2}>
//     <Grid item xs={12}>
//         <FormControl fullWidth>
//             <TextField
//                 select
//                 label="Select"
//                 value={selectedApi}
//                 onChange={(e) => setSelectedApi(e.target.value)}
//             >
//                 <MenuItem value="All">All</MenuItem>
//                 <MenuItem value="7Days">Last 7 Days</MenuItem>
//                 <MenuItem value="30Days">Last 30 Days</MenuItem>
//                 <MenuItem value="365Days">Last 365 Days</MenuItem>
//                 <MenuItem value="byDateRange">Custom Date</MenuItem>
//             </TextField>
//         </FormControl>
//         {selectedApi === 'byDateRange' && (
//             <Grid container spacing={2} style={{ marginTop: '16px' }}>
//                 <Grid item xs={6}>
//                     <FormControl fullWidth>
//                         <TextField
//                             type="date"
//                             label="Start Date"
//                             value={startDate}
//                             onChange={(e) => setStartDate(e.target.value)}
//                             InputLabelProps={{ shrink: true }}
//                         />
//                     </FormControl>
//                 </Grid>
//                 <Grid item xs={6}>
//                     <FormControl fullWidth>
//                         <TextField
//                             type="date"
//                             label="End Date"
//                             value={endDate}
//                             onChange={(e) => setEndDate(e.target.value)}
//                             InputLabelProps={{ shrink: true }}
//                         />
//                     </FormControl>
//                 </Grid>
//             </Grid>
//         )}
//     </Grid>
// </Grid>

//                 <Grid item xs={12} md={6}>
//                     <Paper elevation={3} style={{ padding: '16px' }}>
//                         <Typography variant="h6">Department Chart</Typography>
//                         <Chart
//                             chartType="ColumnChart"
//                             data={departmentChartData}
//                             options={departmentChartOptions}
//                             width="100%"
//                             height="400px"
//                         />
//                     </Paper>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <Paper elevation={3} style={{ padding: '16px' }}>
//                         <Typography variant="h6">Category Chart</Typography>
//                         <Chart
//                             chartType="ColumnChart"
//                             data={categoryChartData}
//                             options={categoryChartOptions}
//                             width="100%"
//                             height="400px"
//                         />
//                     </Paper>
//                 </Grid>
//             </Grid>
//   <AttenDash />
//         </div>
//     );
// };

// export default EmployeeDashboard;

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  TextField,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import AttenDash from "../../layouts/AttenDash";
import Department from "./AddDepartment";
import { Category } from "@mui/icons-material";

const EmployeeDashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [joinedCount, setJoinedCount] = useState(0);
  const [terminatedCount, setTerminatedCount] = useState(0);
  const [selectedApi, setSelectedApi] = useState("All");
  const [departmentData, setDepartmentData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8082/getNonDeleted?institutecode=${institutecode}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateEmployeeData(data);
      } catch (error) {
        setError(error.toString());
      }
    };

    fetchInitialData();
  }, [institutecode]);

  useEffect(() => {
    const fetchStatusData = async (status) => {
      try {
        const response = await fetch(
          `http://localhost:8082/employees/status/${status}?institutecode=${institutecode}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.length;
      } catch (error) {
        setError(error.toString());
        return 0;
      }
    };

    const fetchAllStatusData = async () => {
      const joinedData = await fetchStatusData("Joined");
      const terminatedData = await fetchStatusData("Terminated");
      setJoinedCount(joinedData);
      setTerminatedCount(terminatedData);
    };

    fetchAllStatusData();
  }, [institutecode]);

  useEffect(() => {
    const apiUrls = {
      All: `http://localhost:8082/getNonDeleted?institutecode=${institutecode}`,
      "7Days": `http://localhost:8082/employees/last7days?institutecode=${institutecode}`,
      "30Days": `http://localhost:8082/employees/lastMonth?institutecode=${institutecode}`,
      "365Days": `http://localhost:8082/employees/lastYear?institutecode=${institutecode}`,
    };

    const fetchCustomDateRangeData = async (startDate, endDate) => {
      try {
        const response = await fetch(
          `http://localhost:8082/getNonDeleted?institutecode=${institutecode}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const filteredData = data.filter((emp) => {
          const empDate = new Date(emp.joiningDate);
          return empDate >= new Date(startDate) && empDate <= new Date(endDate);
        });
        updateEmployeeData(filteredData);
      } catch (error) {
        setError(error.toString());
      }
    };

    if (selectedApi === "byDateRange" && startDate && endDate) {
      fetchCustomDateRangeData(startDate, endDate);
    } else if (apiUrls[selectedApi]) {
      fetch(apiUrls[selectedApi])
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          updateEmployeeData(data);
        })
        .catch((error) => {
          setError(error.toString());
        });
    }
  }, [selectedApi, startDate, endDate, institutecode]);

  const updateEmployeeData = (data) => {
    setEmployeeCount(data.length);
    const joined = data.filter((emp) => emp.status === "Joined").length;
    const terminated = data.filter((emp) => emp.status === "Terminated").length;
    setJoinedCount(joined);
    setTerminatedCount(terminated);

    const departmentCount = {};
    const categoryCount = {};
    data.forEach((emp) => {
      const dept = emp.department;
      const category = emp.employeecategory;
      if (dept) {
        departmentCount[dept] = (departmentCount[dept] || 0) + 1;
      }
      if (category) {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      }
    });
    setDepartmentData(
      Object.entries(departmentCount).map(([dept, count]) => ({
        department: dept,
        Department: count,
      }))
    );
    setCategoryData(
      Object.entries(categoryCount).map(([category, count]) => ({
        category: category,
        Category: count,
      }))
    );
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <div>
      <Paper
        sx={{
          padding: "16px",

          borderRadius: "10px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} container spacing={2}>
            <Grid item xs={6} md={4}>
              <Card
                style={{
                  backgroundColor: "#F9E79F",
                  borderRadius: "15px",
                  fontWeight: "bold",
                }}
              >
                <CardContent>
                  <Typography variant="h7">Total Employee</Typography>
                  <Typography variant="h5">{employeeCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={4}>
              <Card
                style={{
                  backgroundColor: "#FF6F61",
                  borderRadius: "15px",
                  fontWeight: "bold",
                }}
              >
                <CardContent>
                  <Typography variant="h7">Joined</Typography>
                  <Typography variant="h5">{joinedCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={4}>
              <Card
                style={{
                  backgroundColor: "#3498DB",
                  borderRadius: "15px",
                  fontWeight: "bold",
                }}
              >
                <CardContent>
                  <Typography variant="h7">Terminated</Typography>
                  <Typography variant="h5">{terminatedCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} md={4} container spacing={2} className="textField-root">
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  select
                  size="small"
                  label="Select"
                  value={selectedApi}
                  onChange={(e) => setSelectedApi(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="7Days">Last 7 Days</MenuItem>
                  <MenuItem value="30Days">Last 30 Days</MenuItem>
                  <MenuItem value="365Days">Last 365 Days</MenuItem>
                  <MenuItem value="byDateRange">Custom Date</MenuItem>
                </TextField>
              </FormControl>
              {selectedApi === "byDateRange" && (
                <Grid container spacing={2} style={{ marginTop: "10px" }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <TextField
                        type="date"
                        label="Start Date"
                        size="small"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <TextField
                      size="small"
                        type="date"
                        label="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} sx={{ height: "450px" }}>
            <Typography variant="body1" textAlign={"center"}>
              Department Chart
            </Typography>
            <ResponsiveBar
              data={departmentData}
              keys={["Department"]}
              indexBy="department"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              layout="vertical"
              colors={() => "#3498DB"} // Set color for department bars
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: "middle",
                legendOffset: 32,
                tickValues: [], // Add this line to remove labels from x-axis
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Department",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              role="application"
              ariaLabel="Department Chart"
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ height: "450px" }}>
            <Typography variant="body1" textAlign={"center"}>
              Category Chart
            </Typography>
            <ResponsiveBar
              data={categoryData}
              keys={["Category"]}
              indexBy="category"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              layout="vertical"
              colors={() => "#FF6F61"} // Set color for category bars
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legendPosition: "middle",
                legendOffset: 32,
                tickValues: [], // Add this line to remove labels from x-axis
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Category",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              role="application"
              ariaLabel="Category Chart"
            />
          </Grid>
        </Grid>
      </Paper>
      <AttenDash />
    </div>
  );
};

export default EmployeeDashboard;
