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
} from "@mui/material";
import { ResponsiveBar } from '@nivo/bar';

const MonthlyGraph = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Format the data to include both admissionsCount and revenue for each month
        const formattedData = months.map((month) => ({
          month,
          admissions: data[month]?.admissionsCount || 0,
          revenue: data[month]?.revenue || 0,
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
          Monthly Admissions & Revenue
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
      </Grid>
      <div style={{ height: '400px' }}>
        <ResponsiveBar
          data={chartData}
          keys={['admissions', 'revenue']} // Keys for admissions and revenue
          indexBy="month" // The key for the x-axis labels (months)
          margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
          padding={0.3}
          colors={['#FF6F61', '#6FA4FF']} // Colors for admissions and revenue
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -20,
            legend: 'Month',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Value',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  );
};

export default MonthlyGraph;
