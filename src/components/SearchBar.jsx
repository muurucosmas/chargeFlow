import { useState, useEffect } from "react";
import { X } from "lucide-react";
import chargersData from "../data/chargers.json";

export default function SearchBar({
  query,
  onQueryChange,
  onSelect,
}) {
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);

  // ---------------- FILTER LOGIC ----------------
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const filtered = chargersData.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
  }, [query]);

  // ---------------- SELECT STATION ----------------
  const handleSelect = (station) => {
    const normalized = {
      lat: station.lat,
      lon: station.lng ?? station.lon,
      label: station.name,
    };

    // 1. update input box
    onQueryChange(station.name);

    // 2. send selected station to App (this triggers map zoom)
    onSelect(normalized);

    // 3. close dropdown
    setResults([]);
    setFocused(false);
  };

  // ---------------- CLEAR INPUT ----------------
  const handleClear = () => {
    onQueryChange("");
    setResults([]);
    setFocused(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* INPUT */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() =>
            setTimeout(() => setFocused(false), 150)
          }
          placeholder="Search charging station..."
          className="w-full border p-2 rounded-md focus:ring-2 focus:ring-green-400 outline-none pr-8"
        />

        {/* CLEAR */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* DROPDOWN */}
      {focused && results.length > 0 && (
        <ul
          className="absolute left-0 right-0 bg-white border rounded-md shadow-xl max-h-60 overflow-auto"
          style={{ zIndex: 9999 }}
        >
          {results.map((station, i) => (
            <li
              key={station.id ?? i}
              onMouseDown={() => handleSelect(station)}
              className={`p-2 cursor-pointer hover:bg-green-100 ${
                i === 0 ? "font-semibold" : ""
              }`}
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}