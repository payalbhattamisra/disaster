import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // npm install qrcode.react
import "./DonateMoney.css";

function DonateMoney() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    paymentMethod: "UPI",
  });

  const [upiUrl, setUpiUrl] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Dynamically load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (formData.paymentMethod === "UPI") {
      // UPI payment
      const upiId = "8895905526@ibl"; // your real UPI ID
      const url = `upi://pay?pa=${upiId}&pn=Payal%20Bhattamisra&am=${formData.amount}&cu=INR`;

      setUpiUrl(url); // show QR code
      window.location.href = url; // redirect to UPI app
    } else {
      // Razorpay payment
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Razorpay SDK failed to load. Please check your internet.");
        return;
      }

     const options = {
  key: "rzp_test_R8O2jH5fFOOzx0",
  amount: formData.amount * 100,
  currency: "INR",
  name: "Disaster Relief Fund",
  description: `Donation by ${formData.name}`,
  handler: function (response) {
    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
  },
  prefill: {
    name: formData.name,
    email: formData.email,
    contact: formData.phone,
    // Prefill test card
    card: {
      number: "4111111111111111",
      expiry: "09/25",
      cvv: "123",
    },
  },
  theme: { color: "#3399cc" },
};


      const rzp = new window.Razorpay(options);
      rzp.open();
    }

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      amount: "",
      paymentMethod: "UPI",
    });
  };

  return (
    <div className="money-container">
      <h1>Donate Money</h1>
      <p>
        Support disaster relief by contributing securely via UPI, Net Banking,
        or Card.
      </p>

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
            min="1"
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

      {formData.paymentMethod === "UPI" && upiUrl && (
        <div className="upi-section">
          <h3>Or scan this QR to pay:</h3>
          <QRCodeCanvas value={upiUrl} size={200} />
        </div>
      )}
    </div>
  );
}

export default DonateMoney;
