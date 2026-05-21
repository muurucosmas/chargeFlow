import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import "./index.css";
import "leaflet/dist/leaflet.css";

// Toasts
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    {/* Global Toast Notifications */}
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#111827",
          borderRadius: "12px",
          padding: "12px",
          fontWeight: "600",
        },

        success: {
          style: {
            border: "1px solid #22c55e",
          },
        },

        error: {
          style: {
            border: "1px solid #ef4444",
          },
        },
      }}
    />

    {/* Main App */}
    <App />

  </React.StrictMode>
);