import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import "./Design.css";
import CountUp from "react-countup";
import { styled } from "@mui/system";

// Register ChartJS components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement
);

// Individual Card Components
const InfoCard = ({ title, value, color }) => (
  <Grid item xs={12} sm={6} md={2.4}>
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        backgroundColor: color,
        borderRadius: 2,
        fontWeight: "bold",
        boxShadow: 3,
      }}
    >
      <Typography variant="h7">{title}</Typography>
      <Typography variant="h4">₹{value}</Typography>
    </Paper>
  </Grid>
);

const IncomeExpenseDashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [incomeData, setIncomeData] = useState({});
  const [expenseData, setExpenseData] = useState({});
  const [savingsData, setSavingsData] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [pendingIncomeStats, setPendingIncomeStats] = useState({});
  const [pendingExpenseStats, setPendingExpenseStats] = useState({});
  const [showPending, setShowPending] = useState(false);

  const getInstituteCode = () => localStorage.getItem("institutecode");
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/incomes/totals?institutecode=${getInstituteCode()}`
        );
        const data = await response.json();
        setIncomeData(data);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    const fetchExpenseData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/expenses/totals?institutecode=${getInstituteCode()}`
        );
        const data = await response.json();
        setExpenseData(data);
      } catch (error) {
        console.error("Error fetching expense data:", error);
      }
    };

    const fetchSavingsData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/dashboard/savings?institutecode=${getInstituteCode()}`
        );
        const data = await response.json();
        setSavingsData(data);
      } catch (error) {
        console.error("Error fetching savings data:", error);
      }
    };

    const fetchMonthlyIncome = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/income/total-monthly?year=${year}&institutecode=${getInstituteCode()}`
        );
        const data = await response.json();
        const incomeArray = Array(12).fill(0);
        Object.keys(data).forEach((month) => {
          incomeArray[month - 1] = data[month];
        });
        setMonthlyIncome(incomeArray);
      } catch (error) {
        console.error("Error fetching monthly income data:", error);
      }
    };

    const fetchMonthlyExpense = async () => {
      try {
        const response = await fetch(
          `http://localhost:8087/expense/total-monthly?year=${year}&institutecode=${getInstituteCode()}`
        );
        const data = await response.json();
        const expenseArray = Array(12).fill(0);
        Object.keys(data).forEach((month) => {
          expenseArray[month - 1] = data[month];
        });
        setMonthlyExpense(expenseArray);
      } catch (error) {
        console.error("Error fetching monthly expense data:", error);
      }
    };

    fetchIncomeData();
    fetchExpenseData();
    fetchSavingsData();
    fetchMonthlyIncome();
    fetchMonthlyExpense();
  }, [year]);
  // Fetch pie chart data

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [incomeResponse, expenseResponse] = await Promise.all([
          fetch(
            `http://localhost:8087/dashboard/totalIncomeByCategory?year=${year}&month=${month}&institutecode=${getInstituteCode()}`
          ),
          fetch(
            `http://localhost:8087/dashboard/totalExpenseByCategory?year=${year}&month=${month}&institutecode=${getInstituteCode()}`
          ),
        ]);
        const incomeData = await incomeResponse.json();
        const expenseData = await expenseResponse.json();
        // Sanitize income data
        const sanitizedIncomeData = Object.fromEntries(
          Object.entries(incomeData).map(([category, value]) => [
            category,
            value !== null ? value : 0,
          ])
        );
        // Sanitize expense data
        const sanitizedExpenseData = Object.fromEntries(
          Object.entries(expenseData).map(([category, value]) => [
            category,
            value !== null ? value : 0,
          ])
        );
        setIncomeCategories(sanitizedIncomeData);
        setExpenseCategories(sanitizedExpenseData);
      } catch (error) {
        console.error("Error fetching categories data:", error);
      }
    };
    fetchCategories();
  }, [year, month]);

  // Determine text for savings/loss card
  const savingsText = savingsData >= 0 ? "Saving" : "Loss";
  const todaytext =
    incomeData.today - expenseData.today >= 0 ? "Saving" : "Loss";
  const _7Daystext =
    incomeData.last7Days - expenseData.last7Days >= 0 ? "Saving" : "Loss";
  const _30Daystext =
    incomeData.last30Days - expenseData.last30Days >= 0 ? "Saving" : "Loss";
  const _365Daystext =
    incomeData.last365Days - expenseData.last365Days >= 0 ? "Saving" : "Loss";
  // Format data values with commas
  const formatValue = (value) => Math.abs(value).toLocaleString();

  // Data for the overall comparison chart
  const overallData = {
    labels: ["Today's", "7 Day's", "30 Day's", "365 Day's", "Total"],
    datasets: [
      {
        label: "Income",
        data: [
          incomeData.today || 0,
          incomeData.last7Days || 0,
          incomeData.last30Days || 0,
          incomeData.last365Days || 0,
          incomeData.total || 0,
        ],
        backgroundColor: "#3498DB",
      },
      {
        label: "Expense",
        data: [
          expenseData.today || 0,
          expenseData.last7Days || 0,
          expenseData.last30Days || 0,
          expenseData.last365Days || 0,
          expenseData.total || 0,
        ],
        backgroundColor: "#FF6F61",
      },
    ],
  };

  const overallOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return (
              tooltipItem.dataset.label +
              ": " +
              tooltipItem.raw.toLocaleString()
            );
          },
        },
      },
    },
  };

  // Data for the monthly chart
  const monthlyData = {
    labels: [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Income",
        data: monthlyIncome,
        borderColor: "#3498DB",
        backgroundColor: "#3498DB",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Expense",
        data: monthlyExpense,
        borderColor: "#FF6F61",
        backgroundColor: "#FF6F61",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const monthlyOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return (
              tooltipItem.dataset.label +
              ": " +
              tooltipItem.raw.toLocaleString()
            );
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  // Generate the last 10 years for the year dropdown
  const years = Array.from(
    new Array(10),
    (val, index) => new Date().getFullYear() - index
  );
  const incomeCategoryData = Object.keys(incomeCategories).map((key) => ({
    category: key,
    value: incomeCategories[key].total || 0,
  }));

  const expenseCategoryData = Object.keys(expenseCategories).map((key) => ({
    category: key,
    value: expenseCategories[key].total || 0,
  }));

  useEffect(() => {
    if (showPending) {
      const fetchPendingData = async () => {
        try {
          const [pendingIncomeResponse, pendingExpenseResponse] = await Promise.all([
            fetch(`http://localhost:8087/dashboard/income/pending?institutecode=${getInstituteCode()}`),
            fetch(`http://localhost:8087/dashboard/expense/pending?institutecode=${getInstituteCode()}`),
          ]);
  
          const [incomeData, expenseData] = await Promise.all([
            pendingIncomeResponse.json(),
            pendingExpenseResponse.json(),
          ]);
  
          // Assuming the structure of the response matches the one you provided
          const incomeStats = {
            today: incomeData.today,
            last7Days: incomeData.last7Days,
            last30Days: incomeData.last30Days,
            last365Days: incomeData.last365Days,
            total: incomeData.total,
          };
  
          const expenseStats = {
            today: expenseData.today,
            last7Days: expenseData.last7Days,
            last30Days: expenseData.last30Days,
            last365Days: expenseData.last365Days,
            total: expenseData.total,
          };
  
          // Update your state with the fetched data
          setPendingIncomeStats(incomeStats);
          setPendingExpenseStats(expenseStats);
        } catch (error) {
          console.error("Error fetching pending data:", error);
        }
      };
  
      fetchPendingData();
    }
  }, [showPending]);
  

  const togglePending = () => {
    setShowPending((prev) => !prev);
  };

  const incomePieData = {
    labels: Object.keys(incomeCategories),
    datasets: [
      {
        data: Object.values(incomeCategories),
        backgroundColor: [
          "#FF6F61",
          "#3498DB",
          "#F9E79F",
          
        ],
      },
    ],
  };

  const expensePieData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          "#FF6F61",
          "#3498DB",
          "#F9E79F",
         
        ],
      },
    ],
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Function to format the count up value
  const formattedCountUp = (value) => (
    <CountUp end={value} duration={2.5} formattingFn={formatValue} />
  );
  const PopTypography = styled(Typography)`
    @keyframes pop {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;
  return (
    <div>
      {/* <PopTypography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "#24A0ED",
          borderRadius: "150px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        Income & Expense Dashboard
      </PopTypography> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F9E79F",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Today's Income</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(incomeData.today || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#FF6F61", // Mint Green
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">7 Day's Income</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(incomeData.last7Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#3498DB",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">30 Day's Income</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(incomeData.last30Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F9E79F",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">365 Day's Income</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(incomeData.last365Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#FF6F61",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Total Income</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(incomeData.total || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F9E79F",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Today's Expense</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(expenseData.today || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#FF6F61",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">7 Day's Expense</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(expenseData.last7Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#3498DB",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">30 Day's Expense</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(expenseData.last30Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F9E79F",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">365 Day's Expense</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(expenseData.last365Days || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#FF6F61",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Total Expense</Typography>
            <Typography variant="h5">
              ₹{formattedCountUp(expenseData.total || 0)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F9E79F",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Today's {todaytext}</Typography>
            <Typography
              variant="h5"
              className={incomeData.today - expenseData.today >= 0}
            >
              ₹{formattedCountUp(incomeData.today - expenseData.today)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#FF6F61", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">7 Day's {_7Daystext}</Typography>
            <Typography
              variant="h5"
              className={incomeData.last7Days - expenseData.last7Days >= 0}
            >
              ₹{formattedCountUp(incomeData.last7Days - expenseData.last7Days)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#3498DB", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">30 Day's {_30Daystext}</Typography>
            <Typography
              variant="h5"
              className={incomeData.last30Days - expenseData.last30Days >= 0}
            >
              ₹
              {formattedCountUp(incomeData.last30Days - expenseData.last30Days)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#F9E79F", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">365 Day's {_365Daystext}</Typography>
            <Typography
              variant="h5"
              className={incomeData.last365Days - expenseData.last365Days >= 0}
            >
              ₹
              {formattedCountUp(
                incomeData.last365Days - expenseData.last365Days
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#FF6F61", // Light Orange
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 3,
            }}
          >
            <Typography variant="h7">Total {savingsText}</Typography>
            <Typography
              variant="h5"
              className={
                savingsData >= 0 //? "savings-positive" : "savings-negative"
              }
            >
              ₹{formattedCountUp(savingsData)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* pending income & Exepense */}

      <Grid container justifyContent="center" spacing={2} mt={1}>
        <Grid item>
          <Button variant="contained" onClick={togglePending}>
            {showPending ? "Hide Pending Amount" : "Show Pending Amount"}
          </Button>
        </Grid>
      </Grid>

      {showPending && (
  <Grid container spacing={2} style={{ marginTop: "10px" }}>
    {/* Today's Pending Income */}
    <InfoCard
      sx={{}}
      title="Today's Pending INC"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingIncomeStats.today || 0)}</span>}
      color="#F9E79F"
    />
    {/* Last 7 Days Pending Income */}
    <InfoCard
      title="7 Days Pending INC"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingIncomeStats.last7Days || 0)}</span>}
      color="#FF6F61"
    />
    {/* Last 30 Days Pending Income */}
    <InfoCard
      title="30 Days Pending INC"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingIncomeStats.last30Days || 0)}</span>}
      color="#3498DB"
    />
    {/* Last 365 Days Pending Income */}
    <InfoCard
      title={<span style={{ fontSize: "15px" }}>365 Days Pending INC</span>}
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingIncomeStats.last365Days || 0)}</span>}
      color="#F9E79F"
    />
    {/* Total Pending Income */}
    <InfoCard
      title="Total Pending INC"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingIncomeStats.total || 0)}</span>}
      color="#FF6F61"
    />

    {/* Today's Pending Expense */}
    <InfoCard
      title="Today's Pending EXP"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingExpenseStats.today || 0)}</span>}
      color="#F9E79F"
    />
    {/* Last 7 Days Pending Expense */}
    <InfoCard
      title="7 Days Pending EXP"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingExpenseStats.last7Days || 0)}</span>}
      color="#FF6F61"
    />
    {/* Last 30 Days Pending Expense */}
    <InfoCard
      title="30 Days Pending EXP"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingExpenseStats.last30Days || 0)}</span>}
      color="#3498DB"
    />
    {/* Last 365 Days Pending Expense */}
    <InfoCard
      title={<span style={{ fontSize: "15px" }}>365 Days Pending EXP</span>}
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingExpenseStats.last365Days || 0)}</span>}
      color="#F9E79F"
    />
    {/* Total Pending Expense */}
    <InfoCard
      title="Total Pending EXP"
      value={<span style={{ fontSize: "27px" }}>{formattedCountUp(pendingExpenseStats.total || 0)}</span>}
      color="#FF6F61"
    />
  </Grid>
)}

      {/* pending inc exp */}
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={6}
          style={{ display: "flex", alignItems: "stretch" }}
        >
          <Paper
            elevation={3}
            style={{ padding: "20px", marginTop: "20px", flex: 1 }}
          >
            <Typography variant="body1" align="center">
              Overall Income & Expense Comparison
            </Typography>
            <Bar data={overallData} options={overallOptions} />
          </Paper>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          className="textField-root"
          style={{ display: "flex", alignItems: "stretch" }}
        >
          <Paper
              elevation={3}
              style={{ padding: "20px", marginTop: "20px", flex: 1 }}
          >
              <Box
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      mb={2} // Adds margin below the line
    >
              <Typography variant="body1" align="center" mr={2}>
              {year} Income & Expense Comparison
            </Typography>
            <TextField
              select
              label="Year"
              value={year}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>
            </Box>
            <Line data={monthlyData} options={monthlyOptions} />
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Grid
          container
          spacing={3}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          {/* Selection Grid for Year and Month */}
          <Grid
            container
            spacing={2}
            style={{
              marginBottom: "10px",
              textAlign: "center",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <Grid item xs={12} sm={6} md={1.5} className="textField-root">
              <TextField
                select
                label="Year"
                value={year}
                onChange={handleYearChange}
                fullWidth
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={1.5} className="textField-root">
              <TextField
                select
                label="Month"
                value={month}
                onChange={handleMonthChange}
                fullWidth
              >
                {months.map((month, index) => (
                  <MenuItem key={month} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Pie Charts Grid */}
          <Grid
            container
            spacing={3}
            style={{ marginTop: "10px", justifyContent: "center" }}
          >
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom align="center">
                Income Categories ({months[month - 1]} {year})
              </Typography>
              <div
                style={{
                  padding: "16px",
                  height: 500,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pie data={incomePieData} />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom align="center">
                Expense Categories ({months[month - 1]} {year})
              </Typography>
              <div
                style={{
                  padding: "16px",
                  height: 500,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pie data={expensePieData} />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default IncomeExpenseDashboard;
