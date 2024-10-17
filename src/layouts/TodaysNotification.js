import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, Divider, Container } from '@mui/material';

export default function TodaysNotification() {
  const institutecode = localStorage.getItem('institutecode');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state

  useEffect(() => {
    const fetchTodaysNotifications = async () => {
      try {
        // Fetch notifications from the API
        const response = await axios.get(`http://localhost:8081/getTodaysNotification?institutecode=${institutecode}`);
        
        // Assuming the API returns an array of notifications
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Loading done
      }
    };

    fetchTodaysNotifications();
  }, [institutecode]);

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  return (
    <Container >
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index}>
            <Card variant="contained" >
              <CardContent>
                <Typography variant="body1">
                  {notification.message} {/* Adjust according to your API response */}
                </Typography>
              </CardContent>
            </Card>
            {/* Divider separating notifications */}
            <Divider />
          </div>
        ))
      ) : (
        <Typography variant="body1" gutterBottom>
          No notifications for you today!!
        </Typography>
      )}
    </Container>
  );
}
