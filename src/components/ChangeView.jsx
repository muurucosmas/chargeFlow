import { useMap } from "react-leaflet";
import { useEffect } from "react";

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), {
        animate: true, // smooth movement 🔥
      });
    }
  }, [center, map]);

  return null;
}

export default ChangeView;