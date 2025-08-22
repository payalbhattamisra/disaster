import React, { useState } from "react";
import "./DonateMedical.css";

function DonateMedical() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.details) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", details: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="donate-medical-page">
      <div className="donate-medical-main">
        {/* Header */}
        <div className="donate-medical-header">
          <div className="donate-medical-icon-box">
            <svg className="donate-medical-heart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="donate-medical-heading">Donate Medical Supplies</h1>
          <p className="donate-medical-description">Help save lives by contributing medicines, kits, or hospital aid.</p>
        </div>

        {/* Success Message */}
        {isSubmitted && (
          <div className="donate-medical-alert-success">
            <svg className="donate-medical-success-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Thank you for your medical donation! Your submission has been received.</span>
          </div>
        )}

        {/* Form */}
        <div className="donate-medical-card">
          <div className="donate-medical-form-grid">
            <div className="donate-medical-input-group">
              <label className="donate-medical-field-label">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="donate-medical-text-input"
              />
            </div>

            <div className="donate-medical-input-group">
              <label className="donate-medical-field-label">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="donate-medical-text-input"
              />
            </div>

            <div className="donate-medical-input-group">
              <label className="donate-medical-field-label">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="donate-medical-text-input"
              />
            </div>

            <div className="donate-medical-input-group">
              <label className="donate-medical-field-label">
                Medical Items / Quantity / Additional Details *
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="E.g., Paracetamol 10 boxes, first aid kits, bandages 5 packs, thermometers 3 units..."
                required
                className="donate-medical-text-area"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitted}
              className="donate-medical-submit-btn"
            >
              {isSubmitted ? 'Donation Submitted ✓' : 'Submit Donation'}
            </button>
          </div>

          {/* Additional Info */}
          <div className="donate-medical-info-panel">
            <h3 className="donate-medical-info-header">Important Information:</h3>
            <ul className="donate-medical-info-items">
              <li className="donate-medical-info-point">• Ensure all medicines are within expiry date</li>
              <li className="donate-medical-info-point">• Medical equipment should be in working condition</li>
              <li className="donate-medical-info-point">• We accept unopened medical supplies and equipment</li>
              <li className="donate-medical-info-point">• Our team will contact you within 24 hours for pickup/delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonateMedical;