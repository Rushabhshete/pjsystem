import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  Container,
  Button,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function TodaysNotification() {
  const institutecode = localStorage.getItem("institutecode");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const messageLimit = 100; // Define the character limit for "Read More"

  useEffect(() => {
    const fetchTodaysNotifications = async () => {
      try {
        // Fetch notifications from the API
        const response = await axios.get(
          `https://pjsofttech.in:20443/getTodaysNotification?institutecode=${institutecode}`
        );

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
    <div>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "#24A0ED",
          borderRadius: "150px",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        Notifications
      </Typography>

      <Paper
        elevation={6} // Increase shadow for more noticeable effect
        sx={{
          padding: "20px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)", // More prominent shadow
          borderRadius: "15px", // Rounded corners
        }}
      >
        <Button
          color="primary"
          variant="contained"
          component={Link}
          to="/layout/combineDash"
        >
          Go Back
        </Button>

        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index}>
              <Card
                variant="outlined" // Optionally outline the card
                sx={{
                  margin: "10px 0", // Add margin between cards
                  borderLeft: "4px solid #24A0ED" ,
                  backgroundColor:"#e3f2fd", // Alternate background colors
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow to the card
                }}
              >
                <CardContent>
                  <Typography variant="body1">
                    {notification.message.length > messageLimit
                      ? `${notification.message.substring(0, messageLimit)}...`
                      : notification.message}
                  </Typography>

                  {notification.message.length > messageLimit && (
                    <Button
                      component={Link}
                      to="/layout/todaysNotifications"
                      variant="text"
                      size="small"
                      sx={{
                        textTransform: "none",
                        marginTop: "8px",
                        color: "#24A0ED", // Optional: Style for the "Read More" button
                      }}
                    >
                      Read More
                    </Button>
                  )}
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
      </Paper>
    </div>
  );
}
