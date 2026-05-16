import { useState } from "react";
import MapView from "./component/MapView";
import SearchBar from "./component/SearchBar";

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      
      {/* top (search) */}
      <div className="p-4 bg-white shadow">
        <SearchBar onSelect={(place) => setSelected(place)} />
      </div>

      {/* map area */}
      <div className="flex-1">
        <MapView
          selected={selected}
          onPick={(place) => setSelected(place)}
        />
      </div>

    </div>
  );
}