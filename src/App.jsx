import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard.jsx";
import Reservations from "./pages/Reservations.jsx";
import FindChargers from "./pages/FindChargers.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* 🔥 FIND CHARGERS */}
        <Route
          path="/findcharger"
          element={
            <ProtectedRoute>
              <FindChargers />
            </ProtectedRoute>
          }
        />

        {/* 🔥 RESERVATIONS */}
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}