
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function AddMedium() {
  let navigate = useNavigate();
  const [medium, setMedium] = useState({ mediumName: "" });
  const [mediums, setMediums] = useState([]);
  const [editMedium, setEditMedium] = useState(null);
  const institutecode = () => localStorage.getItem("institutecode");

  const { mediumName } = medium;

  const onInputChangeMedium = (e) => {
    setMedium({ ...medium, [e.target.name]: e.target.value });
  };

  const onSubmitMedium = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8083/saveMedium?institutecode=${institutecode()}`, medium);
      window.alert("Medium Added Successfully!");
      fetchMediums();
      setMedium({ mediumName: "" });
    } catch (error) {
      console.error("There was an error adding the medium!", error);
    }
  };

  const fetchMediums = async () => {
    try {
      const result = await axios.get(`http://localhost:8083/getAllMediums?institutecode=${institutecode()}`);
      setMediums(result.data);
    } catch (error) {
      console.error("There was an error fetching the mediums!", error);
    }
  };

  const deleteMedium = async (mediumid) => {
    try {
      await axios.delete(`http://localhost:8083/deleteMedium/${mediumid}?institutecode=${institutecode()}`);
      fetchMediums();
    } catch (error) {
      console.error("There was an error deleting the medium!", error);
    }
  };

  const handleEditMedium = (medium) => {
    setEditMedium(medium);
    setMedium({ mediumName: medium.mediumName });
  };

  const onSubmitEditMedium = async (e) => {
    e.preventDefault();
    try {
      // Ensure the request body is correct
     const response = await fetch(
        `http://localhost:8083/updateMedium/${editMedium.mediumID}`,
{
  method:"put",
  headers:{
    "Content-Type":"application/json",
  },
  body:JSON.stringify({
    mediumName: medium.mediumName,
    institutecode:institutecode(),  // Corrected request body format

  }),
}
      );
      window.alert("Medium Updated Successfully!");
      fetchMediums();
      setEditMedium(null);
      setMedium({ mediumName: "" });
    } catch (error) {
      console.error("There was an error updating the medium!", error);
    }
  };

  useEffect(() => {
    fetchMediums();
  }, []);
  

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "100px" }}
      >
        <Paper elevation={3} style={{ padding: "20px", width: "700px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <form
                onSubmit={editMedium ? onSubmitEditMedium : onSubmitMedium}
                className="examForm"
              >
                <label htmlFor="mediumName" id="examTitle">
                  {editMedium ? "Edit Medium Name:" : "Add Medium Name:"}
                </label>
                <TextField
                  type="text"
                  className="form-control"
                  placeholder="Enter the medium name"
                  name="mediumName"
                  value={mediumName}
                  onChange={(e) => onInputChangeMedium(e)}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  id="submit"
                  style={{ marginTop: "10px" }}
                >
                  {editMedium ? "Update" : "Submit"}
                </Button>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "50px", marginLeft: "30px" }}
      >
        <Paper elevation={3} style={{ padding: "10px", width: "1000px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table size="md">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medium ID</TableCell>
                      <TableCell>Medium Name</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mediums.map((med) => (
                      <TableRow key={med.mediumID}>
                        <TableCell>{med.mediumID}</TableCell>
                        <TableCell>{med.mediumName}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => deleteMedium(med.mediumID)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditMedium(med)}
                            style={{ marginLeft: "10px" }}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
