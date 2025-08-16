import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./Donation.css";

function Donation() {
  const navigate = useNavigate();

  return (
    <div className="donation-container">
      <div className="donation-header">
        <h1>Support Disaster Relief</h1>
        <p>
          Your contribution can save lives. Choose how you’d like to donate and
          make a difference today.
        </p>
      </div>

      <div className="donation-options">
        {/* Money Donation */}
        <div className="donation-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1047/1047711.png"
            alt="Money Donation"
          />
          <h2>Monetary Donation</h2>
          <p>Donate securely via UPI, Net Banking, or Card.</p>
          <button onClick={() => navigate("/donate-money")}>
            Donate Money
          </button>
        </div>

        {/* Goods Donation */}
        <div className="donation-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
            alt="Food Donation"
          />
          <h2>Food & Essentials</h2>
          <p>Contribute food, clothes, medicines, or blankets.</p>
          <button onClick={() => navigate("/donate-goods")}>
            Donate Goods
          </button>
        </div>

        {/* Medical Donation */}
        <div className="donation-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966482.png"
            alt="Medical Donation"
          />
          <h2>Medical Support</h2>
          <p>Help with medicines, medical kits, or hospital aid.</p>
          <button onClick={() => navigate("/donate-medical")}>
            Donate Medical
          </button>
        </div>
      </div>

      <div className="donation-footer">
        <h3>Every small help counts ❤️</h3>
        <p>
          100% of your donations are used directly in relief operations and
          support for victims.
        </p>
      </div>
    </div>
  );
}

export default Donation;
