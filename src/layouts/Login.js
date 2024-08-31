import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from '../img/logo.jpg';

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
  width: 100px;
  height: 100px;
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

  return (
    <BackgroundContainer>
      <ContentWrapper>
        <GifContainer>
          <GifImage
            src="https://cdn.dribbble.com/users/2401141/screenshots/5487982/developers-gif-showcase.gif"
            alt="Animation"
          />
        </GifContainer>
        <LoginContainer>
          <LoginPaper elevation={6}>
            <Logo src={logo} alt="Logo" />
            <LoginHeader variant="h4">Welcome to PjsoftTech</LoginHeader>
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
  );
}

export default Login;
