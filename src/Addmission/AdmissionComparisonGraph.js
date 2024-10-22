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
  Grid
} from "@mui/material";
import { ResponsiveBar } from '@nivo/bar'; // Import Nivo's ResponsiveBar

const ComparisonGraph = () => {
  const currentYear = new Date().getFullYear();
  
  // Adjusted to include the past 5 years and the next 5 years
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  
  const [year1, setYear1] = useState(currentYear - 1);
  const [year2, setYear2] = useState(currentYear);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Format data to include both admissionsCount and revenue for both years
        const formattedData = months.map((month) => ({
          month,
          [`admissions_${year1}`]: data[month]?.[`admissionsCount_${year1}`] || 0,
          [`admissions_${year2}`]: data[month]?.[`admissionsCount_${year2}`] || 0,
          [`revenue_${year1}`]: data[month]?.[`revenue_${year1}`] || 0,
          [`revenue_${year2}`]: data[month]?.[`revenue_${year2}`] || 0,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [year1, year2]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        className="textField-root"
      >
        <Grid item>
          <Typography variant="body1" marginLeft="10px">
            Comparison of Admissions & Revenue
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
      </Grid>

      <div style={{ height: '400px' }}>
        <ResponsiveBar
          data={chartData}
          keys={[`admissions_${year1}`, `admissions_${year2}`, `revenue_${year1}`, `revenue_${year2}`]} // Add keys for admissions and revenue for both years
          indexBy="month" // The months are on the x-axis
          margin={{ top: 40, right: 80, bottom: 50, left: 60 }} // Adjust margins as needed
          padding={0.3}
          colors={['#3498DB', '#FF6F61', '#A9DFBF', '#F39C12']} // Assign different colors for admissions and revenue
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
