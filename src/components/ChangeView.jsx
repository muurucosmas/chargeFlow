import { useMap } from "react-leaflet";
import { useEffect } from "react";

function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 15, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center, map]);

  return null;
}

export default ChangeView;