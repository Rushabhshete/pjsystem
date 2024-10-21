// import React, { useState, useEffect } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend
// } from 'recharts';
// import { TextField, MenuItem, Typography, Grid } from '@mui/material';

// export default function MonthlyGraph() {
//     const [perYear, setPerYear] = useState(new Date().getFullYear());
//     const [month, setMonth] = useState(new Date().getMonth() + 1); // Month is 0-indexed in JS
//     const [perData, setPerData] = useState([]);

//     // Hardcoded years (can be fetched dynamically)
//     const peryears = [2021, 2022, 2023, 2024];

//     const handlePerYearChange = (event) => {
//       setPerYear(event.target.value);
//     };

//     const handleMonthChange = (event) => {
//         setMonth(event.target.value);
//     };

//     useEffect(() => {
//         async function fetchPerData() {
//             const instituteCode = localStorage.getItem('institutecode'); // Get instituteCode from local storage

//             if (!instituteCode) {
//                 console.error('Institute Code not found in local storage.');
//                 return;
//             }

//             try {
//                 const response = await fetch(`https://pjsofttech.in:14443/inquiriesCountBymonthofallDays?month=${month}&year=${perYear}&institutecode=${instituteCode}`);
//                 const result = await response.json();

//                 // Sort the result by date in ascending order
//                 const sortedData = result.sort((a, b) => new Date(a.date) - new Date(b.date));
//                 setPerData(sortedData);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         }

//         fetchPerData();
//     }, [month, perYear]); // Fetch data when month or year changes

//     return (
//         <Grid item xs={12}>
//             <Grid container alignItems="center" justifyContent={"center"} gap={1}>
//                 <Grid item>
//                     <Typography variant="h6">Monthly Inquiry Count Chart</Typography>
//                 </Grid>
//                 <Grid item style={{ display: "flex" }}>
//                     <TextField
//                         select
//                         value={perYear}
//                         onChange={handlePerYearChange}
//                         label="Year"
//                     >
//                         {peryears.map((yr) => (
//                             <MenuItem key={yr} value={yr}>
//                                 {yr}
//                             </MenuItem>
//                         ))}
//                     </TextField>
//                     <TextField
//                         select
//                         value={month}
//                         onChange={handleMonthChange}
//                         label="Month"
//                         style={{ marginLeft: '16px' }} // Optional styling for spacing
//                     >
//                         {Array.from({ length: 12 }, (v, k) => (
//                             <MenuItem key={k + 1} value={k + 1}>
//                                 {new Date(0, k).toLocaleString('default', { month: 'long' })}
//                             </MenuItem>
//                         ))}
//                     </TextField>
//                 </Grid>
//             </Grid>
//             <div style={{ width: "80%", marginTop: "16px" }}>
//                 <BarChart
//                     width={window.innerWidth * 0.8}
//                     height={400}
//                     data={perData}
//                 >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate()} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#76A7FA" />
//                 </BarChart>
//             </div>
//         </Grid>
//     );
// }


import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TextField, MenuItem, Typography, Grid } from '@mui/material';

export default function MonthlyGraph() {
    const [perYear, setPerYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Month is 0-indexed in JS
    const [perData, setPerData] = useState([]);

    // Hardcoded years (can be fetched dynamically)
    const peryears = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029];

    const handlePerYearChange = (event) => {
      setPerYear(event.target.value);
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    useEffect(() => {
        async function fetchPerData() {
            const instituteCode = localStorage.getItem('institutecode'); // Get instituteCode from local storage

            if (!instituteCode) {
                console.error('Institute Code not found in local storage.');
                return;
            }

            try {
                const response = await fetch(`https://pjsofttech.in:14443/inquiriesCountBymonthofallDays?month=${month}&year=${perYear}&institutecode=${instituteCode}`);
                const result = await response.json();

                // Sort the result by date in ascending order
                const sortedData = result.sort((a, b) => new Date(a.date) - new Date(b.date));
                setPerData(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchPerData();
    }, [month, perYear]); // Fetch data when month or year changes

    return (
        <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent={"center"} gap={1}>
                <Grid item>
                    <Typography variant="h6">Monthly Inquiry Count Chart</Typography>
                </Grid>
                <Grid item style={{ display: "flex" }}>
                    <TextField
                        select
                        value={perYear}
                        onChange={handlePerYearChange}
                        label="Year"
                    >
                        {peryears.map((yr) => (
                            <MenuItem key={yr} value={yr}>
                                {yr}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        value={month}
                        onChange={handleMonthChange}
                        label="Month"
                        style={{ marginLeft: '16px' }} // Optional styling for spacing
                    >
                        {Array.from({ length: 12 }, (v, k) => (
                            <MenuItem key={k + 1} value={k + 1}>
                                {new Date(0, k).toLocaleString('default', { month: 'long' })}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <div style={{ width: "80%", marginTop: "16px" }}>
                <LineChart
                    width={window.innerWidth * 0.3}
                    height={400}
                    data={perData}
                    connectNulls // This will connect the null values in your chart
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate()} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#76A7FA" activeDot={{ r: 8 }} />
                </LineChart>
            </div>
        </Grid>
    );
}
