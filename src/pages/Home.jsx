import { useState, useEffect } from "react";
import Map from "../components/Map";
import StationCard from "../components/StationCard";
import Search from "../components/Search";

function Home() {
  const [search, setSearch] = useState("");
  const [stations, setStations] = useState([]);
  const [mapCenter, setMapCenter] = useState([-1.286389, 36.817223]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Load EV stations once
  useEffect(() => {
    fetch(
      "https://nominatim.openstreetmap.org/search?q=ev+charging+station+nairobi&format=json"
    )
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          id: item.place_id,
          name: item.display_name.split(",")[0] || "Unknown Station",
          location: item.display_name,
          coords: [parseFloat(item.lat), parseFloat(item.lon)],
          type: "Unknown",
          price: "N/A",
        }));

        setStations(formatted);
      })
      .catch((err) => console.log("Station load error:", err));
  }, []);

  // 🔥 Get user location
 useEffect(() => {
  if (!navigator.geolocation) {
    console.log("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = [pos.coords.latitude, pos.coords.longitude];
      setUserLocation(coords);
      setMapCenter(coords);
    },
    (err) => {
      console.log("Location error:", err.message);

      // fallback location (Nairobi)
      setMapCenter([-1.286389, 36.817223]);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}, []);
  // 🔥 Distance calculation
  function getDistance(a, b) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 🔥 Add distance + sort nearest
  const stationsWithDistance = userLocation
    ? stations
        .map((s) => ({
          ...s,
          distance: getDistance(userLocation, s.coords),
        }))
        .sort((a, b) => a.distance - b.distance)
    : stations;

  // 🔥 Filter search locally
  const filteredStations = stationsWithDistance.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 SEARCH LOCATION (MAP MOVE)
  const handleSearch = async () => {
    if (!search) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${search}&format=json`
      );

      const data = await res.json();

      if (data.length > 0) {
        setMapCenter([
          parseFloat(data[0].lat),
          parseFloat(data[0].lon),
        ]);
      } else {
        alert("No location found");
      }
    } catch (err) {
      console.log("Search error:", err);
      alert("Search failed (API limit or network)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>⚡ ChargeFlow</h1>

      {/* 🔥 Search */}
      <Search search={search} setSearch={setSearch} />

      <button onClick={handleSearch}>
        {loading ? "Searching..." : "Search"}
      </button>

      {/* 🔥 Map */}
      <Map
        stations={filteredStations}
        center={mapCenter}
        selectedStation={selectedStation}
        setSelectedStation={setSelectedStation}
      />

      {/* 🔥 Station list */}
      <div>
        {filteredStations.map((s) => (
          <StationCard
            key={s.id}
            station={s}
            onClick={() => setSelectedStation(s)}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;