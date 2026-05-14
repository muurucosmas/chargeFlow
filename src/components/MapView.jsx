import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useMemo, useEffect, useState } from "react";
import { getChargingStations } from "../lib/overpass";

function ClickToPin({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({
        lat: e.latlng.lat,
        lon: e.latlng.lng,
        label: `Pinned: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`
      });
    }
  });
  return null;
}

export default function MapView({ center, selected, onPick }) {
  const initialCenter = useMemo(() => center ?? [-1.2921, 36.8219], [center]);

  const [stations, setStations] = useState([]);

  useEffect(() => {
    if (!selected) return;

    async function loadStations() {
      let data = await getChargingStations(selected.lat, selected.lon);
      setStations(data);
    }

    loadStations();
  }, [selected]);

  return (
    <MapContainer center={initialCenter} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <ClickToPin onPick={onPick} />

      {selected && (
        <Marker position={[selected.lat, selected.lon]}>
          <Popup>{selected.label}</Popup>
        </Marker>
      )}

      {stations.map((s, i) => (
        <Marker key={i} position={[s.lat, s.lon]} />
      ))}

    </MapContainer>
  );
}