const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new inventory item
router.post('/add', async (req, res) => {
  try {
    const { item, qty } = req.body;
    const newItem = new Inventory({ item, qty });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
