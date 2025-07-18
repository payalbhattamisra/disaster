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

  // The getLocation function automatically detects the user’s current geographic location (latitude and longitude)
  // using the browser’s built-in Geolocation API, and sets it into the location field of your form.
  const getLocation = () => {
    if (navigator.geolocation) { // Checks if the Geolocation API is supported by the user's browser.
      navigator.geolocation.getCurrentPosition((pos) => { // When location is successfully retrieved, pos object contains latitude & longitude.
        const coords = `Lat:${pos.coords.latitude},Lng:${pos.coords.longitude}`;
        setForm((prev) => ({ ...prev, location: coords }));
      });
    }
  };

  // The handleChange function in your React component is responsible for updating the form state whenever any input field changes.
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setForm({ ...form, photo: files[0] }); // If the field is photo, the file is taken from files[0] (only single file allowed) and stored in form.photo.
    } else {
      setForm({ ...form, [name]: value }); // For all other inputs (like name, location, typeOfHelp, etc.), update the respective key in the state object.
    }
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
   for (let key in form) {
    if (key === "photo" && form.photo) {
      formData.append("photo", form.photo); // Only append if photo is selected
    } else {
      formData.append(key, form[key]);
    }
  }

  if (navigator.onLine) {
    fetch("http://localhost:5000/api/victim/submit", {
    method: "POST",
    body: formData,
  })
      .then((res) => res.json())
      .then((data) => {
        alert("✅ Submitted successfully!");
        console.log("Response:", data);
      })
      .catch((err) => {
        console.error("❌ Error submitting:", err);
        alert("Error submitting the form.");
      });
  } else {
    console.log("📴 Offline - Saved to localStorage");
    const requestData = { ...form, timestamp: new Date() };
    localStorage.setItem("offlineRequest", JSON.stringify(requestData));
    alert("📥 Saved locally (offline)");
  }

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
};

 
  // Sync if saved offline
  useEffect(() => {
    if (navigator.onLine && localStorage.getItem("offlineRequest")) {
      const offline = JSON.parse(localStorage.getItem("offlineRequest"));
      console.log("🛰 Syncing offline data:", offline);
      localStorage.removeItem("offlineRequest");
    }
  }, []);

   
  return (
    <>
      <div style={bgStyle}>
        <div className="victim-container">
          <h2>Help Request Form</h2>
          <form onSubmit={handleSubmit}>

            {/* Input field for name */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            {/* Input field for contact number */}
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              value={form.contact}
              onChange={handleChange}
              required
            />

            {/* Input field for number of people affected */}
            <input
              type="number"
              name="peopleCount"
              placeholder="Number of People Affected"
              value={form.peopleCount}
              onChange={handleChange}
              min="1"
              required
            />

            {/* Location input with auto-detect button */}
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

            {/* Dropdown to select type of help needed */}
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

            {/* Dropdown to select urgency level */}
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

            {/* Text area to describe the situation in detail */}
            <textarea
              name="description"
              placeholder="Describe the situation"
              value={form.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>

            {/* File upload for optional photo evidence */}
            <input type="file" name="photo" onChange={handleChange} />

            {/* Photo preview if a photo is selected */}
            {form.photo && (
              <img
                src={URL.createObjectURL(form.photo)}
                alt="Preview"
                style={{ width: "100px", marginTop: "10px", borderRadius: "6px" }}
              />
            )}

            {/* Submit button */}
            <button type="submit">Submit Help Request</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Victim;
