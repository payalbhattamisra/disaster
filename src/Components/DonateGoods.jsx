import React, { useState } from "react";
import "./DonateGoods.css";

function DonateGoods() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for donating ${selectedItem}!`);
    setModalOpen(false);
  };

  return (
    <div className="donate-goods-container">
      <h1 className="title">Donate Goods</h1>
      <p className="subtitle">Choose what you’d like to donate</p>

      <div className="goods-grid">
        {items.map((item, index) => (
          <div className="goods-card" key={index}>
            <h2>{item.name}</h2>
            <p>{item.desc}</p>
            <button onClick={() => openModal(item.name)}>Donate {item.name}</button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Donate {selectedItem}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone Number" required />
              <textarea placeholder="Additional Details / Quantity" required />
              <button type="submit">Submit Donation</button>
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
