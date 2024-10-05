import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from '@mui/material';
import { Chart } from "react-google-charts";

const Home = () => {
  const [totalApplications, setTotalApplications] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [complete, setComplete] = useState(0);
  const [incomplete, setIncomplete] = useState(0);
  const [selectedApi, setSelectedApi] = useState('');
  const [numberFromApi, setNumberFromApi] = useState(0);
  const [numberOfCompleteFees, setNumberOfCompleteFees] = useState(0);
  const [numberOfPendingFees, setNumberOfPendingFees] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [numberFromDateRange, setNumberFromDateRange] = useState(0);
  const institutecode = () => localStorage.getItem("institutecode");


  const apiUrls = {
    '7Days': `http://localhost:8083/getNumberOfFeesOf7Days?institutecode=${institutecode()}`,
    '30Days': `http://localhost:8083/getNumberOfFeesOf30Days?institutecode=${institutecode()}`,
    '365Days': `http://localhost:8083/getNumberOfFeesOf365Days?institutecode=${institutecode()}`,
    'completeFees': `http://localhost:8083/getNumberOfCompleteFees?institutecode=${institutecode()}`,
    'pendingFees': `http://localhost:8083/getNumberOfPendingFees?institutecode=${institutecode()}`,
  };

  const fetchTotalApplications = () => {
    fetch(`http://localhost:8083/getAllFees?institutecode=${institutecode()}`)
      .then(response => response.json())
      .then(data => {
        console.log('Data from getAllFees:', data);
        setTotalApplications(data.length);
        const pending = data.filter(fee => fee.status === 'Pending').length;
        const complete = data.filter(fee => fee.status === 'Complete').length;
        const incomplete = data.filter(fee => fee.status === 'Incomplete').length;
        setPendingReviews(pending);
        setComplete(complete);
        setIncomplete(incomplete);
      })
      .catch(error => {
        console.error('Error fetching data from getAllFees:', error);
      });
  };

  const fetchSelectedApiData = () => {
    if (selectedApi && selectedApi !== 'FromTo') {
      fetch(apiUrls[selectedApi])
        .then(response => response.json())
        .then(data => {
          console.log(`Data from ${selectedApi} API:`, data);
          setNumberFromApi(data);
        })
        .catch(error => {
          console.error(`Error fetching data from ${selectedApi} API:`, error);
        });
    }
  };

  const fetchNumberOfCompleteFees = () => {
    fetch(apiUrls.completeFees)
      .then(response => response.json())
      .then(data => {
        console.log('Data from getNumberOfCompleteFees:', data);
        setNumberOfCompleteFees(data);
      })
      .catch(error => {
        console.error('Error fetching data from getNumberOfCompleteFees:', error);
      });
  };

  const fetchNumberOfPendingFees = () => {
    fetch(apiUrls.pendingFees)
      .then(response => response.json())
      .then(data => {
        console.log('Data from getNumberOfPendingFees:', data);
        setNumberOfPendingFees(data);
      })
      .catch(error => {
        console.error('Error fetching data from getNumberOfPendingFees:', error);
      });
  };

  const fetchDataForDateRange = () => {
    if (startDate && endDate) {
      const url = `http://localhost:8083/getNumberFeesBetweenDates?institutecode=${institutecode()}&startDate=${startDate}&endDate=${endDate}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log("Data fetched for date range:", data);
          setNumberFromDateRange(data);
        })
        .catch(error =>
          console.error(`Error fetching data for custom date range:`, error)
        );
    } else {
      console.log("Please select both start and end dates.");
    }
  };

  useEffect(() => {
    fetchTotalApplications();
    fetchNumberOfCompleteFees();
    fetchNumberOfPendingFees();
  }, []);

  useEffect(() => {
    fetchSelectedApiData();
  }, [selectedApi]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#F9E79F', borderRadius: '10px', boxShadow: '0 6px 20px rgba(255, 105, 135, .3)' }}>
            <Typography variant="h6">Total Fees</Typography>
            <Typography variant="h4">{totalApplications}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#FF6F61', borderRadius: '10px', boxShadow: '0 6px 20px rgba(173, 216, 230, .3)' }}>
            <Typography variant="h6">Number Of Pending Fees: {numberOfPendingFees}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#3498DB', borderRadius: '10px', boxShadow: '0 6px 20px rgba(144, 238, 144, .3)' }}>
            <Typography variant="h6">Number Of Complete Fees: {numberOfCompleteFees}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth style={{ marginBottom: '24px' }}>
            <InputLabel id="api-select-label">Select Report</InputLabel>
            <Select
              labelId="api-select-label"
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}
            >
              <MenuItem value="7Days">Last 7 Days</MenuItem>
              <MenuItem value="30Days">Last 30 Days</MenuItem>
              <MenuItem value="365Days">Last 365 Days</MenuItem>
              <MenuItem value="FromTo">Custom Date Range</MenuItem>
            </Select>
          </FormControl>
          {selectedApi && selectedApi !== 'FromTo' && (
            <Paper elevation={3} style={{ padding: '16px', backgroundColor: '#FFF0F5', borderRadius: '10px', boxShadow: '0 6px 20px rgba(255, 182, 193, .3)' }}>
              <Typography variant="h6">Number Of Fees Registered: {numberFromApi}</Typography>
            </Paper>
          )}
        </Grid>
        {selectedApi === 'FromTo' && (
          <>
            <Grid item xs={12} sm={4}>
              <TextField
                label="From"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="To"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={fetchDataForDateRange}
                style={{ marginTop: '16px' }}
              >
                Search
              </Button>
              {numberFromDateRange !== 0 && (
                <Paper elevation={3} style={{ padding: '16px', marginTop: '24px', backgroundColor: '#F0FFF0', borderRadius: '10px', boxShadow: '0 6px 20px rgba(144, 238, 144, .3)' }}>
                  <Typography variant="h6">
                    Number of Fees Registered in Date Range: {numberFromDateRange}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={[
              ['Category', 'Count'],
              ['Total Fees', totalApplications],
              ['Pending Fees', numberOfPendingFees],
              ['Complete Fees', numberOfCompleteFees],
            ]}
            options={{
              chart: {
                title: 'Fees Overview',
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
                    <Chart
                        width={'100%'}
                        height={'400px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Status', 'Count'],
                            ['Complete', numberOfCompleteFees],
                            ['Pending', numberOfPendingFees],
                        ]}
                        options={{
                            title: 'Last 7 Days Fees Report',
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Chart
                        width={'100%'}
                        height={'400px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Status', 'Count'],
                            ['Complete', numberOfCompleteFees],
                            ['Pending', numberOfPendingFees],
                        ]}
                        options={{
                            title: 'Last 30 Days Fees Report',
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Chart
                        width={'100%'}
                        height={'400px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Status', 'Count'],
                            ['Complete', numberOfCompleteFees],
                            ['Incomplete', incomplete],
                        ]}
                        options={{
                            title: 'Last 365 Days Fees Report',
                        }}
                    />
                </Grid>

      </Grid>
    </Container>
  );
};

export default Home;
