import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ChangeView from "./ChangeView";
function Map({ stations,center }) {
 
  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }}>
       
         <ChangeView center={center} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {stations.map((s) => (
        <Marker key={s.id} position={s.coords}>
          <Popup>
            <strong>{s.name}</strong>
            <br />
            {s.location}
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}

export default Map;