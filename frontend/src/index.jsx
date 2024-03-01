import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DatabasePage from "./pages/Database";
import { ThemeProvider } from "@material-tailwind/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<ThemeProvider>
				<App />
			</ThemeProvider>
		),
	},
	{
		path: "/database",
		element: <DatabasePage />,
	},
]);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
