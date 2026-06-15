import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

function HeroSection() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <Box>
        <Typography variant="h2" fontWeight="bold" color="#000" gutterBottom>
          Learning Management System
        </Typography>

        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Learn Anywhere. Teach Anywhere.
          <br />
          Grow Everywhere.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
            }}
          >
            Get Started
          </Button>

          <Button
            variant="outlined"
            sx={{
              borderColor: "#d32f2f",
              color: "#d32f2f",
            }}
          >
            Login
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default HeroSection;
