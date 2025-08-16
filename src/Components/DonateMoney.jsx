import React, { useState } from "react";
import "./DonateMoney.css";

function DonateMoney() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    paymentMethod: "UPI",
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${formData.name} for donating ₹${formData.amount} via ${formData.paymentMethod}!`);
    setFormData({ name: "", email: "", phone: "", amount: "", paymentMethod: "UPI" });
  };

  return (
    <div className="money-container">
      <h1>Donate Money</h1>
      <p>Support disaster relief by contributing securely via UPI, Net Banking, or Card.</p>

      <form className="money-form" onSubmit={handleSubmit}>
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
          <label>Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter donation amount"
            required
          />
        </div>

        <div>
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="UPI">UPI</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <button type="submit">Submit Donation</button>
      </form>
    </div>
  );
}

export default DonateMoney;
