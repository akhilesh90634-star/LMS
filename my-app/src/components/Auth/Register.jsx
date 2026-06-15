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

import {
  Person,
  Email,
  Phone,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../api/Api.js";
import EmailOtpVerification from "./EmailOtpVerification";

function Register() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [verified, setVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("success");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });

    if (
      e.target.name === "email" &&
      e.target.value !== localStorage.getItem("verifiedEmail")
    ) {
      setVerified(false);
      setShowOtp(false);
    }
  }

  async function handleRegister() {
    if (
      !data.name ||
      !data.email ||
      !data.mobile ||
      !data.password ||
      !data.confirmPassword
    ) {
      setMsg("Please fill all fields");
      setType("error");
      setOpen(true);
      return;
    }

    if (!verified) {
      setMsg("Please verify email first");
      setType("error");
      setOpen(true);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setMsg("Passwords do not match");
      setType("error");
      setOpen(true);
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      });

      setMsg(response.data.message);
      setType("success");
      setOpen(true);

      localStorage.removeItem("verifiedEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMsg(error.response?.data?.message || "Registration failed");

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
          maxWidth: 500,
          p: 4,
          borderTop: "5px solid #d32f2f",
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3}>
          Student Registration
        </Typography>

        {/* NAME */}

        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          value={data.name}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />

        {/* EMAIL */}

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

            endAdornment: (
              <InputAdornment position="end">
                {!verified ? (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setShowOtp(true)}
                    disabled={!emailPattern.test(data.email)}
                    sx={{
                      backgroundColor: "#1976d2",
                      textTransform: "none",
                    }}
                  >
                    Verify
                  </Button>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <CheckCircle
                      sx={{
                        color: "#2e7d32",
                      }}
                    />

                    <Typography
                      sx={{
                        color: "#2e7d32",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Verified
                    </Typography>
                  </Box>
                )}
              </InputAdornment>
            ),
          }}
        />

        {/* OTP */}

        {showOtp && (
          <EmailOtpVerification
            email={data.email}
            purpose="register"
            onVerified={(status) => {
              setVerified(status);

              if (status) {
                localStorage.setItem("verifiedEmail", data.email);
              }
            }}
            setMsg={setMsg}
            setType={setType}
            setOpen={setOpen}
          />
        )}

        {/* MOBILE */}

        <TextField
          fullWidth
          label="Mobile"
          name="mobile"
          margin="normal"
          value={data.mobile}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
        />

        {/* PASSWORD */}

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

        {/* CONFIRM PASSWORD */}

        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          margin="normal"
          value={data.confirmPassword}
          onChange={handleChange}
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),

            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            backgroundColor: "#d32f2f",
          }}
          onClick={handleRegister}
        >
          Register
        </Button>

        <Button
          fullWidth
          sx={{
            mt: 1,
            color: "#1976d2",
          }}
          onClick={() => navigate("/login")}
        >
          Already have an account?
        </Button>
      </Paper>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={type}>{msg}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;
