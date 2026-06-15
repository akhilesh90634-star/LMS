import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  Typography,
} from "@mui/material";

import { CheckCircle } from "@mui/icons-material";

import api from "../api/Api.js";

function EmailOtpVerification({
  email,
  purpose = "register",
  onVerified,
  setMsg,
  setType,
  setOpen,
}) {
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [loading, setLoading] = useState(false);

  const intervalRef = useRef(null);

  async function sendOtp() {
    if (!email) {
      setMsg("Please enter a valid email");
      setType("error");
      setOpen(true);
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        email,
        purpose,
      });

      setOtpSent(true);
      setTimer(60);
      setCanResend(false);

      setMsg("OTP sent successfully");
      setType("success");
      setOpen(true);
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to send OTP");

      setType("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp) {
      setMsg("Enter OTP");
      setType("error");
      setOpen(true);
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-otp", {
        email,
        otp,
        purpose,
      });

      setVerified(true);

      onVerified(true);

      clearInterval(intervalRef.current);

      setMsg("Email verified successfully");
      setType("success");
      setOpen(true);
    } catch (error) {
      setMsg(error.response?.data?.message || "Invalid OTP");

      setType("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    try {
      setLoading(true);

      await api.post("/auth/resend-otp", {
        email,
        purpose,
      });

      setTimer(60);
      setCanResend(false);

      setMsg("OTP resent successfully");
      setType("success");
      setOpen(true);
    } catch (error) {
      setMsg(error.response?.data?.message || "Failed to resend OTP");

      setType("error");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (purpose === "register" && email && !otpSent) {
      sendOtp();
    }
  }, [email]);

  useEffect(() => {
    if (otpSent && timer > 0 && !verified) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(intervalRef.current);
      setCanResend(true);
    }

    return () => clearInterval(intervalRef.current);
  }, [timer, otpSent, verified]);

  return (
    <Box sx={{ mt: 2 }}>
      {otpSent && (
        <>
          <TextField
            fullWidth
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={verified}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!verified ? (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={verifyOtp}
                      disabled={loading}
                      sx={{
                        backgroundColor: "#1976d2",
                        textTransform: "none",
                      }}
                    >
                      {loading ? (
                        <CircularProgress
                          size={18}
                          sx={{
                            color: "#ffffff",
                          }}
                        />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  ) : (
                    <CheckCircle
                      sx={{
                        color: "#2e7d32",
                      }}
                    />
                  )}
                </InputAdornment>
              ),
            }}
          />

          {!verified && (
            <>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "#666",
                }}
              >
                OTP expires in {timer}s
              </Typography>

              <Button
                onClick={resendOtp}
                disabled={!canResend || loading}
                sx={{
                  mt: 1,
                  color: "#d32f2f",
                }}
              >
                {canResend ? "Resend OTP" : `Resend OTP (${timer}s)`}
              </Button>
            </>
          )}
        </>
      )}

      {purpose === "forgot-password" && !otpSent && (
        <Button
          fullWidth
          variant="contained"
          onClick={sendOtp}
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: "#1976d2",
          }}
        >
          {loading ? (
            <CircularProgress
              size={20}
              sx={{
                color: "#ffffff",
              }}
            />
          ) : (
            "Send OTP"
          )}
        </Button>
      )}
    </Box>
  );
}

export default EmailOtpVerification;
