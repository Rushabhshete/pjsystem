// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   CircularProgress,
//   TextField,
//   MenuItem,
//   Typography,
//   Grid
// } from "@mui/material";
// import { ResponsiveBar } from '@nivo/bar'; // Import Nivo's ResponsiveBar

// const ComparisonGraph = () => {
//   const currentYear = new Date().getFullYear();
  
//   // Adjusted to include the past 5 years and the next 5 years
//   const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
//   const [year1, setYear1] = useState(currentYear - 1);
//   const [year2, setYear2] = useState(currentYear);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchComparisonData = async () => {
//       setLoading(true);
//       try {
//         const institutecode = localStorage.getItem("institutecode"); // Get institute code from local storage
//         const resComparison = await axios.get(
//           `http://localhost:8085/count/comparison?institutecode=${institutecode}&year1=${year1}&year2=${year2}`
//         );

//         const data = resComparison.data;
//         const months = [
//           "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//           "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
//         ];

//         const formattedData = months.map((month) => ({
//           month,
//           [year1]: Number(data[`${month}_${year1}`]) || 0,
//           [year2]: Number(data[`${month}_${year2}`]) || 0,
//         }));

//         setChartData(formattedData);
//       } catch (error) {
//         console.error("Error fetching comparison data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchComparisonData();
//   }, [year1, year2]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   return (
//     <div>
//      <Grid
//   container
//   spacing={2}
//   justifyContent="center"
//   alignItems="center"
//   className="textField-root"
// >
//   <Grid item>
//     <Typography variant="body1" marginLeft="10px">
//       Comparison of Admissions
//     </Typography>
//   </Grid>

//   <Grid item xs={2.5}>
//     <TextField
//       select
//       label="Year From"
//       value={year1}
//       onChange={(e) => setYear1(e.target.value)}
//       variant="outlined"
//       fullWidth
//       size="small"
      
//     >
//       {years.map((year) => (
//         <MenuItem key={year} value={year}>
//           {year}
//         </MenuItem>
//       ))}
//     </TextField>
//   </Grid>

//   <Grid item xs={2.5}>
//     <TextField
//       select
//       label="Year To"
//       value={year2}
//       onChange={(e) => setYear2(e.target.value)}
//       variant="outlined"
//       fullWidth
//       size="small"
      
//     >
//       {years.map((year) => (
//         <MenuItem key={year} value={year}>
//           {year}
//         </MenuItem>
//       ))}
//     </TextField>
//   </Grid>
// </Grid>


//       <div style={{ height: '400px' }}>
//         <ResponsiveBar
//           data={chartData}
//           keys={[year1, year2]} // Use the years for bar data
//           indexBy="month" // The months are on the x-axis
//           margin={{ top: 40, right: 80, bottom: 50, left: 60 }} // Adjust margins as needed
//           padding={0.3}
//           colors={["#3498DB","#FF6F61"]} // Use the specified color for bars
//           axisBottom={{
//             tickSize: 5,
//             tickPadding: 5,
//             tickRotation: 0,
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
//           legends={[
//             {
//               dataFrom: 'keys',
//               anchor: 'bottom-right',
//               direction: 'column',
//               justify: false,
//               translateX: 120,
//               translateY: 0,
//               itemsSpacing: 2,
//               itemWidth: 100,
//               itemHeight: 20,
//               itemDirection: 'left-to-right',
//               itemOpacity: 0.85,
//               symbolSize: 20,
//               effects: [
//                 {
//                   on: 'hover',
//                   style: {
//                     itemOpacity: 1,
//                   },
//                 },
//               ],
//             },
//           ]}
//         />
//       </div>
//     </div>
//   );
// };

// export default ComparisonGraph;


import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  TextField,
  MenuItem,
  Typography,
  Grid,
  Button
} from "@mui/material";
import { ResponsiveBar } from '@nivo/bar';

const ComparisonGraph = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const [year1, setYear1] = useState(currentYear - 1);
  const [year2, setYear2] = useState(currentYear);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [graphType, setGraphType] = useState("admissions"); // Toggle between 'admissions' and 'revenue'

  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode"); // Get institute code from local storage
        const resComparison = await axios.get(
          `http://localhost:8085/count/comparison?institutecode=${institutecode}&year1=${year1}&year2=${year2}`
        );

        const data = resComparison.data;
        const months = [
          "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
        ];

        const formattedData = months.map((month) => ({
          month,
          [year1]: graphType === "admissions"
            ? Number(data[month][`admissionsCount_${year1}`]) || 0
            : Number(data[month][`revenue_${year1}`]) || 0,
          [year2]: graphType === "admissions"
            ? Number(data[month][`admissionsCount_${year2}`]) || 0
            : Number(data[month][`revenue_${year2}`]) || 0,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [year1, year2, graphType]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Grid container spacing={2} justifyContent="center" alignItems="center" className="textField-root">
        <Grid item>
          <Typography variant="body1" marginLeft="10px">
            Comparison of {graphType === "admissions" ? "Admissions" : "Revenue"}
          </Typography>
        </Grid>

        <Grid item xs={2.5}>
          <TextField
            select  
            label="Year From"
            value={year1}
            onChange={(e) => setYear1(e.target.value)}
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

        <Grid item xs={2.5}>
          <TextField
            select
            label="Year To"
            value={year2}
            onChange={(e) => setYear2(e.target.value)}
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

        {/* Button to toggle between Admissions and Revenue */}
        <Grid item xs={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setGraphType((prev) => (prev === "admissions" ? "revenue" : "admissions"))}
          >
            {graphType === "admissions" ? "Revenue" : "Admission"}
          </Button>
        </Grid>
      </Grid>

      <div style={{ height: '400px' }}>
        <ResponsiveBar
          data={chartData}
          keys={[year1, year2]} // Use the years for bar data
          indexBy="month" // The months are on the x-axis
          margin={{ top: 40, right: 80, bottom: 50, left: 60 }}
          padding={0.3}
          colors={graphType === "admissions" ? ["#3498DB", "#FF6F61"] : ["#3498DB", "#FF6F61"]} // Different colors for different graphs
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: graphType === "admissions" ? "Number of Admissions" : "",
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
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ComparisonGraph;
