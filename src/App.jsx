import { useState } from "react";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="app">
      <SearchBar onSelect={(place) => setSelected(place)} />

      <div className="content">
        <div className="mapPanel">
          <MapView
            selected={selected}
            onPick={(place) => setSelected(place)}
          />
        </div>
      </div>
    </div>
  );
}