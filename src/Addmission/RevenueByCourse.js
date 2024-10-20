import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Grid, MenuItem, Select, Typography, FormControl, InputLabel, Paper, TextField } from "@mui/material";
import { Chart } from "react-google-charts";

const RevenueByCourse = () => {
  const [chartData, setChartData] = useState([["Course", "Revenue"]]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [institutecode] = useState(localStorage.getItem("institutecode") || ""); // Dynamic institute code from localStorage

  // Generate last 10 years dynamically
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(10), (val, index) => currentYear - index);

  // Months array to display in dropdown
  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!institutecode) {
        console.error("No institute code found in local storage");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8085/admissionRevenueByCourseMonthAndYear?institutecode=${institutecode}&month=${month}&year=${year}`
        );
        const data = res.data;
        console.log(data); // Debugging: Log API response

        const formattedData = data.map(({ course, totalRevenue }) => [course, totalRevenue]);

        if (formattedData.length === 0) {
          console.log("No data to display in the chart");
        }

        setChartData([["Course", "Revenue"], ...formattedData]);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [institutecode, month, year]); // Fetch data when month or year changes

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      {/* Dropdowns for Month and Year */}
      <Grid container spacing={2} justifyContent="center" alignItems={"center"} style={{ marginBottom: "20px" }} className="textField-root">
      <Typography variant="body1" gutterBottom>
        Revenue By Course
      </Typography>
        <Grid item xs={12} md={1.5}>
          <FormControl fullWidth>
         
            <TextField
            select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              label="Month"
              fullWidth
              size="small"
            >
              {months.map((monthOption) => (
                <MenuItem key={monthOption.value} value={monthOption.value}>
                  {monthOption.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={1.5}>
          <FormControl fullWidth>
          
            <TextField
            select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              label="Year"
              fullWidth
              size="small"
            >
              {years.map((yearOption) => (
                <MenuItem key={yearOption} value={yearOption}>
                  {yearOption}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>

      {/* Bar Chart */}
      <Grid container>
        <Grid item xs={12}>
          <Chart
            width={"100%"}
            height={"400px"}
            chartType="Bar"
            loader={<div>Loading Chart...</div>}
            data={chartData}
            options={{
              chart: {
               // title: "Admission Revenue by Course",
              },
              hAxis: {
                title: "Revenue",
              },
              vAxis: {
                title: "Course",
              },
              colors: [
                "#3498DB",
                "#3498DB"
              ],
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RevenueByCourse;
