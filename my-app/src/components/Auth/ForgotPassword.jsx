import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";

import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import api from "../api/Api.js";
import EmailOtpVerification from "./EmailOtpVerification";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [msg, setMsg] = useState("");

  const [type, setType] = useState("success");

  async function handleResetPassword() {
    if (!password || !confirmPassword) {
      setMsg("Please fill all fields");
      setType("error");
      setOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      setType("error");
      setOpen(true);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        email,
        password,
      });

      setMsg(response.data.message);
      setType("success");
      setOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setMsg(error.response?.data?.message || "Password reset failed");

      setType("error");
      setOpen(true);
    } finally {
      setLoading(false);
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
          borderTop: "5px solid #2e7d32",
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={1}>
          Forgot Password
        </Typography>

        <Typography textAlign="center" color="text.secondary" mb={3}>
          Reset your LMS account password
        </Typography>

        {/* STEP 1 */}

        {step === 1 && (
          <>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <EmailOtpVerification
              email={email}
              purpose="forgot-password"
              onVerified={(status) => {
                if (status) {
                  setStep(2);
                }
              }}
              setMsg={setMsg}
              setType={setType}
              setOpen={setOpen}
            />
          </>
        )}

        {/* STEP 2 */}

        {step === 2 && (
          <>
            <TextField
              fullWidth
              label="New Password"
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            <TextField
              fullWidth
              label="Confirm Password"
              margin="normal"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                backgroundColor: "#2e7d32",
              }}
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  sx={{
                    color: "#ffffff",
                  }}
                />
              ) : (
                "Reset Password"
              )}
            </Button>
          </>
        )}

        <Button
          fullWidth
          sx={{
            mt: 2,
            color: "#1976d2",
          }}
          onClick={() => navigate("/login")}
        >
          Back To Login
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

export default ForgotPassword;
