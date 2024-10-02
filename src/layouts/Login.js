import React, { useState,useContext } from "react";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.jpg";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SchoolIcon from "@mui/icons-material/School";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkIcon from "@mui/icons-material/Work";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HowToRegIcon from "@mui/icons-material/HowToReg";
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BackgroundContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0e1a2b;
  padding: 0;
`;
const GridContainer = styled(Grid)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  marginleft: 80px;
`;
const ContentWrapper = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1300px;
  padding: 10px;
`;

const GifContainer = styled("div")`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GifImage = styled("img")`
  width: 100%;
  max-width: 700px;
  height: auto;
  animation: ${fadeIn} 1s ease-in-out;
`;

const LoginContainer = styled("div")`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginPaper = styled(Paper)`
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
  background-color: #1e2a38;
  color: #fff;
  animation: ${fadeIn} 1s ease-in-out;
`;

const Logo = styled("img")`
  display: block;
  margin: 0 auto 20px;
  width: 90px;
  height: 90px;
  animation: ${fadeIn} 1s ease-in-out;
`;

const LoginHeader = styled(Typography)`
  text-align: center;
  margin-bottom: 24px;
  animation: ${fadeIn} 1s ease-in-out;
  color: #fff;
`;

const CustomForm = styled("form")`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled("div")`
  margin-bottom: 16px;
`;

const FormControl = styled(TextField)`
  width: 100%;
  .MuiInputBase-root {
    color: #fff;
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: #fff;
  }
  .MuiInputLabel-root {
    color: #fff;
  }
`;

const ErrorMessage = styled(Typography)`
  color: red;
  margin-bottom: 16px;
`;

const BtnPrimary = styled(Button)`
  margin-bottom: 16px;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #fff;
`;

function Login({ onLogin }) {
  const [institutecode, setInstitutecode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const loginUser = async (institutecode, email, password) => {
    return axios.post(
      `http://localhost:8081/institutelogin?institutecode=${institutecode}&emailaddress=${email}&password=${password}`
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous error messages
    try {
      const response = await loginUser(institutecode, email, password);

      if (response.status === 200) {
        console.log("Login successful!", response.data);
       // setUser({ isAuthenticated: true, institutecode, email });
         localStorage.setItem("institutecode", institutecode);
         localStorage.setItem("email", email);
        onLogin();
        navigate("/layout/combineDash");
      } else if (response.status === 401) {
        if (response.data === "Incorrect password") {
          setError("Incorrect password");
        } else if (response.data === "Account expired") {
          setError("Account expired");
        } else {
          setError("Unauthorized access");
        }
      } else if (response.status === 404) {
        if (response.data === "Incorrect institutecode") {
          setError("Incorrect Institute Code");
        } else if (response.data === "Admin not found") {
          setError("Admin not found");
        }
      } else {
        throw new Error("Unexpected response from the server");
      }
    } catch (error) {
      console.error(
        "Error logging in:",
        error.response ? error.response.data : error.message
      );
      setError("An error occurred during login. Please try again later.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };
  const handleCreateAccount = () => {
    navigate("/create-account");
  };

  return (
    <>
      <Grid item>
        <Typography
          variant="h3"
          component="div"
          align="center"
          gutterBottom
          sx={{
            fontSize: "40px",
            fontWeight: "bold",
            color: "white",
            marginTop: "10px",
            marginBottom: "-60px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          CRM Software
        </Typography>
      </Grid>
      <BackgroundContainer>
        <ContentWrapper>
          <GridContainer
            container
            spacing={1}
            alignItems="center"
            marginTop={7}
          >
            {[
              {
                icon: <SettingsIcon />,
                link: "/create-account",
                label: "Create Account",
                external: true,
              },
              {
                icon: <HomeIcon />,
                link: "http://pjsofttech.in",
                label: "Admin",
                external: true,
              },
              {
                icon: <PersonIcon />,
                link: "http://pjsofttech.in/employee",
                label: "Employee",
                external: true,
              },
              {
                icon: <SchoolIcon />,
                link: "http://pjsofttech.in/student",
                label: "Student",
                external: true,
              },
              {
                icon: <SupervisorAccountIcon />,
                link: "/loginPage",
                label: "Principal",
                external: true,
              },
              {
                icon: <SupervisorAccountIcon />,
                link: "/loginPage",
                label: "HOD",
                external: true,
              },
              {
                icon: <PersonOutlineIcon />,
                link: "/loginPage",
                label: "Teacher",
                external: true,
              },
              {
                icon: <HowToRegIcon />,
                link: "/loginPage",
                label: "Parent",
                external: true,
              },
              {
                icon: <QuestionAnswerIcon />,
                link: "/loginPage",
                label: "Librarian",
                external: true,
              },
              {
                icon: <BarChartIcon />,
                link: "/loginPage",
                label: "Sales",
                external: true,
              },
              {
                icon: <MenuBookIcon />,
                link: "/loginPage",
                label: "Accountant",
                external: true,
              },
              {
                icon: <WorkIcon />,
                link: "/loginPage",
                label: "Driver",
                external: true,
              },
            ].map(({ icon, link, label, external }, index) => (
              <Grid
                item
                lg={3}
                md={4}
                sm={6}
                xs={12}
                key={index}
                marginBottom={8}
              >
                {external ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <Paper
                      elevation={6}
                      sx={{
                        p: 6,
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        textAlign: "center",
                        marginLeft: "50px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f7f7f7",
                        transition:
                          "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          backgroundImage:
                            "linear-gradient(88.8deg, rgb(239, 171, 245) 13.4%, rgb(196, 181, 249) 76.3%)",
                        },
                      }}
                    >
                      <div
                        style={{
                          // marginBottom: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100px",
                          height: "100vh",
                        }}
                      >
                        {React.cloneElement(icon, {
                          sx: {
                            fontSize: "30px",
                            color: "#1976d2",
                            fontFamily: "Roboto, sans-serif",
                            transition: "color 0.3s ease",
                            "&:hover": {
                              color: "purple",
                            },
                          },
                        })}
                      </div>
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 1,
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "black",
                          textAlign: "center",
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        {label}
                      </Typography>
                    </Paper>
                  </a>
                ) : (
                  <Link to={link} style={{ textDecoration: "none" }}>
                    <Paper
                      elevation={6}
                      sx={{
                        p: 6,
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        textAlign: "center",
                        marginLeft: "50px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f7f7f7",
                        transition:
                          "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                          backgroundImage:
                            "linear-gradient(88.8deg, rgb(239, 171, 245) 13.4%, rgb(196, 181, 249) 76.3%)",
                        },
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100px",
                          height: "100vh",
                        }}
                      >
                        {React.cloneElement(icon, {
                          sx: {
                            fontSize: "30px",
                            color: "#1976d2",
                            fontFamily: "Roboto, sans-serif",
                            transition: "color 0.3s ease",
                            "&:hover": {
                              color: "purple",
                            },
                          },
                        })}
                      </div>
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 1,
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "black",
                          textAlign: "center",
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        {label}
                      </Typography>
                    </Paper>
                  </Link>
                )}
              </Grid>
            ))}
          </GridContainer>

          <LoginContainer>
            <LoginPaper elevation={6}>
              <Logo src={logo} alt="Logo" />
              <LoginHeader variant="h5" whiteSpace={"nowrap"}>
                Welcome To PJSOFTTECH
              </LoginHeader>
              <CustomForm onSubmit={handleSubmit}>
                <FormGroup>
                  <FormControl
                    label="Institute Code"
                    type="text"
                    value={institutecode}
                    onChange={(e) => setInstitutecode(e.target.value)}
                    placeholder="Enter Institute Code"
                    variant="outlined"
                    fullWidth
                  />
                </FormGroup>                                              
                <FormGroup>
                  <FormControl
                    label="Email address"
                    type="email"                                  
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    variant="outlined"
                    fullWidth
                  />                                 
                </FormGroup>
                <FormGroup>
                  <FormControl
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    variant="outlined"
                    fullWidth
                  />
                </FormGroup>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <BtnPrimary variant="contained" color="primary" type="submit">
                  Login
                </BtnPrimary>
                <Link
                  href="#"
                  onClick={handleCreateAccount}
                  underline="hover"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    color: "white",
                    "&:hover": { color: "#0056B3" },
                    marginBottom: "5px",
                    variant: "h4",
                  }}
                >
                  Create Account
                </Link>
                <ForgotPasswordLink
                  href="#"
                  onClick={handleForgotPassword}
                  underline="hover"
                  sx={{ color: "#007BFF", "&:hover": { color: "#0056B3" } }}
                >
                  Forgot Password?
                </ForgotPasswordLink>
              </CustomForm>
            </LoginPaper>
          </LoginContainer>
        </ContentWrapper>
      </BackgroundContainer>
    </>
  );
}

export default Login;
