import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  Paper,
  MenuItem,
  TextField
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar'; // Import Nivo bar chart
import { ResponsivePie } from '@nivo/pie'; // Import Nivo pie chart
import qs from 'qs';


const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
  typography: {
    h4: { fontWeight: 600, marginBottom: '16px' },
    h6: { fontWeight: 500 },
  },
});

const SalaryDashBoard = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [totalEmployees, setTotalEmployees] = useState('0');
  const [paidEmployees, setPaidEmployees] = useState(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [pendingEmployees, setPendingEmployees] = useState(null);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [grossSalary, setGrossSalary] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [selectChartMonth, setSelectChartMonth] = useState(currentDate.getMonth() + 1);
  const [selectChartYear, setSelectChartYear] = useState(currentDate.getFullYear());
  const [chart2Data, setChart2Data] = useState([]);
  const [selectedChart2Year, setSelectedChart2Year] = useState(currentDate.getFullYear());
  const currentYear = currentDate.getFullYear();
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');

  const years = Array.from({ length: 15 }, (_, i) => currentYear - 7 + i);
  const months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
  ];

  useEffect(() => {
    if (selectedYear) {
      if (selectedMonth) {
        fetchEmployeesByMonthYear(selectedMonth, selectedYear);
      } else {
        fetchTotalEmployeesByYear(selectedYear);
      }
    }
  }, [selectedMonth, selectedYear]);

  const fetchEmployeesByMonthYear = async (month, year) => {
    try {
      const [totalEmployeesResponse, paidEmployeesResponse, pendingEmployeesResponse, grossSalaryResponse, paidAmountResponse, pendingAmountResponse] = await Promise.all([
        axios.get('http://localhost:8082/salaries/salarycountbymonthyear', { params: { month, year, institutecode } }),
        axios.get('http://localhost:8082/salaries/Paidcountbyyearmonth', { params: { month, year , institutecode} }),
        axios.get('http://localhost:8082/salaries/Pendingcountbyyearmonth', { params: { month, year, institutecode } }),
        axios.get('http://localhost:8082/salaries/totalwithdrawalbymonthyear', { params: { month, year , institutecode} }),
        axios.get('http://localhost:8082/salaries/paidamountbymonthandyear', { params: { month, year, institutecode } }),
        axios.get('http://localhost:8082/salaries/pendingamountbymonthandyear', { params: { month, year, institutecode } })
      ]);
      setTotalEmployees(totalEmployeesResponse.data);
      setPaidEmployees(paidEmployeesResponse.data);
      setPendingEmployees(pendingEmployeesResponse.data);
      setGrossSalary(grossSalaryResponse.data);
      setPaidAmount(paidAmountResponse.data);
      setPendingAmount(pendingAmountResponse.data);
    } catch (error) {
      console.error('Error fetching data by month/year:', error);
    }
  };

  const fetchTotalEmployeesByYear = async (year) => {
    try {
      const response = await axios.get('http://localhost:8082/salaries/salarycountbyyear', { params: { year, institutecode } });
      setTotalEmployees(response.data);
      setPaidEmployees(null);
      setPendingEmployees(null);
      setGrossSalary(null);
      setPaidAmount(null);
      setPendingAmount(null);
    } catch (error) {
      console.error('Error fetching total employees by year:', error);
    }
  };

  useEffect(() => {
    fetchChartData(selectedChart2Year);
  }, [selectedChart2Year, institutecode]);

  const fetchChartData = async (year) => {
    try {
      const response = await axios.get(`http://localhost:8082/salaries/salariesbyYear?year=${year}&institutecode=${institutecode}`);
      const data = response.data;
      const formattedData = months.map(month => ({
        name: month.name,
        finalNetSalary: data[month.value] || 0
      }));
      setChart2Data(formattedData);
    } catch (error) {
      console.error('Error fetching chart data', error);
    }
  };

  useEffect(() => {
    const fetchData = async (month, year) => {
      try {
        const response = await axios.get(`http://localhost:8082/salaries/compareSalaryByMonth?month=${month}&year=${year}&institutecode=${institutecode}`);
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (selectChartMonth && selectChartYear) {
      fetchData(selectChartMonth, selectChartYear);
    }
  }, [selectChartMonth, selectChartYear, institutecode]);

  const handleChartMonthChange = (event) => {
    setSelectChartMonth(event.target.value);
  };

  const handleChartYearChange = (event) => {
    setSelectChartYear(event.target.value);
  };

  const formattedChartData = [
    {
      name: 'Salary Comparison',
      currentMonthTotal: chartData?.currentMonthTotal || 0,
      previousMonthTotal: chartData?.previousMonthTotal || 0,
    },
  ];

  const [selectedStartYear, setSelectedStartYear] = useState(currentYear - 1);
  const [selectedEndYear, setSelectedEndYear] = useState(currentYear);
  const [comparisonData, setComparisonData] = useState(null);
  
  useEffect(() => {
    const fetchComparisonData = async (startYear, endYear) => {
      try {
        const response = await axios.get(`http://localhost:8082/salaries/yearlyFinalNetSalaryComparison`, {
          params: {
            institutecode: `${institutecode}`,  // Add your actual institutecode here
            years: [startYear, endYear]  // Pass both selected years in an array
          },
          paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: "repeat" });  // To serialize `years[]` as repeated params
          }
        });
  
        setComparisonData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    if (selectedStartYear && selectedEndYear) {
      fetchComparisonData(selectedStartYear, selectedEndYear);
    }
  }, [selectedStartYear, selectedEndYear]);
  
  const handleStartYearChange = (event) => {
    setSelectedStartYear(event.target.value);
  };
  
  const handleEndYearChange = (event) => {
    setSelectedEndYear(event.target.value);
  };
  
  // Formatting the comparison data for the chart
  const formattedComparisonData = comparisonData ? [
    { name: `Year ${selectedStartYear}`, value: comparisonData[selectedStartYear] },
    { name: `Year ${selectedEndYear}`, value: comparisonData[selectedEndYear] }
  ] : [];

  const COLORS = ['#FF6F61', '#3498DB'];

  return (
    <div sx={{ padding: 2, width: "100%" }}>
        <Grid container  justifyContent="center" >
          <Grid container spacing={2}  mt={1}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#F9E79F', borderRadius: '10px' }}>
                <Typography variant="h7">Total Salaries:</Typography>
                <Typography variant="h5">{totalEmployees !== null ? totalEmployees : 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#FF6F61', borderRadius: '10px' }}>
                <Typography variant="h7">Paid Salary:</Typography>
                <Typography variant="h5">{paidEmployees !== null ? paidEmployees : 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#3498DB', borderRadius: '10px' }}>
                <Typography variant="h7">Pending Salary:</Typography>
                <Typography variant="h5">{pendingEmployees !== null ? pendingEmployees : 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#F9E79F', borderRadius: '10px' }}>
                <Typography variant="h7">Total Salary:</Typography>
                <Typography variant="h5">{grossSalary || "0"}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#FF6F61', borderRadius: '10px' }}>
                <Typography variant="h7">Paid Amount:</Typography>
                <Typography variant="h5">{paidAmount !== null ? paidAmount : 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#3498DB', borderRadius: '10px' }}>
                <Typography variant="h7">Pending Amount:</Typography>
                <Typography variant="h5">{pendingAmount !== null ? pendingAmount : 0}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='textField-root'>
              <FormControl fullWidth size="small" style={{ marginBottom: '16px' }}>
                <TextField
                  select
                  size="small"
                  label='Month'
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.name}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6} className='textField-root'>
              <FormControl fullWidth size="small">
                <TextField
                  select
                  size="small"
                  label="Year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        
      {/* Comparison Charts */}
      <Grid container spacing={2} mt={2} display="flex" className="textField-root">
        {/* Monthly Comparison Chart */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: '16px', height: '550px' }}>
            <Box display="flex" justifyContent="center" alignItems="center" gap={3} mt={2}>
              <Typography variant="body1" gutterBottom align="center" mr={2}>
                Monthly Comparison Chart
              </Typography>
              <FormControl variant="outlined">
                <InputLabel id="select-chart-month-label">Select Month</InputLabel>
                <Select
                  labelId="select-chart-month-label"
                  value={selectChartMonth}
                  onChange={handleChartMonthChange}
                  label="Select Month"
                >
                  {months.map((month) => (
                    <MenuItem key={month.value} value={month.value}>
                      {month.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined">
                <InputLabel id="select-chart-year-label">Select Year</InputLabel>
                <Select
                  labelId="select-chart-year-label"
                  value={selectChartYear}
                  onChange={handleChartYearChange}
                  label="Select Year"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
              <div style={{ height: 400, width: "100%" }}>
                <ResponsiveBar
                  data={formattedChartData}
                  keys={['currentMonthTotal', 'previousMonthTotal']}
                  indexBy="name"
                  groupMode="grouped"
                  margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={({ id, data }) => (id === 'currentMonthTotal' ? COLORS[0] : COLORS[1])} // Color logic for bars
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Category',
                    legendPosition: 'middle',
                    legendOffset: 32,
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Total',
                    legendPosition: 'middle',
                    legendOffset: -50,
                  }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemsSpacing: 2,
                      symbolSize: 20,
                      itemDirection: 'left-to-right',
                    },
                  ]}
                />
              </div>
            </Box>
          </Paper>
        </Grid>

        {/* Yearly Comparison Pie Chart */}
  <Grid item xs={12} sm={6} className="textField-root">
    <Paper elevation={3} style={{ padding: '16px', height: '550px' }}>
      <Box display="flex" justifyContent="center" alignItems="center" gap={3} mt={2}>
        <Typography variant="body1" gutterBottom align="center" mr={2}>
          Yearly Comparison Chart
        </Typography>
        <FormControl variant="outlined">
          <InputLabel>Select Start Year</InputLabel>
          <Select
            value={selectedStartYear}
            onChange={handleStartYearChange}
            label="Select Start Year"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined">
          <InputLabel>Select End Year</InputLabel>
          <Select
            value={selectedEndYear}
            onChange={handleEndYearChange}
            label="Select End Year"
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ height: 400, width: "100%" }}>
    <ResponsivePie
      data={formattedComparisonData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      // Dynamically apply colors based on the data index
      colors={['#FF6F61', '#3498DB', '#F1C40F', '#2ECC71']}  // Provide an array of colors for dynamic data
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
      tooltip={({ datum }) => (
        <div>
          <strong>{datum.name}</strong>: {datum.value}
        </div>
      )}
    />
  </div>
</Box>

    </Paper>
  </Grid>
      </Grid>

      {/* Monthly Final Net Salary Chart */}
      <Box mt={3}>
        <Paper elevation={3} style={{ padding: '16px' }}>
          <Grid container alignItems="center" spacing={2} justifyContent="center">
            <Grid item xs={6} align="center">
              <Typography variant="body1">Monthly Final Net Salary:</Typography>
            </Grid>
            <Grid item xs={6} md={2} className="textField-root">
              <FormControl style={{ marginBottom: '6px', width: '100%' }}>
                <InputLabel>Select Year</InputLabel>
                <Select
                  value={selectedChart2Year}
                  onChange={(e) => setSelectedChart2Year(e.target.value)}
                  label="Select Year"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <div style={{ height: 400, width: "100%" }}>
            <ResponsiveBar
              data={chart2Data}
              keys={['finalNetSalary']}
              indexBy="name"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
             colors={["#FF6F61"]}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
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
                legend: 'Final Net Salary',
                legendPosition: 'middle',
                legendOffset: -50,
              }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  justify: false,
                  translateX: 120,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemsSpacing: 2,
                  symbolSize: 20,
                  itemDirection: 'left-to-right',
                },
              ]}
            />
          </div>
        </Paper>
      </Box>
    </div>
  );
};

export default SalaryDashBoard;
