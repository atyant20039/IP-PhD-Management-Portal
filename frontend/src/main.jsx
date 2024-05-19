// src/main.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Alert,
  Button,
  Card,
  CardBody,

} from "@material-tailwind/react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "./layouts/AdminView";
import AuthLayout from "./layouts/Auth";
import StudentLayout from "./layouts/StudentView";
import ProfLayout from "./layouts/ProfView";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";
import Finance from "./pages/Finance";
import Invigilation from "./pages/Invigilation";
import Faculty from "./pages/Faculty";
import StudentProfile from "./pages/StudentProfile";
import LoginPage from "./pages/LoginPage";
import StudentProvider from "./context/provider/StudentProvider";
import FacultyProvider from "./context/provider/FacultyProvider";
import { ThemeProvider } from "@material-tailwind/react";
import GoogleAuthProvider from "./googleOAuth";
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";
const Main = () => {
  const [loginError, setLoginError] = useState(null);


  const handleLoginSuccess = (response) => {

    try {
      const token = response.credential; 
      const decoded = jwtDecode(token);
      if (decoded.email === "nikhil20530@iiitd.ac.in") {
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
          </FacultyProvider>
        </StudentProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
