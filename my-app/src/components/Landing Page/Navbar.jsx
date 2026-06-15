import React from "react";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px",
          width: "100%",
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#1976d2",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          LMS
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            sx={{
              color: "#000",
            }}
          >
            About
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "#1976d2",
              borderColor: "#1976d2",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#d32f2f",
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
