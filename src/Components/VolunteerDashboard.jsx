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

  // Parse "Lat:...,Lng:..." into numbers
  const parseLatLng = (locationStr) => {
    const latMatch = locationStr.match(/Lat:([\d.-]+)/);
    const lngMatch = locationStr.match(/Lng:([\d.-]+)/);
    if (latMatch && lngMatch) {
      return {
        lat: parseFloat(latMatch[1]),
        lng: parseFloat(lngMatch[1]),
      };
    }
    return null;
  };

  // Geocode a name-based location like "Delhi" then convert to coordinates
  const geocodeLocation = async (locationName) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationName
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
    return null;
  };

  // Spread duplicate coordinates in a small circle so markers are clickable
  const adjustDuplicateCoords = (items) => {
    // Copy items (avoid mutating original)
    const result = items.map((it) => ({ ...it }));

    // Group indices by rounded coordinate key (tolerates tiny float diffs)
    const groups = {};
    result.forEach((it, idx) => {
      const key = `${it.latitude.toFixed(6)},${it.longitude.toFixed(6)}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(idx);
    });

    // For each group with >1 item, spread them around a circle
    Object.values(groups).forEach((indices) => {
      if (indices.length <= 1) return;

      const n = indices.length;
      const radius = 0.0004; // ~44 meters (tune as needed)
      for (let i = 0; i < n; i++) {
        const idx = indices[i];
        const angle = (2 * Math.PI * i) / n;
        const deltaLat = radius * Math.cos(angle);
        const deltaLng = radius * Math.sin(angle);
        result[idx].latitude = result[idx].latitude + deltaLat;
        result[idx].longitude = result[idx].longitude + deltaLng;
      }
    });

    return result;
  };
 const volunteerData = localStorage.getItem("volunteer");
const volunteer = volunteerData ? JSON.parse(volunteerData) : null;
const volunteerId = volunteer?._id; // optional chaining prevents crash

const updateStatus = async (id, newStatus) => {
  try {
    // PATCH request to update victim request status
    const res = await fetch(`http://localhost:5000/api/victim/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        status: newStatus,
        volunteerId: volunteer._id  // send volunteer ID
      }),
    });

    const updated = await res.json();

    // Update frontend state
    setVictimRequests((prev) =>
      prev.map((req) => (req._id === id ? updated : req))
    );

    if (newStatus === "Completed") {
      // Update points
      const resPoints = await fetch(
        `http://localhost:5000/api/volunteer/${volunteer._id}/points`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: 10 }),
        }
      );
      const updatedVolunteer = await resPoints.json();
      setPoints(updatedVolunteer.points);
      localStorage.setItem("volunteer", JSON.stringify(updatedVolunteer));

      alert("✅ Request completed successfully!");
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/victim/all");
        const data = await res.json();

        const parsedData = await Promise.all(
          data.map(async (req) => {
            let coords = parseLatLng(req.location || "");
            if (!coords && req.location) {
              coords = await geocodeLocation(req.location);
            }
            return coords
              ? { ...req, latitude: coords.lat, longitude: coords.lng }
              : null;
          })
        );

        // filter nulls and adjust duplicates
        const cleaned = parsedData.filter(Boolean);
        setVictimRequests(adjustDuplicateCoords(cleaned));
      } catch (err) {
        console.error("Error fetching victim requests:", err);
      }
    };

    fetchData();
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

         {victimRequests.map((req, index) =>
  req.latitude != null && req.longitude != null ? (
    <Marker key={index} position={[req.latitude, req.longitude]}>
      <Popup>
        <strong>Name:</strong> {req.name || "N/A"} <br />
        <strong>Location:</strong> {req.location || "Unknown"} <br />
        <strong>Details:</strong> {req.description || "N/A"} <br />
        <strong>Contact:</strong> {req.contact || "N/A"} <br />
        <strong>Help Needed:</strong> {req.typeOfHelp || "N/A"} <br />
        <strong>Urgency:</strong> {req.urgency || "N/A"} <br />
        <strong>People Count:</strong> {req.peopleCount || "N/A"} <br />
        <strong>Status:</strong> {req.status} <br /><br />

        {req.status === "Pending" && (
          <button onClick={() => updateStatus(req._id, "In Progress")}>
            Accept Request
          </button>
        )}

        {req.status === "In Progress" && (
          <button onClick={() => updateStatus(req._id, "Completed")}>
            Mark as Completed
          </button>
        )}
      </Popup>
    </Marker>
  ) : null
)}

        </MapContainer>
      </div>
    </div>
  );
};


export default VolunteerDashboard;
