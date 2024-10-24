// import React, { useState } from 'react';
// import { Fab } from '@mui/material';
// import HelpDeskForm from './HelpDeskForm';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// const FloatingHelpDeskButton = () => {
//     const [open, setOpen] = useState(false);

//     const handleClick = () => {
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     return (
//         <>
//             <Fab
//                 color="primary"
//                 aria-label="help desk"
//                 onClick={handleClick}
//                 sx={{
//                     position: 'fixed',
//                     bottom: 16,
//                     right: 16,
//                     zIndex: 1000,
//                     backgroundColor: '#00649F', // Use backgroundColor for the button's background
//                     color: 'white',
//                     padding: '10px 20px', // Add some padding for better appearance
//                     borderRadius: '40px', // Rounded corners for the button
//                     boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Shadow for 3D effect
//                     transform: 'translateY(2px)', // Slight downward movement for depth
//                     transition: 'all 0.2s ease', // Smooth transition for hover effects
//                     '&:hover': {
//                         boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.5)', // Enhanced shadow on hover
//                         transform: 'translateY(0px)', // Move up when hovered
//                     },
//                 }}
                
//             >
//                 <HelpOutlineIcon />
//             </Fab>
//             <HelpDeskForm open={open} onClose={handleClose} />
//         </>
//     );
// };

// export default FloatingHelpDeskButton;

import React, { useState, useEffect } from 'react';
import { Fab, Icon, Box, Badge } from '@mui/material';
import HelpDeskForm from './HelpDeskForm';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AddIcon from '@mui/icons-material/Add'; // Icon when closed
import CloseIcon from '@mui/icons-material/Close'; // Icon when open
import WorkOffIcon from '@mui/icons-material/WorkOff';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios'; // For API call
import { getAllLeaveRequests } from '../Employee_System/Leave/LeaveService'; // Import the API call

const FloatingHelpDeskButton = () => {
    const [open, setOpen] = useState(false);
    const [fabOpen, setFabOpen] = useState(false); // Handle toggle for FAB
    const [leaveCount, setLeaveCount] = useState(0); // Store leave request count
    const navigate = useNavigate(); // For navigation

    // Function to get today's date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    };

    // Fetch leave requests count when component mounts
    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await getAllLeaveRequests();
                const currentDate = getCurrentDate(); // Get the current date

                // Filter leave requests where fromDate matches today's date
                const todaysLeaveRequests = response.data.filter(leave => leave.leaveRequestDate === currentDate);

                setLeaveCount(todaysLeaveRequests.length); // Set the count based on the filtered results
            } catch (error) {
                console.error('Error fetching leave requests:', error);
            }
        };

        fetchLeaveRequests();
    }, []);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const toggleFab = () => {
        setFabOpen(!fabOpen); // Toggle between open and close
    };

    const handleWorkOffClick = () => {
        navigate('/layout/ManageLeave'); // Navigate to ManageLeave
        setLeaveCount(0); // Reset badge count when clicked
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                }}
            >
                <Fab
                    color="secondary"
                    aria-label="help desk"
                    onClick={toggleFab}
                    sx={{
                        backgroundColor: '#00649F',
                        color: 'white',
                        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Shadow for 3D effect
                        '&:hover': {
                            backgroundColor: '#00649F',
                        },
                    }}
                >
                    {fabOpen ? <CloseIcon /> : <AddIcon />} {/* Toggle icon */}
                </Fab>

                {fabOpen && (
                    <Box sx={{ position: 'absolute', bottom: 70, right: 0 }}>
                        <Fab
                            color="primary"
                            onClick={handleWorkOffClick} // Navigate to ManageLeave
                            sx={{ mb: 2 }}
                        >
                            {/* Add a red badge to the WorkOffIcon */}
                            <Badge
                                badgeContent={leaveCount} // Badge content
                                color="error" // Red badge color
                            >
                                <WorkOffIcon />
                            </Badge>
                        </Fab>
                        <Fab color="primary" onClick={handleClick}>
                            <HelpOutlineIcon />
                        </Fab>
                    </Box>
                )}
            </Box>

            <HelpDeskForm open={open} onClose={handleClose} />
        </>
    );
};

export default FloatingHelpDeskButton;

