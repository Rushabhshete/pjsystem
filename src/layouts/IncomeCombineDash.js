// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Typography,
//   Grid,
//   Paper,
//   MenuItem,
//   FormControl,
//   Box,
//   TextField,
// } from "@mui/material";
// import CountUp from "react-countup";
// import { BarChart } from "recharts";
// import {
//   ResponsiveContainer,
//   CartesianGrid,
//   XAxis,
//   Bar,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { Line } from "react-chartjs-2";
// import axios from "axios";

// export default function IncomeCombineDash() {
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [incomeData, setIncomeData] = useState({});
//   const [expenseData, setExpenseData] = useState({});
//   const [savingsData, setSavingsData] = useState(0);
//   const [monthlyIncome, setMonthlyIncome] = useState([]);
//   const [monthlyExpense, setMonthlyExpense] = useState([]);
//   const institutecode = localStorage.getItem("institutecode") || "";

//   const fetchIncomeData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         http://localhost:8087/dashboard/incomes/totals?institutecode=${institutecode}
//       );
//       setIncomeData(response.data);
//     } catch (error) {
//       console.error("Error fetching income data:", error);
//     }
//   }, [institutecode]);

//   const fetchExpenseData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         http://localhost:8087/dashboard/expenses/totals?institutecode=${institutecode}
//       );
//       setExpenseData(response.data);
//     } catch (error) {
//       console.error("Error fetching expense data:", error);
//     }
//   }, [institutecode]);

//   const fetchSavingsData = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         http://localhost:8087/dashboard/savings?institutecode=${institutecode}
//       );
//       setSavingsData(response.data);
//     } catch (error) {
//       console.error("Error fetching savings data:", error);
//     }
//   }, [institutecode]);

//   useEffect(() => {
//     fetchIncomeData();
//     fetchExpenseData();
//     fetchSavingsData();
//   }, [fetchIncomeData, fetchExpenseData, fetchSavingsData]);

//   const fetchMonthlyData = useCallback(async () => {
//     try {
//       const [incomeResponse, expenseResponse] = await Promise.all([
//         axios.get(
//           http://localhost:8087/income/total-monthly?year=${year}&institutecode=${institutecode}
//         ),
//         axios.get(
//           http://localhost:8087/expense/total-monthly?year=${year}&institutecode=${institutecode}
//         ),
//       ]);

//       const incomeArray = Array(12).fill(0);
//       const expenseArray = Array(12).fill(0);

//       Object.keys(incomeResponse.data).forEach((month) => {
//         incomeArray[month - 1] = incomeResponse.data[month];
//       });

//       Object.keys(expenseResponse.data).forEach((month) => {
//         expenseArray[month - 1] = expenseResponse.data[month];
//       });

//       setMonthlyIncome(incomeArray);
//       setMonthlyExpense(expenseArray);
//     } catch (error) {
//       console.error("Error fetching monthly data:", error);
//     }
//   }, [year, institutecode]);

//   useEffect(() => {
//     fetchMonthlyData();
//   }, [fetchMonthlyData]);

//   const formattedCountUp = (value) => (
//     <CountUp end={value} duration={2.5} formattingFn={formatValue} />
//   );

//   const years = Array.from(
//     new Array(10),
//     (val, index) => new Date().getFullYear() - index
//   );

//   const handleYearChange = (event) => {
//     setYear(event.target.value);
//   };

//   // Determine text for savings/loss card
//   const savingsText = savingsData >= 0 ? "Saving" : "Loss";
//   const todaytext =
//     incomeData.today - expenseData.today >= 0 ? "Saving" : "Loss";

//   // Format data values with commas
//   const formatValue = (value) => Math.abs(value).toLocaleString();

//   // Overall comparison chart data
//   const overallData = [
//     {
//       category: "Today's",
//       Income: incomeData.today || 0,
//       Expense: expenseData.today || 0,
//     },
//     {
//       category: "7 Day's",
//       Income: incomeData.last7Days || 0,
//       Expense: expenseData.last7Days || 0,
//     },
//     {
//       category: "30 Day's",
//       Income: incomeData.last30Days || 0,
//       Expense: expenseData.last30Days || 0,
//     },
//     {
//       category: "365 Day's",
//       Income: incomeData.last365Days || 0,
//       Expense: expenseData.last365Days || 0,
//     },
//     {
//       category: "Total",
//       Income: incomeData.total || 0,
//       Expense: expenseData.total || 0,
//     },
//   ];

//   // Data for the monthly chart
//   const monthlyData = {
//     labels: [
//       "Jan",
//       "Feb",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "Aug",
//       "Sept",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "Income",
//         data: monthlyIncome,
//         borderColor: "#3498DB",
//         backgroundColor: "#3498DB",
//         fill: false,
//         tension: 0.1,
//       },
//       {
//         label: "Expense",
//         data: monthlyExpense,
//         borderColor: "#FF6F61",
//         backgroundColor: "#FF6F61",
//         fill: false,
//         tension: 0.1,
//       },
//     ],
//   };

//   const monthlyOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: function (tooltipItem) {
//             return (
//               tooltipItem.dataset.label +
//               ": " +
//               tooltipItem.raw.toLocaleString()
//             );
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   return (
//     <div>
//       {/* Income Expense Dashboard */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         <Box
//           sx={{
//             flexGrow: 1,
//             height: "3px",
//             backgroundColor: "#0D47A1",
//           }}
//         />
//         <Typography variant="h6" sx={{ margin: "0 10px" }}>
//           <b>Income And Expense</b>
//         </Typography>
//         <Box
//           sx={{
//             flexGrow: 1,
//             height: "3px",
//             backgroundColor: "#0D47A1",
//           }}
//         />
//       </Box>
//       <Grid item xs={12}>
//         <Grid container spacing={2} justifyContent="center" wrap="nowrap">
//           {/* Cards Display */}
//           <Grid item xs={12} sm={6} md={2.4}>
//             <Paper
//               sx={{
//                 padding: "16px",
//                 backgroundColor: "#F9E79F ",
//                 borderRadius: "10px",
//               }}
//             >
//               <Typography variant="h7">Today's Income</Typography>
//               <Typography variant="h5">
//                 ₹{formattedCountUp(incomeData.today || 0)}
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2.4}>
//             <Paper
//               elevation={3}
//               sx={{
//                 padding: "16px",
//                 backgroundColor: "#FF6F61",
//                 borderRadius: "10px",
//               }}
//             >
//               <Typography variant="h7">Total Income</Typography>
//               <Typography variant="h5">
//                 ₹{formattedCountUp(incomeData.total || 0)}
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2.4}>
//             <Paper
//               elevation={3}
//               sx={{
//                 padding: "16px",
//                 backgroundColor: "#3498DB ",
//                 borderRadius: "10px",
//               }}
//             >
//               <Typography variant="h7">Today's Expense</Typography>
//               <Typography variant="h5">
//                 ₹{formattedCountUp(expenseData.today || 0)}
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2.4}>
//             <Paper
//               elevation={3}
//               sx={{
//                 padding: "16px",
//                 backgroundColor: "#F9E79F",
//                 borderRadius: "10px",
//               }}
//             >
//               <Typography variant="h7">Total Expense</Typography>
//               <Typography variant="h5">
//                 ₹{formattedCountUp(expenseData.total || 0)}
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2.4}>
//             <Paper
//               elevation={3}
//               sx={{
//                 padding: "16px",
//                 backgroundColor: "#FF6F61 ",
//                 borderRadius: "10px",
//               }}
//             >
//               <Typography variant="h7">Today's {todaytext}</Typography>
//               <Typography
//                 variant="h5"
//                 className={incomeData.today - expenseData.today >= 0}
//               >
//                 ₹{formattedCountUp(incomeData.today - expenseData.today)}
//               </Typography>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} sm={6} md={2.4}>
//             <Paper
//               elevation={3}
//               sx={{
//                 padding: "16px",
//                 backgroundColor: "#3498DB",
//                 borderRadius: "10px",
//               }}
//             >
//               <Typography variant="h7">Total {savingsText}</Typography>
//               <Typography variant="h5" className={savingsData >= 0}>
//                 ₹{formattedCountUp(savingsData)}
//               </Typography>
//             </Paper>
//           </Grid>
//         </Grid>

//         {/* Chart Section */}
//         <Grid
//           container
//           spacing={2}
//           sx={{ marginTop: "20px", justifyContent: "space-between" }}
//         >
//           <Grid item xs={12} sm={6} sx={{ height: "450px" }}>
//             <Typography variant="h6" align="center" color="black">
//               Overall Income & Expense Comparison
//             </Typography>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={overallData}
//                 margin={{ top: 20, right: 50, bottom: 5 }} // Increase margins to avoid cut-off
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="category" style={{ fontSize: "12px" }} />
//                 <YAxis
//                   domain={[0, "auto"]}
//                   tickFormatter={(value) => value.toLocaleString()} // Full numbers with commas
//                   width={120} // Increase the width to make space for large numbers
//                   padding={{ top: 20, bottom: 20 }} // More padding for better spacing
//                   style={{ fontSize: "12px" }} // Reduce font size of the numbers
//                 />
//                 <Tooltip
//                   formatter={(value) =>
//                     new Intl.NumberFormat("en-US").format(value)
//                   }
//                 />
//                 <Legend />
//                 <Bar dataKey="Income" fill="#3498DB" />
//                 <Bar dataKey="Expense" fill="#FF6F61" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Grid>

//           <Grid item xs={12} md={6} className="textField-root">
//             <TextField
//               select
//               label="Year"
//               value={year}
//               onChange={handleYearChange}
//               sx={{ marginTop: "-20px" }}
//             >
//               {years.map((year) => (
//                 <MenuItem key={year} value={year}>
//                   {year}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <Paper
//               elevation={3}
//               sx={{
//                 padding: 2,
//                 borderRadius: 2,
//                 fontWeight: "bold",

//                 boxShadow: 3,
//               }}
//             >
//               <Typography variant="h6" align="center" mt={-4}>
//                 {year} Income & Expense Comparison
//               </Typography>

//               <div style={{ height: "400px" }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <Line data={monthlyData} options={monthlyOptions} />
//                 </ResponsiveContainer>
//               </div>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Grid>
//     </div>
//   );
// }
import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Grid,
  Paper,
  MenuItem,
  Box,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import CountUp from "react-countup";
import axios from "axios";
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from "@nivo/bar";

export default function IncomeCombineDash() {
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Income Data States
  const [incomeData, setIncomeData] = useState({});
  const [incomeLoading, setIncomeLoading] = useState(true);
  const [incomeError, setIncomeError] = useState(null);

  // Expense Data States
  const [expenseData, setExpenseData] = useState({});
  const [expenseLoading, setExpenseLoading] = useState(true);
  const [expenseError, setExpenseError] = useState(null);

  // Savings Data States
  const [savingsData, setSavingsData] = useState(0);
  const [savingsLoading, setSavingsLoading] = useState(true);
  const [savingsError, setSavingsError] = useState(null);

  // Monthly Data States
  const [monthlyIncome, setMonthlyIncome] = useState(Array(12).fill(0));
  const [monthlyExpense, setMonthlyExpense] = useState(Array(12).fill(0));
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [monthlyError, setMonthlyError] = useState(null);

  const institutecode = localStorage.getItem("institutecode") || "";

  // Fetch Income Data
  const fetchIncomeData = useCallback(async () => {
    setIncomeLoading(true);
    setIncomeError(null);
    try {
      const response = await axios.get(
        `http://localhost:8087/dashboard/incomes/totals?institutecode=${institutecode}`
      );
      setIncomeData(response.data);
    } catch (error) {
      setIncomeError("Failed to fetch income data.");
      console.error("Error fetching income data:", error);
    } finally {
      setIncomeLoading(false);
    }
  }, [institutecode]);

  // Fetch Expense Data
  const fetchExpenseData = useCallback(async () => {
    setExpenseLoading(true);
    setExpenseError(null);
    try {
      const response = await axios.get(
        `http://localhost:8087/dashboard/expenses/totals?institutecode=${institutecode}`
      );
      setExpenseData(response.data);
    } catch (error) {
      setExpenseError("Failed to fetch expense data.");
      console.error("Error fetching expense data:", error);
    } finally {
      setExpenseLoading(false);
    }
  }, [institutecode]);

  // Fetch Savings Data
  const fetchSavingsData = useCallback(async () => {
    setSavingsLoading(true);
    setSavingsError(null);
    try {
      const response = await axios.get(
        `http://localhost:8087/dashboard/savings?institutecode=${institutecode}`
      );
      setSavingsData(response.data);
    } catch (error) {
      setSavingsError("Failed to fetch savings data.");
      console.error("Error fetching savings data:", error);
    } finally {
      setSavingsLoading(false);
    }
  }, [institutecode]);

  // Fetch Monthly Data
  const fetchMonthlyData = useCallback(async () => {
    setMonthlyLoading(true);
    setMonthlyError(null);
    try {
      const [incomeResponse, expenseResponse] = await Promise.all([
        axios.get(
          `http://localhost:8087/income/total-monthly?year=${year}&institutecode=${institutecode}`
        ),
        axios.get(
          `http://localhost:8087/expense/total-monthly?year=${year}&institutecode=${institutecode}`
        ),
      ]);

      const incomeArray = Array(12).fill(0);
      const expenseArray = Array(12).fill(0);

      // Populate incomeArray
      Object.keys(incomeResponse.data).forEach((month) => {
        const monthIndex = parseInt(month, 10) - 1; // Assuming months are 1-based
        if (monthIndex >=0 && monthIndex < 12) {
          incomeArray[monthIndex] = incomeResponse.data[month];
        }
      });

      // Populate expenseArray
      Object.keys(expenseResponse.data).forEach((month) => {
        const monthIndex = parseInt(month, 10) - 1; // Assuming months are 1-based
        if (monthIndex >=0 && monthIndex < 12) {
          expenseArray[monthIndex] = expenseResponse.data[month];
        }
      });

      setMonthlyIncome(incomeArray);
      setMonthlyExpense(expenseArray);
    } catch (error) {
      setMonthlyError("Failed to fetch monthly data.");
      console.error("Error fetching monthly data:", error);
    } finally {
      setMonthlyLoading(false);
    }
  }, [year, institutecode]);

  // Initial Data Fetch
  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
    fetchSavingsData();
  }, [fetchIncomeData, fetchExpenseData, fetchSavingsData]);

  // Fetch Monthly Data on Year or institutecode change
  useEffect(() => {
    fetchMonthlyData();
  }, [fetchMonthlyData]);

  const formattedCountUp = (value) => (
    <CountUp end={value} duration={2.5} formattingFn={formatValue} />
  );

  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() - index
  );

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // Determine text for savings/loss card
  const todayIncome = incomeData.today || 0;
  const todayExpense = expenseData.today || 0;
  const todayBalance = todayIncome - todayExpense;
  const savingsText = savingsData >= 0 ? "Saving" : "Loss";
  const todaytext = todayBalance >= 0 ? "Saving" : "Loss";

  // Format data values with commas
  const formatValue = (value) => Math.abs(value).toLocaleString();

  // Overall comparison chart data
  const overallData = [
    {
      category: "Today's",
      Income: todayIncome,
      Expense: todayExpense,
    },
    {
      category: "7 Day's",
      Income: incomeData.last7Days || 0,
      Expense: expenseData.last7Days || 0,
    },
    {
      category: "30 Day's",
      Income: incomeData.last30Days || 0,
      Expense: expenseData.last30Days || 0,
    },
    {
      category: "365 Day's",
      Income: incomeData.last365Days || 0,
      Expense: expenseData.last365Days || 0,
    },
    {
      category: "Total",
      Income: incomeData.total || 0,
      Expense: expenseData.total || 0,
    },
  ];

  // Monthly data labels
  const monthLabels = [
    "Jan", "Feb", "March", "April", "May", "June",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec",
  ];

  // Nivo data for Line Chart
  const nivoData = [
    {
      id: "Income",
      data: monthlyIncome.map((value, index) => ({
        x: monthLabels[index],
        y: value,
      })),
      color: "#3498DB",
    },
    {
      id: "Expense",
      data: monthlyExpense.map((value, index) => ({
        x: monthLabels[index],
        y: value,
      })),
      color: "#FF6F61",
    },
  ];

  // Data for Line Chart can have undefined x or y
  // Ensure that x and y are valid
  const cleanedNivoData = nivoData.map(series => ({
    ...series,
    data: series.data.map(point => ({
      x: point.x || `Month ${point.x}`,
      y: point.y !== undefined && point.y !== null ? point.y : 0,
    })),
  }));

  return (
    <div>
      {/* Income Expense Dashboard */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        //  width: "100%",
          marginBottom: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            height: "3px",
            backgroundColor: "#0D47A1",
          }}
        />
        <Typography variant="h6" sx={{ margin: "0 10px" }}>
          <b>Income And Expense</b>
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            height: "3px",
            backgroundColor: "#0D47A1",
          }}
        />
      </Box>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          fontWeight: "bold",
          boxShadow: 3,
        }}
      >
        <Grid container spacing={2}>
          <Grid container spacing={2} justifyContent="center" wrap="nowrap">
            {/* Cards Display */}
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                sx={{
                  padding: "16px",
                  backgroundColor: "#F9E79F",
                  borderRadius: "10px",
                }}
                elevation={2}
              >
                <Typography variant="h7">Today's Income</Typography>
                {incomeLoading ? (
                  <CircularProgress size={24} />
                ) : incomeError ? (
                  <Alert severity="error">{incomeError}</Alert>
                ) : (
                  <Typography variant="h5">
                    ₹{formattedCountUp(todayIncome)}
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={2}
                sx={{
                  padding: "16px",
                  backgroundColor: "#FF6F61",
                  borderRadius: "10px",
               
                }}
              >
                <Typography variant="h7">Total Income</Typography>
                {incomeLoading ? (
                  <CircularProgress size={24} />
                ) : incomeError ? (
                  <Alert severity="error">{incomeError}</Alert>
                ) : (
                  <Typography variant="h5">
                    ₹{formattedCountUp(incomeData.total || 0)}
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={2}
                sx={{
                  padding: "16px",
                  backgroundColor: "#3498DB",
                  borderRadius: "10px",
               
                }}
              >
                <Typography variant="h7">Today's Expense</Typography>
                {expenseLoading ? (
                  <CircularProgress size={24} />
                ) : expenseError ? (
                  <Alert severity="error">{expenseError}</Alert>
                ) : (
                  <Typography variant="h5">
                    ₹{formattedCountUp(todayExpense)}
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={2}
                sx={{
                  padding: "16px",
                  backgroundColor: "#F9E79F",
                  borderRadius: "10px",
                }}
              >
                <Typography variant="h7">Total Expense</Typography>
                {expenseLoading ? (
                  <CircularProgress size={24} />
                ) : expenseError ? (
                  <Alert severity="error">{expenseError}</Alert>
                ) : (
                  <Typography variant="h5">
                    ₹{formattedCountUp(expenseData.total || 0)}
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={2}
                sx={{
                  padding: "16px",
                  backgroundColor: "#FF6F61",
                  borderRadius: "10px",
               
                }}
              >
                <Typography variant="h7">Today's {todaytext}</Typography>
                {incomeLoading || expenseLoading ? (
                  <CircularProgress size={24} />
                ) : incomeError || expenseError ? (
                  <Alert severity="error">{incomeError || expenseError}</Alert>
                ) : (
                  <Typography variant="h5">
                    ₹{formattedCountUp(todayBalance)}
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Paper
                elevation={2}
                sx={{
                  padding: "16px",
                  backgroundColor: "#3498DB",
                  borderRadius: "10px",
               
                }}
              >
                <Typography variant="h7">Total {savingsText}</Typography>
                {savingsLoading ? (
                  <CircularProgress size={24} />
                ) : savingsError ? (
                  <Alert severity="error">{savingsError}</Alert>
                ) : (
                  <Typography variant="h5">
                    ₹{formattedCountUp(savingsData)}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Chart Section */}
          <Grid container spacing={2} sx={{ marginTop: "20px" }}>
            {/* Nivo BarChart replacing Recharts BarChart */}
            <Grid item xs={12} sm={6} sx={{ height: { xs: "400px", sm: "450px" } }}>
    <Typography variant="body1" align="center"  gutterBottom >
      Overall Income & Expense Comparison
    </Typography>
              {incomeLoading || expenseLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : incomeError || expenseError ? (
                <Alert severity="error">{incomeError || expenseError}</Alert>
              ) : (
                <ResponsiveBar
                  data={overallData}
                  keys={["Income", "Expense"]} // Data keys to map bars
                  indexBy="category" // Grouped by "category"
       groupMode="grouped"
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  padding={0.3}
                  colors={({ id }) => (id === "Income" ? "#3498DB" : "#FF6F61")} // Custom colors for bars
                  tooltip={({ id, value, indexValue }) => (
                    <strong style={{ color: "black" }}>
                      {id}: ₹{value.toLocaleString()}
                    </strong>
                  )}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                  legends={[
                    {
                      dataFrom: "keys",
                      anchor: "bottom-right",
                    
                 
                      direction: "column",
                      justify: false,
                      translateX: 120,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      symbolSize: 20,
                    },
                  ]}
                  theme={{
                    tooltip: {
                      container: {
                        background: "white", // Tooltip background remains white
                        color: "black",      // Tooltip text color set to black
                      },
                    },
                    labels: {
                      text: {
                        fill: "black",        // Label text color changes to black
                      },
                    },
                  }}
                />
              )}
            </Grid>

            {/* Line Chart for Monthly Income & Expense */}
            <Grid item xs={12} md={6} className="textField-root">
              {/* Year Selection Dropdown */}
              <Grid container alignItems="center" justifyContent="space-evenly">
  {/* Year Income & Expense Comparison Text */}
  <Grid item>
    <Typography variant="body1" align="center" gutterBottom>
      {year} Income & Expense Comparison
    </Typography>
  </Grid>

  {/* Year Selection Dropdown */}
  <Grid item>
    <TextField
      select
      label="Year"
      value={year}
      onChange={handleYearChange}
      sx={{ minWidth: 120 }}
    >
      {years.map((yr) => (
        <MenuItem key={yr} value={yr}>
          {yr}
        </MenuItem>
      ))}
    </TextField>
  </Grid>
</Grid>

              {monthlyLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                  <CircularProgress />
                </Box>
              ) : monthlyError ? (
                <Alert severity="error">{monthlyError}</Alert>
              ) : (
                <div style={{ height: "400px" }}>
                  <ResponsiveLine
                    data={cleanedNivoData}
                    margin={{ top: 10, right: 10, bottom: 30, left: 60 }}
                    xScale={{ type: 'point' }} // Set the x scale type to point
                    yScale={{
                      type: 'linear',
                      min: 'auto',
                      max: 'auto',
                      stacked: false,
                      reverse: false,
                    }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      orient: 'bottom',
                      tickSize: 5,
                 
                      tickPadding: 5,
                      tickRotation: 0,
                   //   legend: 'Month',
                      legendOffset: 36,
                      legendPosition: 'middle',
                    }}
                    axisLeft={{
                      orient: 'left',
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      //legend: 'Amount',
                      legendOffset: -40,
                      legendPosition: 'middle',
                    }}
                    colors={({ id }) => (id === "Income" ? "#3498DB" : "#FF6F61")}
                    pointSize={10}
                    pointBorderWidth={2}
                    pointLabelYOffset={-12}
                    useMesh={true}
                    tooltip={({ point }) => (
                      <strong style={{ color: point.serieColor }}>
                        {point.data.x}: ₹{point.data.y.toLocaleString()}
                      </strong>
                    )}
                    enableSlices="x"
                    legends={[
                      {
                        anchor: 'top-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                          {
                            on: 'hover',
                            style: {
                              itemBackground: 'rgba(0, 0, 0, .03)',
                              itemOpacity: 1,
                            },
                          },
                        ],
                      },
                    ]}
                    theme={{
                      tooltip: {
                        container: {
                          background: "white",
                          color: "black",
                          fontSize: "12px",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}