// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   CircularProgress,
//   TextField,
//   MenuItem,
//   Typography,
//   Grid,
// } from "@mui/material";
// import { ResponsiveBar } from '@nivo/bar';

// const MonthlyGraph = () => {
//   const currentYear = new Date().getFullYear();
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Create an array for years from 5 years in the past to 5 years in the future
//   const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

//   useEffect(() => {
//     const fetchMonthlyData = async () => {
//       setLoading(true);
//       try {
//         const institutecode = localStorage.getItem("institutecode"); // Get institute code from local storage
//         const res = await axios.get(
//           `http://localhost:8085/count/monthly?institutecode=${institutecode}&year=${selectedYear}`
//         );

//         const data = res.data;
//         const months = [
//           "JAN",
//           "FEB",
//           "MAR",
//           "APR",
//           "MAY",
//           "JUN",
//           "JUL",
//           "AUG",
//           "SEP",
//           "OCT",
//           "NOV",
//           "DEC",
//         ];

//         const formattedData = months.map((month) => ({
//           month,
//           admissions: data[month] || 0,
//         }));

//         setChartData(formattedData);
//       } catch (error) {
//         console.error("Error fetching monthly data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMonthlyData();
//   }, [selectedYear]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <div>
//       <Grid
//         container
//         spacing={2}
//         alignItems="center"
//         justifyContent="center"
//         className="textField-root"
//       >
//            <Typography variant="body1">
//         Monthly Admissions
//       </Typography>
//         <Grid item xs={12} md={3}>
//           <TextField
//             select
//             label="Year"
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(e.target.value)}
//             variant="outlined"
//             fullWidth
//             size="small"
//           >
//             {years.map((year) => (
//               <MenuItem key={year} value={year}>
//                 {year}
//               </MenuItem>
//             ))}
//           </TextField>
//         </Grid>
//       </Grid>
//       <div style={{ height: '400px' }}>
//         <ResponsiveBar
//           data={chartData}
//           keys={['admissions']} // The key for the bar values
//           indexBy="month" // The key for the x-axis labels
//           margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
//           padding={0.3}
//           colors={"#FF6F61"} // Color scheme
//           axisBottom={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: -20,
//             legend: 'Month',
//             legendPosition: 'middle',
//             legendOffset: 32,
//           }}
//           axisLeft={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
//             legend: 'Number of Admissions',
//             legendPosition: 'middle',
//             legendOffset: -40,
//           }}
//           labelSkipWidth={12}
//           labelSkipHeight={12}
//           labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
//           legends={[]}
//         />
//       </div>
//     </div>
//   );
// };

// export default MonthlyGraph;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

const MonthlyGraph = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmissions, setShowAdmissions] = useState(true); // To toggle between graphs

  // Create an array for years from 5 years in the past to 5 years in the future
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode"); // Get institute code from local storage
        const res = await axios.get(
          `http://localhost:8085/count/monthly?institutecode=${institutecode}&year=${selectedYear}`
        );

        const data = res.data;
        const months = [
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC",
        ];

        const formattedData = months.map((month) => ({
          month,
          admissionsCount: data[month]?.admissionsCount || 0, // admissions count
          revenue: data[month]?.revenue || 0, // revenue
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching monthly data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
  }, [selectedYear]);

  // Toggle between the two graphs
  const toggleGraph = () => {
    setShowAdmissions((prev) => !prev);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        className="textField-root"
      >
        <Typography variant="body1">
          {showAdmissions ? "Monthly Admissions" : "Monthly Revenue"}
        </Typography>

        <Grid item xs={12} md={3}>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Button to toggle between the graphs */}
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleGraph}
            style={{ float: "right" }}
          >
            {showAdmissions ? "Revenue" : "Admissions"}
          </Button>
        </Grid>
      </Grid>

      <div style={{ height: "400px", marginTop: "20px" }}>
        <ResponsiveBar
          data={chartData}
          keys={showAdmissions ? ["admissionsCount"] : ["revenue"]} // Toggle keys between admissionsCount and revenue
          indexBy="month" // The key for the x-axis labels
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.3}
          colors={showAdmissions ? "#FF6F61" : "#3498DB"} // Color based on the graph
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -20,
            legend: "Month",
            legendPosition: "middle",
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: showAdmissions
              ? "Number of Admissions"
              : "", // Axis label changes based on graph
            legendPosition: "middle",
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[]}
        />
      </div>
    </div>
  );
};

export default MonthlyGraph;