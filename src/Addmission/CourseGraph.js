import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { Chart } from "react-google-charts";

const CourseByGraph = () => {
  const [chartData, setChartData] = useState([["Course Name", "Count"]]);
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
    const fetchCourseData = async () => {
      if (!institutecode) {
        console.error("No institute code found in local storage");
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8085/getAdmissionsCountByCourseAndDate?institutecode=${institutecode}&month=${month}&year=${year}`
        );
        const data = res.data;
        console.log(data); // Debugging: Log API response

        const formattedData = Object.entries(data).map(
          ([courseName, count]) => [courseName, count]
        );

        if (formattedData.length === 0) {
          console.log("No data to display in the chart");
        }

        setChartData([["Course Name", "Count"], ...formattedData]);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [institutecode, month, year]); // Fetch data when month or year changes

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      {/* Dropdowns for Month and Year */}
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems={"center"}
        style={{ marginBottom: "20px" }}
        className="textField-root"
      >
        <Typography variant="body1">Admissions by Course</Typography>

        <Grid item xs={12} md={3}>
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
        </Grid>

        <Grid item xs={12} md={3}>
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
        </Grid>
      </Grid>

      {/* Chart */}
      <Grid>
        <Chart
          width={"100%"}
          height={"400px"}
          chartType="PieChart"
          loader={<div>Loading Chart...</div>}
          data={chartData}
          options={{
            //  title: "Admissions by Course",
            is3D: true,
            colors: ["#3498DB", "#FF6F61", "#F9E79F"],
          }}
        />
      </Grid>
    </div>
  );
};

export default CourseByGraph;
