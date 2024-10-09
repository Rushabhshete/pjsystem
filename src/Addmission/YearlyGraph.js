
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
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";

// const YearlyGraph = () => {
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript

//   // State for Admissions graph
//   const [selectedYear, setSelectedYear] = useState(currentYear);
//   const [selectedMonth, setSelectedMonth] = useState(currentMonth);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // State for Revenue graph
//   const [revenueData, setRevenueData] = useState([]);
//   const [revenueLoading, setRevenueLoading] = useState(true);

//  // Generate years for dropdown (5 past and 5 future)
//  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
//   const months = Array.from({ length: 12 }, (_, i) => i + 1);

//   // Fetch Admissions Data
//   useEffect(() => {
//     const fetchAdmissionsData = async () => {
//       setLoading(true);
//       try {
//         const institutecode = localStorage.getItem("institutecode");
//         const res = await axios.get(
//           `http://localhost:8085/admissioncountofperdaybymonth?institutecode=${institutecode}&month=${selectedMonth}&year=${selectedYear}`
//         );
//         const data = res.data || {}; // Default to empty object

//         if (Object.keys(data).length === 0) {
//           setChartData([{ date: "No Data", admissions: 0 }]);
//         } else {
//           const formattedData = Object.entries(data)
//             .map(([date, count]) => ({ date: new Date(date).toLocaleDateString(), admissions: count }))
//             .sort((a, b) => new Date(a.date) - new Date(b.date));
//           setChartData(formattedData);
//         }
//       } catch (error) {
//         console.error("Error fetching admissions data:", error);
//         setChartData([{ date: "Error", admissions: 0 }]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAdmissionsData();
//   }, [selectedYear, selectedMonth]);

//   // Fetch Revenue Data
//   useEffect(() => {
//     const fetchRevenueData = async () => {
//       setRevenueLoading(true);
//       try {
//         const institutecode = localStorage.getItem("institutecode") || null;
//         const res = await axios.get(
//           `http://localhost:8085/getRevenueBySpecificDates?institutecode=${institutecode}&year=${selectedYear}&month=${selectedMonth}`
//         );
//         const data = res.data || {}; // Default to empty object

//         if (Object.keys(data).length === 0) {
//           setRevenueData([{ date: "No Data", revenue: 0 }]);
//         } else {
//           const formattedRevenueData = Object.entries(data)
//             .map(([date, revenue]) => ({ date: new Date(date).toLocaleDateString(), revenue }))
//             .sort((a, b) => new Date(a.date) - new Date(b.date));
//           setRevenueData(formattedRevenueData);
//         }
//       } catch (error) {
//         console.error("Error fetching revenue data:", error);
//         setRevenueData([{ date: "Error", revenue: 0 }]);
//       } finally {
//         setRevenueLoading(false);
//       }
//     };

//     fetchRevenueData();
//   }, [selectedYear, selectedMonth]);

//   return (
//     <div>
//       {/* Year and Month Select */}
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

//       {/* Graphs in the same row */}
//       <Grid container spacing={3} style={{ marginTop: "20px" }}>
//         {/* Revenue Graph */}
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h5" align="center">
//             Daily Revenue for {selectedMonth}/{selectedYear}
//           </Typography>
//             {revenueLoading ? (
//               <CircularProgress />
//             ) : (
//               <ResponsiveContainer width="100%" height={400}>
//                 <BarChart data={revenueData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="revenue" fill="#FF9900" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//         </Grid>

//         {/* Admissions Graph */}
//         <Grid item xs={12} sm={6}>
//           <Typography variant="h5" align="center">
//             Daily Admissions for {selectedMonth}/{selectedYear}
//           </Typography>
//             {loading ? (
//               <CircularProgress />
//             ) : (
//               <ResponsiveContainer width="100%" height={400}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="admissions" fill="#76A7FA" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//         </Grid>
//       </Grid>
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const YearlyGraph = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // Months are 0-based in JavaScript

  // State for Admissions graph
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for Revenue graph
  const [revenueData, setRevenueData] = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(true);

  // Generate years for dropdown (5 past and 5 future)
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Month names for dropdown
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Fetch Admissions Data
  useEffect(() => {
    const fetchAdmissionsData = async () => {
      setLoading(true);
      try {
        const institutecode = localStorage.getItem("institutecode");
        const res = await axios.get(
          `http://localhost:8085/admissioncountofperdaybymonth?institutecode=${institutecode}&month=${selectedMonth + 1}&year=${selectedYear}`
        );
        const data = res.data || {}; // Default to empty object

        if (Object.keys(data).length === 0) {
          setChartData([{ date: "No Data", admissions: 0 }]);
        } else {
          const formattedData = Object.entries(data)
            .map(([date, count]) => ({
              date: new Date(date).toLocaleDateString(),
              admissions: count,
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching admissions data:", error);
        setChartData([{ date: "Error", admissions: 0 }]);
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
          `http://localhost:8085/getRevenueBySpecificDates?institutecode=${institutecode}&year=${selectedYear}&month=${selectedMonth + 1}`
        );
        const data = res.data || {}; // Default to empty object

        if (Object.keys(data).length === 0) {
          setRevenueData([{ date: "No Data", revenue: 0 }]);
        } else {
          const formattedRevenueData = Object.entries(data)
            .map(([date, revenue]) => ({
              date: new Date(date).toLocaleDateString(),
              revenue,
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          setRevenueData(formattedRevenueData);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setRevenueData([{ date: "Error", revenue: 0 }]);
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
            {monthNames.map((month, index) => (
              <MenuItem key={index} value={index}>
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
            Daily Revenue for {monthNames[selectedMonth]} {selectedYear}
          </Typography>
          {revenueLoading ? (
            <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#FF6F61" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Grid>

        {/* Admissions Graph */}
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" align="center">
            Daily Admissions for {monthNames[selectedMonth]} {selectedYear}
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="admissions" fill="#3498DB" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default YearlyGraph;
