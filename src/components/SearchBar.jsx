import { useState } from "react";
import { searchPlace } from "../lib/nominatim";

export default function SearchBar({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runSearch() {
    setLoading(true);
    try {
      const r = await searchPlace(q);
      setResults(r);
      if (r.length === 1) onSelect(r[0]);
    } catch (e) {
      console.error(e);
      alert("Search failed (check console).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="topbar">
        <input
          className="searchInput"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a place (e.g., Westlands Nairobi)"
          onKeyDown={(e) => {
            if (e.key === "Enter") runSearch();
          }}
        />
        <button className="btn" onClick={runSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {results.length > 1 && (
        <div style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
            Pick a result:
          </div>
          {results.map((r, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(r)}
              style={{
                padding: "8px 10px",
                border: "1px solid #eee",
                borderRadius: 10,
                marginBottom: 6,
                cursor: "pointer"
              }}
            >
              {r.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
``