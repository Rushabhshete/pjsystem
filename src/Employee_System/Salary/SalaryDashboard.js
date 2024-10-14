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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
          params: {institutecode, startYear, endYear }
        });
        setComparisonData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (selectedStartYear && selectedEndYear) {
      fetchComparisonData(selectedStartYear, selectedEndYear);
    }
  }, [selectedStartYear, selectedEndYear, institutecode]);

  const handleStartYearChange = (event) => {
    setSelectedStartYear(event.target.value);
  };

  const handleEndYearChange = (event) => {
    setSelectedEndYear(event.target.value);
  };

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

        
        {/* comparison charts */}
        <Grid container spacing={2} mt={2} display="flex" className='textField-root'>
        <Grid item xs={12} sm={6}>
  <Paper elevation={3}  style={{ padding: '16px', height:'550px' }}>
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" gutterBottom align="center">
        Monthly Comparison Chart
      </Typography>
      <Grid item xs={12} sm={8} display="flex" justifyContent="center" padding={'2%'}>
        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
          <FormControl size="small" variant="outlined" style={{ minWidth: 150 }}>
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
          <FormControl size="small" variant="outlined" style={{ minWidth: 150 }}>
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
      </Grid>
    </Box>
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
      <ResponsiveContainer width="90%" height={400}>
        <BarChart data={formattedChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="currentMonthTotal" fill="#FF6F61" name="Current Month" />
          <Bar dataKey="previousMonthTotal" fill="#3498DB" name="Previous Month" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
</Grid>

<Grid item xs={12} sm={6} className='textField-root'>
  <Paper elevation={3} style={{ padding: '16px', height:'550px' }}>
    <Typography variant="h5" gutterBottom align='center'>
      Yearly Comparison Chart
    </Typography>

    {/* Wrap FormControls in a Box for centering */}
    <Box display="flex" justifyContent="center" padding={'2%'}>
      <Box display={'flex'} flexDirection="row" alignItems="center" gap={2}>
        <FormControl size="small" variant="outlined" style={{ minWidth: 150 }}>
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
        <FormControl size="small" variant="outlined" style={{ minWidth: 150 }}>
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
    </Box>

    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ResponsiveContainer width="90%" height={400}>
        <PieChart>
          <Pie
            data={formattedComparisonData}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {formattedComparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  </Paper>
</Grid>

        </Grid>


        <Box mt={3}>
  <Paper elevation={3} style={{ padding: '16px' }}>
    <Grid container alignItems="center" spacing={2} justifyContent="center">
      <Grid item xs={6} align="center">
        <Typography variant="h6">Monthly Final Net Salary:</Typography>
      </Grid>
      <Grid item xs={6} className='textField-root'>
        <FormControl size="small" style={{ marginBottom: '16px', width: '100%' }}>
          <InputLabel>Select Year</InputLabel>
          <Select
            value={selectedChart2Year}
            onChange={(e) => setSelectedChart2Year(e.target.value)}
            label='Select Year'
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
    <ResponsiveContainer mt={2} width="100%" height={400}>
      <BarChart data={chart2Data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="finalNetSalary" fill="#FF6F61" />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
</Box>



      </div>
  );
};

export default SalaryDashBoard;
