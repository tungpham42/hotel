"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="text-center p-5">
      <Spinner animation="grow" variant="primary" />
    </div>
  ),
});

type Hotel = {
  id: number;
  lat: number;
  lon: number;
  type: string;
  tags?: { name?: string; shop?: string };
};

type Location = {
  bbox: string;
  center: [number, number];
};

export default function MapWrapper({ city }: { city: string }) {
  const [hotels, setHotels] = useState<Hotel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Record<string, Location> | null>(
    null
  );

  useEffect(() => {
    fetch("/vietnam_locations.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, Location>) => setLocations(data))
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setError("Lỗi khi tải dữ liệu vị trí.");
      });
  }, []);

  useEffect(() => {
    if (!locations || !locations[city]) return;

    const location = locations[city] || locations["TP. Hồ Chí Minh"];
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"="hotel"]["name"](${location.bbox});
        way["tourism"="hotel"]["name"](${location.bbox});
        relation["tourism"="hotel"]["name"](${location.bbox});
      );
      out body;
      >;
      out skel qt;
    `;
    setHotels(null);
    setError(null);
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.elements && data.elements.length > 0) {
          const hotelNodes = data.elements.filter(
            (element: Hotel) =>
              element.type === "node" && element.lat && element.lon
          );
          setHotels(hotelNodes);
          if (hotelNodes.length === 0) {
            setError(`Không tìm thấy khách sạn nào ở ${city}.`);
          }
        } else {
          setError(`Không tìm thấy khách sạn nào ở ${city}.`);
        }
      })
      .catch((err) => {
        console.error("Error fetching hotels:", err);
        setError("Lỗi khi tải dữ liệu khách sạn.");
      });
  }, [city, locations]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-5"
      >
        <Alert
          variant="danger"
          className="border-0 shadow-sm"
          style={{ background: "var(--accent)" }}
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      </motion.div>
    );
  }

  if (!hotels || !locations) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-5 bg-white rounded-4 shadow-sm"
      >
        <Spinner animation="grow" variant="primary" />
        <div className="mt-3 text-muted">
          Đang tải dữ liệu khách sạn tại {city}...
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">
          <i className="bi bi-building-check me-2"></i>
          Khách sạn tại <span style={{ color: "var(--primary)" }}>{city}</span>
        </h2>
        <span className="badge bg-primary rounded-pill">
          {hotels.length} khách sạn
        </span>
      </div>
      <MapView hotels={hotels} center={locations[city].center} />
    </motion.div>
  );
}
