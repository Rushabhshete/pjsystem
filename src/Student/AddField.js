// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Grid,
//   TextField,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Typography,
// } from "@mui/material";
// import ConfirmationDialog from "./ConfirmationDialog";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
// import { ToastContainer, toast } from "react-toastify";

// export default function AddExam() {
//   const [standard, setStandard] = useState({ standardname: "" });
//   const [medium, setMedium] = useState({ mediumname: "" });
//   const [standards, setStandards] = useState([]);
//   const [mediums, setMediums] = useState([]);
//   const [editStandard, setEditStandard] = useState(null);
//   const [editMedium, setEditMedium] = useState(null);
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [deleteItemId, setDeleteItemId] = useState(null);
//   const institutecode = () => localStorage.getItem("institutecode");

//   const { standardname } = standard;
//   const { mediumname } = medium;

//   const onInputChangeStandard = (e) => {
//     setStandard({ ...standard, [e.target.name]: e.target.value });
//   };

//   const onInputChangeMedium = (e) => {
//     setMedium({ ...medium, [e.target.name]: e.target.value });
//   };

//   const onSubmitStandard = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`http://localhost:8080/createstandard?institutecode=${institutecode()}`, standard);
//       toast.success("Standard Added Successfully!");
//       fetchStandards();
//     } catch (error) {
//       console.error("There was an error adding the standard!", error);
//     }
//   };

//   const onSubmitMedium = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`http://localhost:8080/save?institutecode=${institutecode()}`, medium);
//        toast.success("Medium Added Successfully!");
//       fetchMediums();
//     } catch (error) {
//       console.error("There was an error adding the medium!", error);
//     }
//   };

//   const fetchStandards = async () => {
//     try {
//       const result = await axios.get(`http://localhost:8080/all?institutecode=${institutecode()}`);
//       setStandards(result.data);
//     } catch (error) {
//       console.error("There was an error fetching the standards!", error);
//     }
//   };

//   const fetchMediums = async () => {
//     try {
//       const result = await axios.get(`http://localhost:8080/getall?institutecode=${institutecode()}`);
//       setMediums(result.data);
//     } catch (error) {
//       console.error("There was an error fetching the mediums!", error);
//     }
//   };

//   const handleDeleteConfirmation = (id) => {
//     setDeleteItemId(id);
//     setConfirmDeleteOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       if (deleteItemId) {
//         await axios.delete(
//           `http://localhost:8080/deleteStandard/${deleteItemId}`
//         ); // Adjust the endpoint as per your API
//         fetchStandards();
//       } else {
//         await axios.delete(
//           `http://localhost:8080/deleteMediumById/${deleteItemId}`
//         ); // Adjust the endpoint as per your API
//         fetchMediums();
//       }
//       toast.success("Item Deleted Successfully!");
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     } finally {
//       setConfirmDeleteOpen(false);
//       setDeleteItemId(null);
//     }
//   };

//   const handleEditStandard = (standard) => {
//     setEditStandard(standard);
//     setStandard(standard);
//   };

//   const handleEditMedium = (medium) => {
//     setEditMedium(medium);
//     setMedium(medium);
//   };

//   const onSubmitEditStandard = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(
//         `http://localhost:8080/updateStandard/${editStandard.standardid}`,
//         standard
//       );
//        toast.success("Standard Updated Successfully!");
//       fetchStandards();
//       setEditStandard(null);
//       setStandard({ standardname: "" });
//     } catch (error) {
//       console.error("There was an error updating the standard!", error);
//     }
//   };

//   const onSubmitEditMedium = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(
//         `http://localhost:8080/updateMedium/${editMedium.mediumid}`,
//         medium
//       );
//        toast.success("Medium Updated Successfully!");
//       fetchMediums();
//       setEditMedium(null);
//       setMedium({ mediumname: "" });
//     } catch (error) {
//       console.error("There was an error updating the medium!", error);
//     }
//   };

//   useEffect(() => {
//     fetchStandards();
//     fetchMediums();
//   }, []);

//   return (
//     <>
//     <ToastContainer />
//     <Typography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: "bold",
//           color: "#fff",
//           textAlign: "center",
//           backgroundColor: "#24A0ED",
//           borderRadius: "150px",
//           padding: "10px",
//           marginBottom: "20px",
//         }}
//       >
//         Add Field Names
//       </Typography>
//       <div
//         style={{ marginTop: "10px" }}
//       >
//         <Paper
//           elevation={3}
//           style={{ padding: "20px"}}
//         >
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <form
//                 onSubmit={
//                   editStandard ? onSubmitEditStandard : onSubmitStandard
//                 }
//                 className="examForm"
//               >
//                 <label htmlFor="standardname" id="examTitle">
//                   {editStandard
//                     ? "Edit Standard Name:"
//                     : "Add Standard/Class Name:"}
//                 </label>
//                 <TextField
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter The Standard/Class Name"
//                   name="standardname"
//                   value={standardname}
//                   onChange={(e) => onInputChangeStandard(e)}
//                   fullWidth
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   id="submit"
//                   style={{ marginTop: "10px" }}
//                 >
//                   {editStandard ? "Update" : "Submit"}
//                 </Button>
//               </form>
//             </Grid>
//             <Grid item xs={6}>
//               <form
//                 onSubmit={editMedium ? onSubmitEditMedium : onSubmitMedium}
//                 className="examForm"
//               >
//                 <label htmlFor="mediumname" id="examTitle">
//                   {editMedium ? "Edit Medium Name:" : "Add Medium Name:"}
//                 </label>
//                 <TextField
//                   type="text"
//                   className="form-control"
//                   placeholder="Enter The Medium Name"
//                   name="mediumname"
//                   value={mediumname}
//                   onChange={(e) => onInputChangeMedium(e)}
//                   fullWidth
//                 />
//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   id="submit"
//                   style={{ marginTop: "10px" }}
//                 >
//                   {editMedium ? "Update" : "Submit"}
//                 </Button>
//               </form>
//             </Grid>
//           </Grid>
//         </Paper>
//       </div>
//       <div
//         style={{ marginTop: "30px"}}
//       >
//         <ConfirmationDialog
//           open={confirmDeleteOpen}
//           onClose={() => setConfirmDeleteOpen(false)}
//           onConfirm={handleDeleteConfirm}
//           title="Delete Confirmation"
//         />
//         <Paper elevation={3} style={{ padding: "10px"}}>
//           <Grid container spacing={1}>
//             <Grid item xs={6}>
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead sx={{ background: "#f2f2f2" }}>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: "bold" }}>
//                         Standard ID
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>
//                         Standard Name
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {standards.map((std) => (
//                       <TableRow key={std.standardid}>
//                         <TableCell>{std.standardid}</TableCell>
//                         <TableCell>{std.standardname}</TableCell>
//                         <TableCell>
//                           <IconButton
//                             color="error"
//                             onClick={() =>
//                               handleDeleteConfirmation(std.standardid)
//                             }
//                           >
//                             <DeleteForeverTwoToneIcon />
//                           </IconButton>
//                           <IconButton
//                             color="primary"
//                             onClick={() => handleEditStandard(std)}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Grid>
//             <Grid item xs={6}>
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead sx={{ background: "#f2f2f2" }}>
//                     <TableRow>
//                       <TableCell sx={{ fontWeight: "bold" }}>
//                         Medium ID
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>
//                         Medium Name
//                       </TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {mediums.map((med) => (
//                       <TableRow key={med.mediumid}>
//                         <TableCell>{med.mediumid}</TableCell>
//                         <TableCell>{med.mediumname}</TableCell>
//                         <TableCell>
//                           <IconButton
//                             color="error"
//                             onClick={() =>
//                               handleDeleteConfirmation(med.mediumid)
//                             }
//                           >
//                             <DeleteForeverTwoToneIcon />
//                           </IconButton>
//                           <IconButton
//                             color="primary"
//                             onClick={() => handleEditMedium(med)}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Grid>
//           </Grid>
//         </Paper>
//       </div>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
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
  IconButton,
  Typography,
} from "@mui/material";
import ConfirmationDialog from "./ConfirmationDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverTwoToneIcon from "@mui/icons-material/DeleteForeverTwoTone";
import { ToastContainer, toast } from "react-toastify";

export default function AddExam() {
  const [standard, setStandard] = useState({ standardname: "" });
  const [medium, setMedium] = useState({ mediumname: "" });
  const [standards, setStandards] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [editStandard, setEditStandard] = useState(null);
  const [editMedium, setEditMedium] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [isDeletingStandard, setIsDeletingStandard] = useState(false);
  const institutecode = () => localStorage.getItem("institutecode");

  const { standardname } = standard;
  const { mediumname } = medium;

  const onInputChangeStandard = (e) => {
    setStandard({ ...standard, [e.target.name]: e.target.value });
  };

  const onInputChangeMedium = (e) => {
    setMedium({ ...medium, [e.target.name]: e.target.value });
  };

  const onSubmitStandard = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/createstandard?institutecode=${institutecode()}`, standard);
      toast.success("Standard Added Successfully!");
      fetchStandards();
    } catch (error) {
      console.error("There was an error adding the standard!", error);
    }
  };

  const onSubmitMedium = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/save?institutecode=${institutecode()}`, medium);
      toast.success("Medium Added Successfully!");
      fetchMediums();
    } catch (error) {
      console.error("There was an error adding the medium!", error);
    }
  };

  const fetchStandards = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/all?institutecode=${institutecode()}`);
      setStandards(result.data);
    } catch (error) {
      console.error("There was an error fetching the standards!", error);
    }
  };

  const fetchMediums = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/getall?institutecode=${institutecode()}`);
      setMediums(result.data);
    } catch (error) {
      console.error("There was an error fetching the mediums!", error);
    }
  };

  const handleDeleteConfirmation = (id, isStandard) => {
    setDeleteItemId(id);
    setIsDeletingStandard(isStandard);
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (isDeletingStandard) {
        await axios.delete(`http://localhost:8080/deleteStandard/${deleteItemId}`);
        fetchStandards();
      } else {
        await axios.delete(`http://localhost:8080/deleteMediumById/${deleteItemId}`);
        fetchMediums();
      }
      toast.success("Item Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteItemId(null);
    }
  };

  const handleEditStandard = (standard) => {
    setEditStandard(standard);
    setStandard(standard);
  };

  const handleEditMedium = (medium) => {
    setEditMedium(medium);
    setMedium(medium);
  };

  const onSubmitEditStandard = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/updateStandard/${editStandard.standardid}`, standard);
      toast.success("Standard Updated Successfully!");
      fetchStandards();
      setEditStandard(null);
      setStandard({ standardname: "" });
    } catch (error) {
      console.error("There was an error updating the standard!", error);
    }
  };

  const onSubmitEditMedium = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/updateMedium/${editMedium.mediumid}`, medium);
      toast.success("Medium Updated Successfully!");
      fetchMediums();
      setEditMedium(null);
      setMedium({ mediumname: "" });
    } catch (error) {
      console.error("There was an error updating the medium!", error);
    }
  };

  useEffect(() => {
    fetchStandards();
    fetchMediums();
  }, []);

  return (
    <>
      <ToastContainer />
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
        Add Field Names
      </Typography>
      <div style={{ marginTop: "10px" }}>
        <Paper elevation={3} style={{ padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <form onSubmit={editStandard ? onSubmitEditStandard : onSubmitStandard} className="examForm">
                <label htmlFor="standardname" id="examTitle">
                  {editStandard ? "Edit Standard Name:" : "Add Standard/Class Name:"}
                </label>
                <TextField
                  type="text"
                  className="form-control"
                  placeholder="Enter The Standard/Class Name"
                  name="standardname"
                  value={standardname}
                  onChange={onInputChangeStandard}
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary" id="submit" style={{ marginTop: "10px" }}>
                  {editStandard ? "Update" : "Submit"}
                </Button>
              </form>
            </Grid>
            <Grid item xs={6}>
              <form onSubmit={editMedium ? onSubmitEditMedium : onSubmitMedium} className="examForm">
                <label htmlFor="mediumname" id="examTitle">
                  {editMedium ? "Edit Medium Name:" : "Add Medium Name:"}
                </label>
                <TextField
                  type="text"
                  className="form-control"
                  placeholder="Enter The Medium Name"
                  name="mediumname"
                  value={mediumname}
                  onChange={onInputChangeMedium}
                  fullWidth
                />
                <Button type="submit" variant="contained" color="primary" id="submit" style={{ marginTop: "10px" }}>
                  {editMedium ? "Update" : "Submit"}
                </Button>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <div style={{ marginTop: "30px" }}>
        <ConfirmationDialog
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Confirmation"
        />
        <Paper elevation={3} style={{ padding: "10px" }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={{ background: "#f2f2f2" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Standard ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Standard Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {standards.map((std) => (
                      <TableRow key={std.standardid}>
                        <TableCell>{std.standardid}</TableCell>
                        <TableCell>{std.standardname}</TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => handleDeleteConfirmation(std.standardid, true)}>
                            <DeleteForeverTwoToneIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleEditStandard(std)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={6}>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={{ background: "#f2f2f2" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Medium ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Medium Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mediums.map((med) => (
                      <TableRow key={med.mediumid}>
                        <TableCell>{med.mediumid}</TableCell>
                        <TableCell>{med.mediumname}</TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => handleDeleteConfirmation(med.mediumid, false)}>
                            <DeleteForeverTwoToneIcon />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleEditMedium(med)}>
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}
