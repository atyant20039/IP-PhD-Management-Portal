// src/main.js
import { Alert } from "@material-tailwind/react";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@material-tailwind/react";
import { jwtDecode } from "jwt-decode";
import FacultyProvider from "./context/provider/FacultyProvider";
import InvigilationProvider from "./context/provider/InvigilationProvider";
import StudentProvider from "./context/provider/StudentProvider";
import GoogleAuthProvider from "./googleOAuth";
import AdminLayout from "./layouts/AdminView";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";
import ErrorPage from "./pages/ErrorPage";
import Faculty from "./pages/Faculty";
import Finance from "./pages/Finance";
import Invigilation from "./pages/Invigilation";
import LoginPage from "./pages/LoginPage";
import StudentProfile from "./pages/StudentProfile";
import ProtectedRoute from "./ProtectedRoute";

const Main = () => {
  const ALLOWED_USER = import.meta.env.ALLOWED_USER;

  const [loginError, setLoginError] = useState(null);

  const handleLoginSuccess = (response) => {
    try {
      const token = response.credential;
      const decoded = jwtDecode(token);
      if (decoded.email == "ayush20133@iiitd.ac.in") {
        localStorage.setItem("token", token);
        setLoginError(null);
      } else {
        setLoginError("Unauthorized user. Access denied.");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("An error occurred during login.");
    }
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "db",
          element: <Database />,
        },
        {
          path: "db/:id",
          element: <StudentProfile />,
        },
        {
          path: "finance",
          element: <Finance />,
        },
        {
          path: "exam",
          element: <Invigilation />,
        },
        {
          path: "faculty",
          element: <Faculty />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage onLoginSuccess={handleLoginSuccess} />,
    },
    // Uncomment and define the following routes if needed
    // {
    //   path: "/auth",
    //   element: <AuthLayout />,
    //   errorElement: <ErrorPage />,
    //   children: [
    //     // define children here
    //   ],
    // },
    // {
    //   path: "/student",
    //   element: <StudentLayout />,
    //   errorElement: <ErrorPage />,
    //   children: [
    //     // define children here
    //   ],
    // },
    // {
    //   path: "/prof",
    //   element: <ProfLayout />,
    //   errorElement: <ErrorPage />,
    //   children: [
    //     // define children here
    //   ],
    // },
  ]);

  return (
    <React.StrictMode>
      <ThemeProvider>
        <StudentProvider>
          <FacultyProvider>
            <InvigilationProvider>
              <GoogleAuthProvider>
                <RouterProvider router={router} />
                {loginError && (
                  <div className="absolute top-0 right-0 flex justify-center items-center">
                    <Alert color="red" onClose={() => setLoginError(null)}>
                      {loginError}
                    </Alert>
                  </div>
                )}
              </GoogleAuthProvider>
            </InvigilationProvider>
          </FacultyProvider>
        </StudentProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
