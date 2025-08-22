import React, { useState, useEffect, useRef } from "react";
import "./DonateGoods.css";

function DonateGoods() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
  });

  const firstInputRef = useRef(null);

  const items = [
    { name: "Clothes", desc: "Donate warm clothes, shoes, and blankets." },
    { name: "Food", desc: "Contribute non-perishable food items." },
    { name: "Books", desc: "Help children by donating books and stationery." },
    { name: "Medicine", desc: "Provide essential medicines and first-aid." },
    { name: "Toys", desc: "Gift toys to bring smiles to children." },
    { name: "Other", desc: "Donate any other useful items." },
  ];

  const openModal = (itemName) => {
    setSelectedItem(itemName);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({ name: "", email: "", phone: "", details: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for donating ${selectedItem}, ${formData.name}!`);
    closeModal();
  };

  // Focus first input on modal open
  useEffect(() => {
    if (modalOpen && firstInputRef.current) {
      firstInputRef.current.focus();
      document.body.style.overflow = "hidden"; // prevent background scroll
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  // Close modal on Esc key
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="donate-goods-container">
      <h1 className="title">Donate Goods</h1>
      <p className="subtitle">Choose what you’d like to donate</p>

      <div className="goods-grid">
        {items.map((item, index) => (
          <div className="goods-card" key={index}>
            <h2>{item.name}</h2>
            <p>{item.desc}</p>
            <button onClick={() => openModal(item.name)}>
              Donate {item.name}
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Donate {selectedItem}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  ref={firstInputRef}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Additional Details / Quantity
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  required
                />
              </label>

              <button
                type="submit"
                disabled={
                  !formData.name ||
                  !formData.email ||
                  !formData.phone ||
                  !formData.details
                }
              >
                Submit Donation
              </button>
            </form>
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonateGoods;
