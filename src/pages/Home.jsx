import { useState,useEffect } from "react";
import Map from "../components/Map";
import StationCard from "../components/StationCard";
import Search from "../components/Search";
function Home() {
  const [search, setSearch] = useState("");
  const [stations,setStations] = useState([])
   const [mapCenter, setMapCenter] = useState([-1.286389, 36.817223]);
   const [selectedStation, setSelectedStation] = useState(null);
  useEffect(() => {
  fetch("https://nominatim.openstreetmap.org/search?q=ev+charging+station+nairobi&format=json")
    .then(res => res.json())
    .then(data => {
      const formatted = data.map((item) => ({
        id: item.place_id,
        name: item.display_name.split(",")[0] || "Unknown Station",
        location: item.display_name,
        coords: [parseFloat(item.lat), parseFloat(item.lon)],
        type: "Unknown",
        price: "N/A"
      }));
     console.log(formatted)
      setStations(formatted);
    });
}, []);

  const handleSearch = (value) => {
    setSearch(value);

    fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=json`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const first = data[0];

          setMapCenter([
            parseFloat(first.lat),
            parseFloat(first.lon)
          ]);
        }
      });
  };

  const filteredStations = stations.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>⚡ ChargeFlow</h1>

      
    <Search search={search} setSearch={handleSearch}/>
      
      <Map stations={filteredStations} center={mapCenter} />

    
      <div className="">
        {filteredStations.map((s) => (
          <StationCard key={s.id} station={s}  onClick={() => setSelectedStation(s)}/>
        ))}
      </div>
    </div>
  );
}

export default Home;