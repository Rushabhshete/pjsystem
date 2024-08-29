import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { BarChart } from 'recharts';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, Label } from 'recharts';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Grid
} from '@mui/material';


const generateYearRange = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 7; i <= currentYear + 7; i++) {
    years.push(i);
  }
  return years;
};

export default function YearlyGraph() {
  const paperRef = useRef(null);
  const [institutecode, setInstituteCode] = useState(localStorage.getItem('institutecode') || '');
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [years, setYears] = useState(generateYearRange());

  useEffect(() => {
    fetchData(year);
  }, [year]);

  const fetchData = async (selectedYear) => {
    try {
      const response = await axios.get('http://localhost:8086/getYearlyEnquiryCountOfAllMonths', {
        params: {
          year: selectedYear,
          institutecode: institutecode,
        }
      });
      const monthlyData = transformData(response.data);
      setData(monthlyData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const transformData = (data) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months.map((month, index) => ({
      month,
      count: data[index + 1] || 0  // API uses 1-based index for months
    }));
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  return (
    <div>
      <Grid
  container
  direction="column"
  justifyContent="center"
  alignItems="center"
  mt={1}
  // spacing={1} // Adds space between the two grids
>
  <Grid item>
    <FormControl variant="outlined" style={{ width: '200px' }}> {/* Set a fixed width */}
      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        value={year}
        onChange={handleYearChange}
        label="Year"
      >
        {years.map((yr) => (
          <MenuItem key={yr} value={yr}>
            {yr}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
  <Grid item>
    <Typography variant="h6" align="center">
      Yearly Enquiry Chart
    </Typography>
  </Grid>
</Grid>

      {/* <Paper elevation={3} style={{ padding: '16px' }}>
        <ResponsiveContainer width="100%" height={370}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#76A7FA" />
          </BarChart>
        </ResponsiveContainer>
      </Paper> */}

<Paper elevation={3} style={{ padding: '16px' }}>
  <ResponsiveContainer width="100%" height={370}>
    <BarChart
      data={data}
      margin={{ top: 20, right: 30, bottom: 30, left: 40 }} // Adjust margins to fine-tune bar position
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month">
        <Label offset={-5} position="insideBottom" /> {/* Adjust offset for label positioning */}
      </XAxis>
      <YAxis>
        <Label value="Enquiry Count" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontWeight:'bold' }} />
      </YAxis>
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#76A7FA" barSize={30} /> {/* Adjust bar size if needed */}
    </BarChart>
  </ResponsiveContainer>
</Paper>

    </div>
  )
}
