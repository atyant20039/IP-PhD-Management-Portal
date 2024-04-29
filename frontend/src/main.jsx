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
import Finance from "./pages/Finance";
import Invigilation from "./pages/Invigilation";
import Faculty from "./pages/Faculty";
import StudentProfile from "./pages/StudentProfile";
import StudentProvider from "./context/provider/StudentProvider";
import FacultyProvider from "./context/provider/FacultyProvider";
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
      <StudentProvider>
        <FacultyProvider>
          <RouterProvider router={router} />
        </FacultyProvider>
      </StudentProvider>
    </ThemeProvider>
  </React.StrictMode>
);
