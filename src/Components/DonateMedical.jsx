import React, { useState } from "react";
import "./DonateMedical.css";

function DonateMedical() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your medical donation!");
    setFormData({ name: "", email: "", phone: "", details: "" });
  };

  return (
    <div className="medical-container">
      <h1>Donate Medical Supplies</h1>
      <p>Help save lives by contributing medicines, kits, or hospital aid.</p>

      <form className="medical-form" onSubmit={handleSubmit}>
        <div>
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label>Medical items / Quantity / Additional Details</label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            placeholder="E.g., Paracetamol 10 boxes, first aid kits..."
            required
          ></textarea>
        </div>

        <button type="submit">Submit Donation</button>
      </form>
    </div>
  );
}

export default DonateMedical;
