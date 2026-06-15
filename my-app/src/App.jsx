import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./components/Landing Page/LandingPage";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";

function App() {
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_BE_API_URL}/auth/refresh-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refreshToken,
            }),
          },
        );

        const data = await response.json();

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        } else {
          localStorage.clear();
        }
      } catch (error) {
        console.log(error);

        localStorage.clear();
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  if (authLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        LMS
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
