import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import MuiAlert from "@mui/material/Alert";
import "./Design.css";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Initialize SweetAlert2
const MySwal = withReactContent(Swal);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle color="blue" textAlign={"center"}>
      Confirm Deletion
    </DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this Category?</Typography>
      <Typography color="red" fontWeight={200} variant="body2">
        *On clicking Confirm, this Category cannot be recovered
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        color="error"
      >
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const AddCategory = () => {
  const [open, setOpen] = useState(false);
  const [categoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({
    id: null,
    categoryName: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getInstituteCode = () => localStorage.getItem("institutecode");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const institutecode = getInstituteCode();
        const response = await fetch(
          `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${encodeURIComponent(
            institutecode
          )}`
        );
        const result = await response.json();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((category) =>
          category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, categories]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setError(""); // Clear any error when closing
  };

  const handleChange = (event) => setNewCategoryName(event.target.value);

  const handleSubmit = async () => {
    if (categoryName.trim() === "") {
      setError("Category name cannot be empty");
    } else if (
      categories.map((c) => c.categoryName).includes(categoryName.trim())
    ) {
      setError("Category already exists");
    } else {
      try {
        const institutecode = getInstituteCode();
        const response = await fetch(
          `http://localhost:8087/categories/save?institutecode=${encodeURIComponent(
            institutecode
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryName: categoryName.trim() }),
          }
        );
        if (response.ok) {
          MySwal.fire("Success", "Category Added Successfully", "success");
  
          const updatedResponse = await fetch(
            `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${encodeURIComponent(
              institutecode
            )}`
          );
          const updatedCategory = await updatedResponse.json();
          setCategories(updatedCategory);
          setNewCategoryName("");
          setError("");
          handleClose();
        } else {
          MySwal.fire("Error","Failed to add category","error");
          setError("Failed to add category");
        }
      } catch (error) {
        console.error("Error adding category: ", error);
       MySwal.fire("Error","Failed to add category","error");
        setError("Failed to add category");
      }
    }
  };

  // const handleEditClickOpen = async (id) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8087/categories/getById/${id}`
  //     );
  //     const result = await response.json();
  //     setEditCategory(result);
  //     setEditOpen(true);
  //   } catch (error) {
  //     console.error("Error fetching category details: ", error);
  //   }
  // };

  // const handleEditClose = () => {
  //   setEditOpen(false);
  //   setEditCategory({ id: null, categoryName: "" });
  //   setError("");
  // };

  // const handleEditChange = (event) => {
  //   setEditCategory({ ...editCategory, categoryName: event.target.value });
  // };

  // const handleUpdate = async () => {
  //   if (editCategory.categoryName.trim() === "") {
  //     setError("Category name cannot be empty");
  //   } else {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8087/categories/update/${editCategory.id}`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             categoryName: editCategory.categoryName.trim(),
  //           }),
  //         }
  //       );
  //       if (response.ok) {
  //         const institutecode = getInstituteCode();
  //         const updatedResponse = await fetch(
  //           `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${encodeURIComponent(
  //             institutecode
  //           )}`
  //         );
  //         const updatedCategory = await updatedResponse.json();
  //         setCategories(updatedCategory);
  //         setSnackbarMessage("Category updated successfully");
  //         setSnackbarOpen(true);
  //         handleEditClose();
  //       } else {
  //         setError("Failed to update category");
  //       }
  //     } catch (error) {
  //       console.error("Error updating category: ", error);
  //       setError("Failed to update category");
  //     }
  //   }
  // };

  const handleDeleteClick = (id) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id); // Proceed with deletion if confirmed
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8087/categories/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const institutecode = getInstituteCode();
        const updatedResponse = await fetch(
          `http://localhost:8087/categories/getAllCategoriesByInstitutecode?institutecode=${encodeURIComponent(
            institutecode
          )}`
        );
        const updatedCategory = await updatedResponse.json();
        setCategories(updatedCategory);
        MySwal.fire("Deleted!", "Category has been deleted.", "success"); // Success message
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
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
    <div>
      <ToastContainer
      autoClose={1000} // Toast will close automatically after 5 seconds
      position="top-right" // Position of the toast
      hideProgressBar={false} // Show or hide the progress bar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover/>
      {/* <PopTypography
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
        Add Category
      </PopTypography> */}
      <Grid container spacing={2} className="textField-root">
        <Typography
          variant="h6"
          gutterBottom
          sx={{ marginTop: 3, whiteSpace: "nowrap" }}
        >
          Total Categories : {categories.length}
        </Typography>{" "}
        {/* Dropdown Fields */}
        <Grid item xs={12} sm={1.6}>
          <TextField
            label="Search Category"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={1.6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ marginTop: 1 }}
          >
            Add CATEGORY
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={handleChange}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="outlined"
            value={editCategory.categoryName}
            onChange={handleEditChange}
            error={!!error}
            helperText={error}
            className="textField-root"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog> */}

      <AlertDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <TableContainer>
        <Table className="table-root">
          <TableHead >
            <TableRow>
              <TableCell
               
              >
                ID
              </TableCell>
              <TableCell
               
              >
                Category Name
              </TableCell>
              <TableCell
               
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>
                  {category.categoryName}
                </TableCell>
                <TableCell >
                  {/* <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClickOpen(category.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Update
                  </Button> */}
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => handleDeleteClick(category.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddCategory;
