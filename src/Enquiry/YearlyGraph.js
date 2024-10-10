import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar'; // Import Nivo's ResponsiveBar
import {
  Select,
  MenuItem,
  FormControl,
  TextField,
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
       
        mt={1}
      >
        <Grid item xs={12} md={6} className="textField-root">
          <FormControl variant="outlined" style={{ width: '100px' }}>
            <TextField
              select
              value={year}
              onChange={handleYearChange}
              label="Year"
            >
              {years.map((yr) => (
                <MenuItem key={yr} value={yr}>
                  {yr}
                </MenuItem>
              ))}
            </TextField>
            
          </FormControl>
         
   
        </Grid>
        <Typography variant="h6" align="center" mt={-4}>
            Yearly Enquiry Chart
          </Typography>
          
      </Grid>

      <div style={{ height: '410px', width: '100%' }}>
        <ResponsiveBar
          data={data}
          keys={['count']} // Specify the key for the bar value
          indexBy="month" // Specify the key for the x-axis
          margin={{ top: 20, right: 30, bottom: 50, left: 60 }} // Adjust margins as needed
          padding={0.3}
          colors={ "#FF6F61" }// Set colors for the bars
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Months',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Enquiry Count',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          role="application"
          ariaLabel="Yearly Enquiry Chart"
        />
      </div>
    </div>
  );
}
