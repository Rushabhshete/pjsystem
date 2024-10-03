import React, { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Grid,
  Paper,
  FormControl,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import { Chart } from "react-google-charts";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28"];

const getColor = (index) => {
  return colors[index % colors.length];
};

const Home = () => {
  const [totalApplications, setTotalApplications] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [selectedApi, setSelectedApi] = useState("ALL");
  const [startDate, setFromDate] = useState("");
  const [endDate, setToDate] = useState("");
  const [standardOptions, setStandardOptions] = useState([]);
  const [standardData, setStandardData] = useState([]);
  const institutecode = () => localStorage.getItem("institutecode");

  const apiUrls = useMemo(
    () => ({
      ALL: `http://13.233.43.240:8080/totalApplication/status/number?institutecode=${institutecode()}`,
      Today: `http://13.233.43.240:8080/status-counts?institutecode=${institutecode()}&period=today`,
      "7Days": `http://13.233.43.240:8080/status-counts?institutecode=${institutecode()}&period=7-days`,
      "30Days": `http://13.233.43.240:8080/status-counts?institutecode=${institutecode()}&period=30-days`,
      "365Days": `http://13.233.43.240:8080/status-counts?institutecode=${institutecode()}&period=365-days`,
      FromTo: (startDate, endDate) =>
        `http://13.233.43.240:8080/status-counts?institutecode=${institutecode()}&startDate=${startDate}&endDate=${endDate}&period=custom`,
    }),
    []
  );

  const fetchReportData = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      setTotalApplications(data.totalApplications);
      setPendingReviews(data.Pending);
      setAccepted(data.Approved);
      setRejected(data.Rejected);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };
  const chartData = [
    ["Status", "Count", { role: "style" }],
    ["Application", totalApplications, "#ffcccb"], // Application bar color
    ["Accepted", accepted, "#90ee90"], // Accepted bar color
    ["Rejected", rejected, "#ffa07a"], // Rejected bar color
    ["Pending", pendingReviews, "#add8e6"], // Pending bar color
  ];

  const chartOptions = {
    title: "Admission Statistics",
    is3D: true,
    legend: { position: "none" }, // Hide legend if not needed
    bars: "horizontal", // Display bars horizontally
    chartArea: { width: "50%" }, // Adjust chart area width
    hAxis: {
      title: "Count",
      minValue: 0,
    },
    vAxis: {
      title: "Status",
    },
  };
  useEffect(() => {
    if (selectedApi && selectedApi !== "FromTo") {
      fetchReportData(apiUrls[selectedApi]);
    }
  }, [selectedApi, apiUrls]);

  const fetchDataForDateRange = () => {
    if (startDate && endDate) {
      fetchReportData(apiUrls.FromTo(startDate, endDate));
    } else {
      console.log("Please select both start and end dates.");
    }
  };

  useEffect(() => {
    const fetchStandardOptions = async () => {
      try {
        const response = await axios.get(
          `http://13.233.43.240:8080/all?institutecode=${institutecode()}`
        );
        setStandardOptions(response.data);
      } catch (error) {
        console.error("Error fetching standard options:", error);
      }
    };

    fetchStandardOptions();
  }, []);

  useEffect(() => {
    const fetchStandardData = async () => {
      try {
        const dataPromises = standardOptions.map((standard) =>
          axios.get(
            `http://13.233.43.240:8080/numberOfstandardOptions/${standard.standardname}?institutecode=${institutecode()}`
          )
        );
        const responses = await Promise.all(dataPromises);
        const data = responses.map((response, index) => ({
          standardname: standardOptions[index].standardname,
          Count: response.data,
        }));
        setStandardData(data);
      } catch (error) {
        console.error("Error fetching standard data:", error);
      }
    };

    if (standardOptions.length > 0) {
      fetchStandardData();
    }
  }, [standardOptions]);

  return (
    <div>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ marginY: 3 }}
      >
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={16} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#ffcccb",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6">Total Applications</Typography>
            <Typography variant="h4">{totalApplications}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#add8e6",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6">Pending Reviews</Typography>
            <Typography variant="h4">{pendingReviews}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#90ee90",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6">Accepted</Typography>
            <Typography variant="h4">{accepted}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#ffa07a",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6">Rejected</Typography>
            <Typography variant="h4">{rejected}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <TextField
                  name="Select Report"
                  select
                  label="Select Report"
                  value={selectedApi}
                  onChange={(e) => setSelectedApi(e.target.value)}
                >
                  {" "}
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="7Days">Last 7 Days</MenuItem>
                  <MenuItem value="30Days">Last 30 Days</MenuItem>
                  <MenuItem value="365Days">Last 365 Days</MenuItem>
                  <MenuItem value="FromTo">Custom Date</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            {selectedApi === "FromTo" && (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="From"
                    type="date"
                    value={startDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="To"
                    type="date"
                    value={endDate}
                    onChange={(e) => setToDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchDataForDateRange}
                    sx={{ marginTop: 2 }}
                  >
                    Search
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
      <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={standardData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="standardname" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Count" fill="#8884d8">
              {
                standardData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ padding: 2, borderRadius: 2, boxShadow: 3 }}
          >
            <Chart
              width={"100%"}
              height={400}
              chartType="BarChart"
              loader={<div>Loading Chart...</div>}
              data={chartData}
              options={chartOptions}
              rootProps={{ "data-testid": "1" }}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;