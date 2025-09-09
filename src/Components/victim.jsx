import React, { useState, useEffect } from "react";
import './victim.css';

const Victim = () => {
  const bgStyle = {
    backgroundImage: "url('/images/victimform_bg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '92vh',
    paddingTop: '60px',
  };

  const [form, setForm] = useState({
    name: '',
    location: '',
    typeOfHelp: '',
    description: '',
    urgency: '',
    contact: '',
    peopleCount: '',
    photo: null,
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = `Lat:${pos.coords.latitude},Lng:${pos.coords.longitude}`;
        setForm((prev) => ({ ...prev, location: coords }));
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm({ ...form, photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  // Determine API URL based on environment
 const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/victim/submit"
    : "https://disaster-3hvn.onrender.com/api/victim/submit";

  const formData = new FormData();
  for (let key in form) {
    if (key === "photo" && form.photo) {
      formData.append("photo", form.photo);
    } else {
      formData.append(key, form[key]);
    }
  }

  fetch(API_URL, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      if (!res.ok) {
        // If server returned error, throw it to catch block
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      alert("✅ Submitted successfully! SMS sent automatically.");
      console.log("Response:", data);

      // Clear form
      setForm({
        name: "",
        location: "",
        typeOfHelp: "",
        description: "",
        urgency: "",
        contact: "",
        peopleCount: "",
        photo: null,
      });
    })
    .catch((err) => {
      console.error("❌ Error submitting:", err);
      alert("❌ Error submitting the form. Check console for details.");
    });
};

  

  useEffect(() => {
    if (navigator.onLine && localStorage.getItem("offlineRequest")) {
      const offline = JSON.parse(localStorage.getItem("offlineRequest"));
      console.log("🛰 Syncing offline data:", offline);
      localStorage.removeItem("offlineRequest");
    }
  }, []);

  return (
    <div style={bgStyle}>
      <div className="victim-container">
        <h2>Help Request Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="peopleCount"
            placeholder="Number of People Affected"
            value={form.peopleCount}
            onChange={handleChange}
            min="1"
            required
          />

          <div className="location-row">
            <input
              type="text"
              name="location"
              placeholder="Manual Location Pin"
              value={form.location}
              onChange={handleChange}
            />
            <button type="button" onClick={getLocation}>Auto Detect</button>
          </div>

          <select
            name="typeOfHelp"
            value={form.typeOfHelp}
            onChange={handleChange}
            required
          >
            <option value="">Type of Help</option>
            <option value="Medical">Medical</option>
            <option value="Shelter">Shelter</option>
            <option value="Food">Food</option>
            <option value="Rescue">Rescue</option>
          </select>

          <select
            name="urgency"
            value={form.urgency}
            onChange={handleChange}
            className={`urgency-select ${form.urgency.toLowerCase()}`}
            required
          >
            <option value="">Select Urgency</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <textarea
            name="description"
            placeholder="Describe the situation"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>

          <input type="file" name="photo" onChange={handleChange} />
          {form.photo && (
            <img
              src={URL.createObjectURL(form.photo)}
              alt="Preview"
              style={{ width: "100px", marginTop: "10px", borderRadius: "6px" }}
            />
          )}

          <button type="submit">Submit Help Request</button>

        </form>
      </div>
    </div>
  );
};

export default Victim;
