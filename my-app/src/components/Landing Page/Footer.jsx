import React from "react";
import { Box, Typography, Container } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#000",
        color: "#fff",
        py: 3,
      }}
    >
      <Container>
        <Typography align="center" variant="h6" mb={1}>
          LMS
        </Typography>

        <Typography align="center" variant="body2">
          © 2026 LMS. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
