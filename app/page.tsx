"use client";

import MapWrapper from "@/components/MapWrapper";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, Form, Alert } from "react-bootstrap";

type Location = {
  bbox: string;
  center: [number, number];
};

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState("TP. Hồ Chí Minh");
  const [locations, setLocations] = useState<Record<string, Location> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/vietnam_locations.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Record<string, Location>) => setLocations(data))
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setError("Lỗi khi tải danh sách tỉnh/thành phố.");
      });
  }, []);

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

  if (!locations) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mt-5 d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Đang tải danh sách tỉnh/thành phố...</p>
      </motion.div>
    );
  }

  return (
    <motion.main
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient"
      style={{
        background: "var(--gradient)",
        paddingBottom: "3rem",
        minHeight: "100vh",
      }}
    >
      <Container className="py-5">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-4 shadow-lg p-4 p-md-5 mb-5"
        >
          <h1
            className="text-center mb-4 display-4 fw-bold"
            style={{ color: "var(--primary)" }}
          >
            <i className="bi bi-geo-alt-fill me-2"></i>
            Tìm Khách Sạn ở Việt Nam
          </h1>
          <p className="text-center mb-4 fs-5 text-muted">
            Khám phá các khách sạn trên khắp đất nước Việt Nam xinh đẹp
          </p>

          <Form.Group className="mb-4 mx-auto" style={{ maxWidth: "500px" }}>
            <Form.Label className="fs-5 fw-semibold d-flex align-items-center">
              <i
                className="bi bi-map-fill me-2"
                style={{ color: "var(--accent)" }}
              ></i>
              Chọn tỉnh/thành phố:
            </Form.Label>
            <Form.Select
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border-2 border-primary py-2 fs-5"
            >
              {Object.keys(locations).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </motion.div>

        <MapWrapper city={selectedCity} />
      </Container>
    </motion.main>
  );
}
