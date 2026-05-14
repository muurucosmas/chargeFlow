import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import ChangeView from "./ChangeView";
function Map({ stations, center, selectedStation,setSelectedStation }) {
    const activeCenter = selectedStation ? selectedStation.coords : center;

  return (
    <MapContainer
      center={activeCenter}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <ChangeView center={selectedStation ? selectedStation.coords : activeCenter} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {stations.map((s) => (
        <Marker
          key={s.id}
          position={s.coords}
          opacity={selectedStation && selectedStation.id !== s.id ? 0.5 : 1}
        eventHandlers={{
            click: () => setSelectedStation(s),
          }}
        >
          
          <Popup>
            <div>
              <h3>⚡ {s.name}</h3>
              <p>{s.location}</p>
              <p>{s.type}</p>
              <p>{s.price}</p>
            </div>
          </Popup>
        </Marker>
      ))}
       
    </MapContainer>
  );
}

export default Map;
