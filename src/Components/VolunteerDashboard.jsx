import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./dashboard.css";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const VolunteerDashboard = () => {
  const [victimRequests, setVictimRequests] = useState([]);
  const [points, setPoints] = useState(0);

  const getBadge = () => {
    if (points >= 100) return "Gold";
    if (points >= 50) return "Silver";
    return "Bronze";
  };

  // Helper to parse "Lat:...,Lng:..." into numbers
  const parseLatLng = (locationStr) => {
    const latMatch = locationStr.match(/Lat:([\d.-]+)/);
    const lngMatch = locationStr.match(/Lng:([\d.-]+)/);
    if (latMatch && lngMatch) {
      return {
        lat: parseFloat(latMatch[1]),
        lng: parseFloat(lngMatch[1])
      };
    }
    return null;
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/victim/all") // Your endpoint
      .then((res) => res.json())
      .then((data) => {
        const parsedData = data
          .map((req) => {
            const coords = parseLatLng(req.location || "");
            return coords
              ? { ...req, latitude: coords.lat, longitude: coords.lng }
              : null;
          })
          .filter(Boolean); // remove nulls
        setVictimRequests(parsedData);
      })
      .catch((err) => console.error("Error fetching victim requests:", err));
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>📍 Request Details</h2>
        <p>Click on a pin to view request details.</p>
        <h3>🏆 Points: {points}</h3>
        <h3>🎖 Badge: {getBadge()}</h3>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapContainer
          center={[20.5937, 78.9629]} // India
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          {victimRequests.map((req, index) => (
            <Marker
              key={index}
              position={[req.latitude, req.longitude]}
            >
              <Popup>
                <strong>Location:</strong> {req.location || "Unknown"} <br />
                <strong>Details:</strong> {req.description || "N/A"} <br />
                <strong>Contact:</strong> {req.contact || "N/A"} <br />
                <strong>Help Needed:</strong> {req.typeOfHelp || "N/A"} <br />
                <strong>Urgency:</strong> {req.urgency || "N/A"} <br />
                <strong>People Count:</strong> {req.peopleCount || "N/A"}
                 
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
