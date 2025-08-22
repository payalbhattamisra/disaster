const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  item: { type: String, required: true },
  qty: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Inventory', InventorySchema);
