import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Paper,
  MenuItem,
  Box,
  TextField,
} from "@mui/material";
import { ResponsiveLine } from "@nivo/line"; 
import { Chart } from "react-google-charts";
import axios from "axios";
import YearlyGraph from "./YearlyGraph";
const generateYearRange = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 7; i <= currentYear + 7; i++) {
    years.push(i);
  }
  return years;
};
export default function DashBoard() {
  const [totalApplications, setTotalApplications] = useState(0);
  const [selectedApi, setSelectedApi] = useState("All");
  const [numberFromApi, setNumberFromApi] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRangeInquiriesCount, setDateRangeInquiriesCount] = useState(0);
  // const [adminemail, setAdminemail]=useState(localStorage.getItem('loggedInUserEmail') || '');
  const [institutecode, setInstituteCode] = useState(
    localStorage.getItem("institutecode") || ""
  );
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(new Date().getFullYear());
  const [perYear, setPerYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Month is 0-indexed in JS
  const [perData, setPerData] = useState([]);
  useEffect(() => {
    fetchData(year);
  }, [year]);
  const fetchData = async (selectedYear) => {
    try {
      const response = await axios.get(
        "https://pjsofttech.in:14443/getYearlyEnquiryCountOfAllMonths",
        {
          params: {
            year: selectedYear,
            institutecode: institutecode,
          },
        }
      );
      const monthlyData = transformData(response.data);
      setData(monthlyData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const transformData = (data) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month, index) => ({
      month,
      count: data[index + 1] || 0, // API uses 1-based index for months
    }));
  };
  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };
  useEffect(() => {
    async function fetchPerData() {
      const instituteCode = localStorage.getItem("institutecode"); // Get instituteCode from local storage

      if (!instituteCode) {
        console.error("Institute Code not found in local storage.");
        return;
      }
      try {
        const response = await fetch(
          `https://pjsofttech.in:14443/inquiriesCountBymonthofallDays?month=${month}&year=${perYear}&institutecode=${instituteCode}`
        );
        const result = await response.json();
        // Sort the result by date in ascending order
        const sortedData = result.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setPerData(sortedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchPerData();
  }, [month, perYear]); // Fetch data when month or year changes
  const handlePerYearChange = (event) => {
    setPerYear(event.target.value);
  };
  const fetchEnquiriesByDateRange = async () => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(
          `https://pjsofttech.in:14443/get/getALLEnquiryByInstitutecode?institutecode=${institutecode}`
        );
        const data = response.data;
        const filteredEnquiries = data.filter((enquiry) => {
          const enquiryDate = new Date(enquiry.enquiryDate)
            .toISOString()
            .split("T")[0];
          return enquiryDate >= startDate && enquiryDate <= endDate;
        });
        const examCount = {};
        filteredEnquiries.forEach((enquiry) => {
          const ex = enquiry.exam;
          if (ex) {
            examCount[ex] = (examCount[ex] || 0) + 1;
          }
        });
        setExamData(
          Object.entries(examCount).map(([ex, count]) => [ex, count])
        );
        const sourceCount = {};
        filteredEnquiries.forEach((enquiry) => {
          const sr = enquiry.source_by;
          if (sr) {
            sourceCount[sr] = (sourceCount[sr] || 0) + 1;
          }
        });
        setSourceData(
          Object.entries(sourceCount).map(([sr, count]) => [sr, count])
        );
        setDateRangeInquiriesCount(filteredEnquiries.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  useEffect(() => {
    fetchEnquiriesByDateRange();
  }, [startDate, endDate, institutecode]);
  const handleDateChange = (e) => {
    if (e.target.name === "startDate") {
      setStartDate(e.target.value);
    } else if (e.target.name === "endDate") {
      setEndDate(e.target.value);
    }
  };
  const fetchTotalEnquiries = async () => {
    try {
      const response = await axios.get(
        `https://pjsofttech.in:14443/get/getALLEnquiryByInstitutecode?institutecode=${institutecode}`
      );
      setNumberFromApi(response.data.totalEnquiries);
    } catch (error) {
      console.error("Error fetching total enquiries:", error);
    }
  };
  useEffect(() => {
    if (selectedApi === "All") {
      fetchTotalEnquiries();
    } else {
      fetch(apiUrls[selectedApi])
        .then((response) => response.json())
        .then((data) => {
          console.log("Data from selected API:", data);
          setNumberFromApi(data);
        })
        .catch((error) => {
          console.error("Error fetching data from selected API:", error);
        });
    }
  }, [selectedApi]);
  const apiUrls = {
    "7Days": `https://pjsofttech.in:14443/numberOfEnquiry7days?institutecode=${institutecode}`,
    "30Days": `https://pjsofttech.in:14443/numberOfEnquiry30days?institutecode=${institutecode}`,
    "365Days": `https://pjsofttech.in:14443/numberOfEnquiry365days?institutecode=${institutecode}`,
  };
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  useEffect(() => {
    const apiUrl = `https://pjsofttech.in:14443/getenquiryCount?institutecode=${institutecode}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from getAll:", data);
        setTotalApplications(data);
        // Assuming data directly gives you the total applications count
      })
      .catch((error) => {
        console.error("Error fetching data from getEnquiryCount:", error);
      });
  }, [institutecode]); // Added adminemail to the dependency array
  const [sevenDaysApplication, setSevenDaysApplication] = useState(0);
  useEffect(() => {
    const apiUrl = `https://pjsofttech.in:14443/numberOfEnquiry7days?institutecode=${institutecode}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from get7days:", data);
        setSevenDaysApplication(data);
      })
      .catch((error) => {
        console.error("Error fetching data from getAllFees:", error);
      });
  }, [institutecode]);
  const [thirtyDaysApplication, setThirtyDaysApplication] = useState(0);
  useEffect(() => {
    const apiUrl = `https://pjsofttech.in:14443/numberOfEnquiry30days?institutecode=${institutecode}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from get30days:", data);
        setThirtyDaysApplication(data);
      })
      .catch((error) => {
        console.error("Error fetching data from getAllFees:", error);
      });
  }, [institutecode]);
  const [threeSixtyFiveDaysApplication, setThreeSixtyFiveDaysApplication] =
    useState(0);
  useEffect(() => {
    const apiUrl = `https://pjsofttech.in:14443/numberOfEnquiry365days?institutecode=${institutecode}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from get365days:", data);
        setThreeSixtyFiveDaysApplication(data);
      })
      .catch((error) => {
        console.error("Error fetching data from getAllFees:", error);
      });
  }, [institutecode]);
  const [examData, setExamData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days");
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };
  const periodData = () => {
    switch (selectedPeriod) {
      case "Today":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: todaysApplications,
          },
        ];
      case "Last 7 Days":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: sevenDaysApplication,
          },
        ];
      case "Last 30 Days":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: thirtyDaysApplication,
          },
        ];
      case "Last 365 Days":
        return [
          {
            name: "Total Enquiries",
            total: totalApplications,
            period: threeSixtyFiveDaysApplication,
          },
        ];
      default:
        return [];
    }
  };
  const [todaysApplications, setTodaysApplications] = useState(0);
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        // Fetch today's enquiry count directly
        const todaysResponse = await axios.get(
          `https://pjsofttech.in:14443/getenquiryCount/today?institutecode=${institutecode}`
        );
        setTodaysApplications(todaysResponse.data);
        console.log("Data from todays:", todaysResponse.data);
        // Fetch all enquiries to calculate exam and source counts
        const allEnquiriesResponse = await axios.get(
          `https://pjsofttech.in:14443/get/getALLEnquiryByInstitutecode?institutecode=${institutecode}`
        );
        const allEnquiriesData = allEnquiriesResponse.data;
        setTotalApplications(allEnquiriesData.length); // Assuming you want the total count of all enquiries
        // Count exams
        const examCount = {};
        allEnquiriesData.forEach((enquiry) => {
          const ex = enquiry.exam;
          if (ex) {
            examCount[ex] = (examCount[ex] || 0) + 1;
          }
        });
        setExamData(
          Object.entries(examCount).map(([ex, count]) => [ex, count])
        );
        // Count sources
        const sourceCount = {};
        allEnquiriesData.forEach((enquiry) => {
          const sr = enquiry.source_by;
          if (sr) {
            sourceCount[sr] = (sourceCount[sr] || 0) + 1;
          }
        });
        setSourceData(
          Object.entries(sourceCount).map(([sr, count]) => [sr, count])
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchEnquiries();
  }, [institutecode]);
  const examChartData = [
    ["Exam", "Enquiry Count", { role: "style" }],
    ...(examData.length
      ? examData.map(([ex, count], index) => {
          const colors = ["#F9E79F", "#FF6F61", "#3498DB"];
          return [ex, count, colors[index % colors.length]];
        })
      : [["No Data", 0, "color:#DDD"]]),
  ];
  const examChartOptions = {
    label: { title: "Enquiry Count" },
    xAxis: {
      title: "Enquiry Count",
      ticks: Array.from(
        { length: Math.max(...examData.map(([_, count]) => count)) + 1 },
        (_, i) => i
      ),
    },
    yAxis: { title: "Exam" },
    legend: "none",
    chartArea: { width: "70%", height: "70%" },
    bar: { groupWidth: "75%" },
  };
  const sourceChartData = [
    ["Source By", "Enquiry Count", { role: "style" }],
    ...(sourceData.length
      ? sourceData.map(([sr, count], index) => {
          const colors = ["#F9E79F", "#FF6F61", "#3498DB"];
          return [sr, count, colors[index % colors.length]];
        })
      : [["No Data", 0, "color:#DDD"]]),
  ];
  const sourceChartOptions = {
    xAxis: {
      title: "Enquiry Count",
      ticks: Array.from(
        { length: Math.max(...sourceData.map(([_, count]) => count)) + 1 },
        (_, i) => i
      ),
    },
    yAxis: { title: "Sourcen By" },
    legend: "none",
    chartArea: { width: "70%", height: "70%" },
    bar: { groupWidth: "75%" },
  };
  // Transform data to match Nivo's format
  const chartData = perData.length
  ? [
      {
        id: "inquiries",
        color: "hsl(211, 70%, 50%)", // Default color or can customize
        data: perData.map((item) => ({
          x: new Date(item.date).getDate(),
          y: item.count,
        })),
      },
    ]
  : [];
  return (
    <div sx={{ padding: 2, width: "100%" }}>
      <Box mt={1} textAlign="center" sx={{ width: "100%" }}>
        <Grid
          container
          spacing={1}
          justifyContent="center"
          className="textField-root"
        >
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#F9E79F",
                borderRadius: "10px",
                fontWeight:'bold'
              }}
            >
              <Typography variant="h7" mt={1}>
                Today
              </Typography>
              <Typography variant="h5">{todaysApplications}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#FF6F61",
                borderRadius: "10px",
                fontWeight:'bold'
              }}
            >
              <Typography variant="h7" mt={1}>
                Last 7 Days
              </Typography>
              <Typography variant="h5">{sevenDaysApplication}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#3498DB",
                borderRadius: "10px",
                fontWeight:'bold'
              }}
            >
              <Typography variant="h7" mt={1}>
                Last 30 Days
              </Typography>
              <Typography variant="h5">{thirtyDaysApplication}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#F9E79F",
                borderRadius: "10px",
                fontWeight:'bold'
              }}
            >
              <Typography variant="h7" mt={1}>
                Last 365 Days
              </Typography>
              <Typography variant="h5">
                {threeSixtyFiveDaysApplication}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2.4}>
            <Paper
              elevation={3}
              style={{
                padding: "16px",
                backgroundColor: "#FF6F61",
                borderRadius: "10px",
                fontWeight:'bold'
              }}
            >
              <Typography variant="h7" mt={1}>
                Total Enquiries
              </Typography>
              <Typography variant="h5">{totalApplications}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
          mt={3}
          className="textField-root"
        >
          {/* Monthly Inquiry Count Chart */}
          <Grid item xs={12} sm={6} style={{ padding: "16px" }}>
      <Paper elevation={3} style={{ padding: "16px", height: "100%" }}>
        <Grid container alignItems="center" justifyContent="center" gap={2}>
          <Grid item>
            <Typography variant="body1">Monthly Inquiry Count Chart</Typography>
          </Grid>
          <Grid item >
           
            <TextField
              select
              value={month}
              onChange={handleMonthChange}
              label="Month"
              size="small"
            >
              {Array.from({ length: 12 }, (v, k) => (
                <MenuItem key={k + 1} value={k + 1}>
                  {new Date(0, k).toLocaleString("default", { month: "long" })}
                </MenuItem>
              ))}
            </TextField>
            </Grid>
            <Grid >
            <TextField
              select
              size="small"
              value={perYear}
              onChange={handlePerYearChange}
              label="Year"
              style={{ marginRight: "8px" }} // slight margin for spacing
            >
              {[...Array(5)].map((_, idx) => {
                const year = currentYear - idx;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
        </Grid>
        {/* Nivo ResponsiveLine Chart */}
        <div style={{ height: "400px", marginTop: "16px" }}>
  {chartData.length ? (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 50, right: 35, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Day",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Inquiry Count",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      colors={"#3498DB"}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
    />
  ) : (
    <Typography variant="body1" align="center">
      No data available for the selected month and year.
    </Typography>
  )}
</div>
      </Paper>
    </Grid>
          {/* Year Change Graph */}
          <Grid item xs={6} style={{ padding: "16px" }}>
            {" "}
            {/* Added padding */}
            <Paper elevation={3} style={{ padding: "16px", height: "100%" }}>
              <YearlyGraph />
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={3} style={{ padding: "15px" }}>
          <Grid
         
            align={"left"}
            display={"inline-flex"}
            fullWidth
            className="textField-root"
          >
            <Typography variant="body1" ml={2}>
              Enquiries: <strong>{dateRangeInquiriesCount}</strong>
            </Typography>
            <Box display="flex" alignItems="center" ml={2} gap={2}>
              <TextField
                className="textField-root"
                type="date"
                name="startDate"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={handleDateChange}
                size="small"
                variant="outlined"
              />
              <TextField
                className="textField-root"
                type="date"
                name="endDate"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={handleDateChange}
                size="small"
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid
            container
           
            spacing={1}
            justifyContent="center"
            className="textField-root"
          >
            {/* Exam Chart and Source Chart in one line */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Exam Chart</Typography>
              <Chart
                chartType="ColumnChart"
                data={examChartData}
                options={examChartOptions}
                width="100%"
                height="400px"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Source Chart</Typography>
              <Chart
                chartType="ColumnChart"
                data={sourceChartData}
                options={sourceChartOptions}
                width="100%"
                height="400px"
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </div>
  );
}