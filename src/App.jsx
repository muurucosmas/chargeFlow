import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import About from "./pages/About";
import Dashboard from "./pages/dashboard";

import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/sidebar";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">

        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/findcharger"
            element={
              <>
                <div className="flex justify-center p-4">
                  <Sidebar />
                </div>

                {/* search */}
                <div className="p-4 bg-white shadow">
                  <SearchBar onSelect={(place) => setSelected(place)} />
                </div>

                {/* map */}
                <div className="flex-1 h-screen">
                  <MapView
                    selected={selected}
                    onPick={(place) => setSelected(place)}
                  />
                </div>
              </>
            }
          />

          <Route path="/about" element={<About />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}