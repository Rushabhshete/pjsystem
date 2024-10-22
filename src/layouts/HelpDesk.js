import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Paper,
  TableContainer,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { styled } from "@mui/system";

const HelpDesk = () => {
  const [email, setEmail] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [openChatPopup, setOpenChatPopup] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const storedEmail = localStorage.getItem("email");
  const institutecode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const storedCollegeName = localStorage.getItem("collegeName");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedCollegeName) {
      setCollegeName(storedCollegeName);
    }
  }, [storedEmail]);

  const handleAccountClick = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8081/getAllTickets?institutecode=${institutecode()}`
      );
      if (response.ok) {
        const data = await response.json();
        setAccountData(data || []); // Ensure data is an array
      } else {
        console.error("Failed to fetch account data");
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAccountClick();
  }, []);

  const handleChatSubmit = async (event) => {
    event.preventDefault();
    if (!chatMessage) return;

    const newChat = {
      message: chatMessage,
      timestamp: new Date().toLocaleString(),
      sender: email || "Anonymous",
    };

    // Example of pushing chat to history
    setChatHistory([...chatHistory, newChat]);
    setChatMessage("");

    // Here you would typically send the chat message to the server.
    try {
      const response = await fetch("http://localhost:8081/sendChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message: chatMessage }),
      });
      if (!response.ok) {
        console.error("Failed to send chat message");
      }
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  const handleChatIconClick = (ticket) => {
    setSelectedTicket(ticket);
    setOpenChatPopup(true);
  };

  const handleChatPopupClose = () => {
    setOpenChatPopup(false);
    setSelectedTicket(null);
  };

  const PopTypography = styled(Typography)`
    @keyframes pop {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `;

  return (
    <Box sx={{ padding: 3 }}>
      <PopTypography
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
        Issue/Ticket
      </PopTypography>

      {loading ? (
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : accountData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table className="table-root">
            <TableHead
             
            >
              <TableRow>
                <TableCell >Ticket ID</TableCell>
                <TableCell >
                  Issue Raised Date & Time
                </TableCell>
                <TableCell >System Name</TableCell>
                <TableCell >Issue</TableCell>
                <TableCell >Status</TableCell>
                <TableCell >Description</TableCell>
                <TableCell >Chat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accountData.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.id}</TableCell>
                  <TableCell>
                    {new Date(ticket.dateAndTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{ticket.systemName || "N/A"}</TableCell>
                  <TableCell>{ticket.error}</TableCell>
                  <TableCell>{ticket.status}</TableCell>
                  <TableCell>{ticket.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleChatIconClick(ticket)}
                    >
                      <ChatIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center">
          No data available
        </Typography>
      )}

      {/* Chat Popup Dialog */}
      <Dialog open={openChatPopup} onClose={handleChatPopupClose}>
        <DialogTitle>Chat Support</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Chatting about Ticket ID: {selectedTicket?.id}
          </Typography>
          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              mb: 2,
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {chatHistory.length === 0 ? (
              <Typography>No chat history</Typography>
            ) : (
              chatHistory.map((chat, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="body2" color="textSecondary">
                    {chat.sender} ({chat.timestamp}):
                  </Typography>
                  <Typography variant="body1">{chat.message}</Typography>
                </Box>
              ))
            )}
          </Box>

          <form onSubmit={handleChatSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Type your message"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HelpDesk;
