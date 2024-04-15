import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AdminLayout from "./layouts/AdminView";
import AuthLayout from "./layouts/Auth";
import StudentLayout from "./layouts/StudentView";
import ProfLayout from "./layouts/ProfView";
import ErrorPage from "./pages/ErrorPage";
import Dashboard from "./pages/Dashboard";
import Database from "./pages/Database";
import Stipend from "./pages/Stipend";
import Invigilation from "./pages/Invigilation";
import Faculty from "./pages/Faculty";
import StudentProfile from "./pages/StudentProfile";
import StudentProvider from "./context/provider/StudentProvider";
import FacultyProvider from "./context/provider/FacultyProvider";
import InvigilationProvider from "./context/provider/InvigilationProvider";
import { ThemeProvider } from "@material-tailwind/react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
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
        path: "stipend",
        element: <Stipend />,
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
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      // define children here
    ],
  },
  {
    path: "/student",
    element: <StudentLayout />,
    errorElement: <ErrorPage />,
    children: [
      // define children here
    ],
  },
  {
    path: "/prof",
    element: <ProfLayout />,
    errorElement: <ErrorPage />,
    children: [
      // define children here
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <InvigilationProvider>
        <StudentProvider>
          <FacultyProvider>
            <RouterProvider router={router} />
          </FacultyProvider>
        </StudentProvider>
      </InvigilationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
