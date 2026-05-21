import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Reservations from "./pages/Reservations.jsx";
import About from "./pages/About.jsx";
import Faq from "./pages/Faq.jsx";
import Contacts from "./pages/Contacts.jsx";
import Privacy from "./pages/Privacy.jsx";
import Profile from "./components/Profile.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Sidebar from "./components/Sidebar.jsx";
import MapView from "./components/MapView.jsx";
import SearchBar from "./components/SearchBar.jsx";

//  Utility 
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

// Protected Route
function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Main App
function App() {
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selected?.name) setSearchQuery(selected.name);
  }, [selected]);

  function handleSelect(station) {
    setSelected({
      id: station.id,
      name: station.name,
      lat: station.lat,
      lon: station.lng ?? station.lon,
    });
  }

  return (
    <BrowserRouter>
      {/* Global toaster */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/findcharger"
          element={
            <ProtectedRoute>
              <div className="flex flex-col h-screen">
                <div className="flex justify-center p-4 bg-white shadow sticky top-0 z-50">
                  <Sidebar />
                </div>
                <div className="p-4 bg-white shadow-md">
                  <SearchBar query={searchQuery} onQueryChange={setSearchQuery} onSelect={handleSelect} />
                </div>
                <div className="flex-1">
                  <MapView selected={selected} onPick={handleSelect} />
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Static */}
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;