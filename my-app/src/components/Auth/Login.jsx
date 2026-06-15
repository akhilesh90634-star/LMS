import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api, { saveUserData } from "../api/Api.js";

function Login() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [open, setOpen] = useState(false);

  const [msg, setMsg] = useState("");

  const [type, setType] = useState("success");

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  async function handleLogin() {
    if (!data.email || !data.password) {
      setMsg("Please fill all fields");
      setType("error");
      setOpen(true);
      return;
    }

    try {
      const response = await api.post("/auth/login", data);

      localStorage.setItem("accessToken", response.data.accessToken);

      localStorage.setItem("refreshToken", response.data.refreshToken);

      localStorage.setItem("role", response.data.role);

      saveUserData(response.data.accessToken);

      setMsg("Login Successful");
      setType("success");
      setOpen(true);

      const role = response.data.role;

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "trainer") {
        navigate("/trainer");
      } else {
        navigate("/student");
      }
    } catch (error) {
      setMsg(error.response?.data?.message || "Login Failed");

      setType("error");
      setOpen(true);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderTop: "5px solid #1976d2",
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={1}>
          LMS Login
        </Typography>

        <Typography textAlign="center" color="text.secondary" mb={3}>
          Sign in to continue learning
        </Typography>

        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          value={data.email}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          margin="normal"
          value={data.password}
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),

            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#1976d2",
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Button
          fullWidth
          sx={{
            mt: 1,
            color: "#2e7d32",
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Button>

        <Button
          fullWidth
          sx={{
            color: "#d32f2f",
          }}
          onClick={() => navigate("/register")}
        >
          Create Account
        </Button>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert severity={type} variant="filled">
          {msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
