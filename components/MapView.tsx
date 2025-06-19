"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

type Hotel = {
  id: number;
  lat: number;
  lon: number;
  tags?: { name?: string };
};

const hotelIcon = new Icon({
  iconUrl: "/hotel.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function MapView({
  hotels,
  center,
}: {
  hotels: Hotel[];
  center: [number, number];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="border rounded-4 shadow-lg overflow-hidden"
    >
      <MapContainer
        center={center as LatLngExpression}
        zoom={15}
        style={{ height: "600px", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='© <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.lat, hotel.lon]}
            icon={hotelIcon}
          >
            <Popup>
              <div className="fw-bold text-primary">
                <i className="bi bi-building me-1"></i>
                {hotel.tags?.name || "Khách sạn không tên"}
              </div>
              <div className="small text-muted mt-1">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {hotel.lat.toFixed(4)}, {hotel.lon.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
}
