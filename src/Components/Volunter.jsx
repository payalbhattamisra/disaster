import React, { useState } from "react";
import "./volunter.css";

const Volunteer = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [location, setLocation] = useState({ lat: "", lng: "" });
 const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      () => alert("Unable to get location")
    );
  }
};
  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    ...formData,
    ...(isSignup ? location : {}) // only send location on signup
  };

  const url = isSignup
    ? "https://disaster-3hvn.onrender.com/api/volunteer/signup"
    : "https://disaster-3hvn.onrender.com/api/volunteer/login";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");

    alert(`✅ ${isSignup ? "Signup" : "Login"} successful!`);
    // Store volunteer info after login/signup
    // Make sure backend sends at least: _id, token, points
    localStorage.setItem("volunteer", JSON.stringify({
      _id: data._id,       // volunteer ID
      token: data.token,   // JWT token
      points: data.points || 0  // current points
    }));

    window.location.href = "/volunteer-dashboard";
  } catch (err) {
    alert("❌ " + err.message);
  }
};
  return (
    <div
    className="volunteer-auth-wrapper"
    style={{
        minHeight: "99.9vh",
        background: "linear-gradient(135deg, #2b6c76ff, #d25bb0ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow:"hidden"
    }}
    > 
    <div className="volunteer-auth-container">
      <h2>{isSignup ? "Volunteer Signup" : "Volunteer Login"}</h2>
      <form onSubmit={handleSubmit} className="volunteer-form">
  {isSignup && (
  <>
    {/* Full Name */}
    <div className="input-group">
      <i className="fas fa-user"></i>
      <input
        type="text"
        name="name"
        autoComplete="username_fake"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
    </div>

    {/* Get Current Location */}
    <button
      type="button"
      className="location-btn"
      onClick={getLocation}
    >
      📍 Get Current Location
    </button>
  </>
)}


  <div className="input-group">
    <i className="fas fa-envelope"></i>
    <input
      type="email"
      name="email"
      placeholder="Email ID"
      autoComplete="off"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>
  <div className="input-group">
    <i className="fas fa-lock"></i>
    <input
      type="password"
      name="password"
      autoComplete="new-password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
      required
    />
  </div>
  <button type="submit">{isSignup ? "Sign Up" : "Log In"}</button>
</form>

      <p onClick={toggleForm} className="toggle-link">
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign Up"}
      </p>
    </div>
    </div>
  );
};

export default Volunteer;
