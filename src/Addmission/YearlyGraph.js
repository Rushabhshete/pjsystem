// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   CircularProgress,
//   TextField,
//   MenuItem,
//   Grid,
//   Paper,
//   Typography,
// } from "@mui/material";
// import { Chart } from "react-google-charts";

// const YearlyGraph = () => {
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [chartData, setChartData] = useState([["Date", "Admissions"]]);
//   const [loading, setLoading] = useState(true);
//   const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
//   // Month options from 1 to 12
//   const months = Array.from({ length: 12 }, (_, i) => i + 1);

//   useEffect(() => {
//     const fetchMonthlyData = async () => {
//       setLoading(true);
//       try {
//         const institutecode = localStorage.getItem("institutecode");
//         const res = await axios.get(
//           `http://localhost:8085/admissioncountofperdaybymonth?institutecode=${institutecode}&month=${selectedMonth}&year=${selectedYear}`
//         );
//         const data = res.data;

//         // Format the data for the chart
//         const formattedData = Object.entries(data)
//           .map(([date, count]) => [new Date(date), count]) // Convert date strings to Date objects
//           .sort((a, b) => a[0] - b[0]) // Sort by date in ascending order
//           .map(([date, count]) => [date.toLocaleDateString(), count]); // Format date for displaying as a string

//         // Set chart data
//         setChartData([["Date", "Admissions"], ...formattedData]);
//       } catch (error) {
//         console.error("Error fetching monthly data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMonthlyData();
//   }, [selectedYear, selectedMonth]);

//   return (
//     <div>
//       <Grid container spacing={3}>
//         <Grid item xs={12} sm={6} className="textField-root">
//           <TextField
//             select
//             label="Select Year"
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(e.target.value)}
//             variant="outlined"
//             margin="dense"
//             fullWidth
//           >
//             {years.map((year) => (
//               <MenuItem key={year} value={year}>
//                 {year}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//         <Grid item xs={12} sm={6} className="textField-root">
//           <TextField
//             select
//             label="Select Month"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(e.target.value)}
//             variant="outlined"
//             margin="dense"
//             fullWidth
//           >
//             {months.map((month) => (
//               <MenuItem key={month} value={month}>
//                 {month}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//       </Grid>
//       <Typography variant="h5" align="center">
//         Daily Admissions for {selectedMonth}/{selectedYear}
//       </Typography>
//       <Paper elevation={3}>
//         {loading ? (
//           <div>
//             <CircularProgress />
//           </div>
//         ) : (
//           <Chart
//             width={"100%"}
//             height={"400px"}
//             chartType="ColumnChart"
//             loader={<div>Loading Chart...</div>}
//             data={chartData}
//             options={{
//               title: `Daily Admissions for ${selectedMonth}/${selectedYear}`,
//               hAxis: {
//                 title: "Date",
//                 format: 'M/d', // Format the date on the x-axis (Month/Day)
//               },
//               vAxis: { title: "Number of Admissions" },
//               colors: ["#76A7FA"],
//               animation: {
//                 startup: true, // Start animation on data load
//                 duration: 500, // Duration of animation in milliseconds
//                 easing: 'out', // Easing function for the animation
//               },
//             }}
//             legendToggle
//           />
//         )}
//       </Paper>
//     </div>
//   );
// };

// export default YearlyGraph;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Chart } from "react-google-charts";

const YearlyGraph = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript

  // State for Admissions graph
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [chartData, setChartData] = useState([["Date", "Admissions"]]);
  const [loading, setLoading] = useState(true);

  // State for Revenue graph
  const [revenueData, setRevenueData] = useState([["Date", "Revenue"]]);
  const [revenueLoading, setRevenueLoading] = useState(true);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Fetch Admissions Data
  useEffect(() => {
    const fetchAdmissionsData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode");
        const res = await axios.get(
          `http://localhost:8085/admissioncountofperdaybymonth?institutecode=${institutecode}&month=${selectedMonth}&year=${selectedYear}`
        );
        const data = res.data;

        // Format the data for the chart
        const formattedData = Object.entries(data)
          .map(([date, count]) => [new Date(date), count])
          .sort((a, b) => a[0] - b[0])
          .map(([date, count]) => [date.toLocaleDateString(), count]);

        // Set chart data
        setChartData([["Date", "Admissions"], ...formattedData]);
      } catch (error) {
        console.error("Error fetching admissions data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionsData();
  }, [selectedYear, selectedMonth]);

  // Fetch Revenue Data
  useEffect(() => {
    const fetchRevenueData = async () => {
      setRevenueLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode") || null;
        const res = await axios.get(
          `http://localhost:8085/getRevenueBySpecificDates?institutecode=${institutecode}&year=${selectedYear}&month=${selectedMonth}`
        );
        const data = res.data;

        // Format the data for the chart
        const formattedRevenueData = Object.entries(data)
          .map(([date, revenue]) => [new Date(date), revenue])
          .sort((a, b) => a[0] - b[0])
          .map(([date, revenue]) => [date.toLocaleDateString(), revenue]);

        // Set revenue data
        setRevenueData([["Date", "Revenue"], ...formattedRevenueData]);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenueData();
  }, [selectedYear, selectedMonth]);

  return (
    <div>
      {/* Year and Month Select */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} className="textField-root">
          <TextField
            select
            label="Select Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            variant="outlined"
            margin="dense"
            fullWidth
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} className="textField-root">
          <TextField
            select
            label="Select Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            variant="outlined"
            margin="dense"
            fullWidth
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Graphs in the same row */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {/* Revenue Graph */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" align="center">
            Daily Revenue for {selectedMonth}/{selectedYear}
          </Typography>
          <Paper elevation={3}>
            {revenueLoading ? (
              <div>
                <CircularProgress />
              </div>
            ) : (
              <Chart
                width={"100%"}
                height={"400px"}
                chartType="ColumnChart"
                loader={<div>Loading Chart...</div>}
                data={revenueData}
                options={{
                  title: `Daily Revenue for ${selectedMonth}/${selectedYear}`,
                  hAxis: {
                    title: "Date",
                    format: "M/d",
                  },
                  vAxis: { title: "Revenue (in ₹)" },
                  colors: ["#FF9900"],
                  animation: {
                    startup: true,
                    duration: 500,
                    easing: "out",
                  },
                }}
                legendToggle
              />
            )}
          </Paper>
        </Grid>

        {/* Admissions Graph */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" align="center">
            Daily Admissions for {selectedMonth}/{selectedYear}
          </Typography>
          <Paper elevation={3}>
            {loading ? (
              <div>
                <CircularProgress />
              </div>
            ) : (
              <Chart
                width={"100%"}
                height={"400px"}
                chartType="ColumnChart"
                loader={<div>Loading Chart...</div>}
                data={chartData}
                options={{
                  title: `Daily Admissions for ${selectedMonth}/${selectedYear}`,
                  hAxis: {
                    title: "Date",
                    format: "M/d",
                  },
                  vAxis: { title: "Number of Admissions" },
                  colors: ["#76A7FA"],
                  animation: {
                    startup: true,
                    duration: 500,
                    easing: "out",
                  },
                }}
                legendToggle
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default YearlyGraph;
