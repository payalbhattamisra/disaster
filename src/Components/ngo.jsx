import React, { useState } from "react";
import "./ngo.css";

const Ngo = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? "http://disaster-3hvn.onrender.com/api/ngo/register" // ✅ matches backend
      : "http://disaster-3hvn.onrender.com/api/ngo/login";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert(`✅ ${isSignup ? "Signup" : "Login"} successful!`);
      localStorage.setItem("ngoToken", data.token);
      window.location.href = "/ngo-dashboard";
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div
      className="volunteer-auth-wrapper"
      style={{
        minHeight: "99.9vh",
        background: "linear-gradient(135deg, #2a2a72, #009ffd)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        overflow: "hidden"
      }}
    >
      <div className="volunteer-auth-container">
        <h2>{isSignup ? "NGO/Admin Signup" : "NGO/Admin Login"}</h2>
        <form onSubmit={handleSubmit} className="volunteer-form">
          {isSignup && (
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

export default Ngo;
