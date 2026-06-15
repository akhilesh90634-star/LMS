import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";

function About() {
  const features = [
    "Admins can manage trainers and students",
    "Trainers can create courses and topics",
    "Students can enroll and learn from courses",
  ];

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" textAlign="center" fontWeight="bold" mb={2}>
          About LMS
        </Typography>

        <Typography textAlign="center" color="text.secondary" mb={6}>
          A simple platform for online learning and course management.
        </Typography>

        <Grid container spacing={3}>
          {features.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Typography fontWeight="bold">{item}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default About;
