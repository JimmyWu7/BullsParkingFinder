import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Map = () => {
  // University at Buffalo coordinates
  const center = [43.0018, -78.7895];

  // Define bounds (southwest and northeast corners)
  const bounds = [
    [42.994, -78.805], // Southwest corner
    [43.014, -78.769], // Northeast corner
  ];

  return (
    <MapContainer
      center={center}
      zoom={16} // Adjusted zoom level
      style={{ height: "100%", width: "100%" }}
      maxBounds={bounds} // Set max bounds to prevent dragging outside
      maxBoundsVisibilty={true} // Optional: show bounds visually
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>University at Buffalo</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;