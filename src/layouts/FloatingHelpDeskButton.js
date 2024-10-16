import React, { useState } from 'react';
import { Fab } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import HelpDeskForm from './HelpDeskForm';

const FloatingHelpDeskButton = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Fab
                color="primary"
                aria-label="help desk"
                onClick={handleClick}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000,
                    backgroundColor: '#00649F', // Use backgroundColor for the button's background
                    color: 'white',
                    padding: '10px 20px', // Add some padding for better appearance
                    borderRadius: '40px', // Rounded corners for the button
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Shadow for 3D effect
                    transform: 'translateY(2px)', // Slight downward movement for depth
                    transition: 'all 0.2s ease', // Smooth transition for hover effects
                    '&:hover': {
                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.5)', // Enhanced shadow on hover
                        transform: 'translateY(0px)', // Move up when hovered
                    },
                }}
                
            >
                <AnnouncementIcon />
            </Fab>
            <HelpDeskForm open={open} onClose={handleClose} />
        </>
    );
};

export default FloatingHelpDeskButton;
