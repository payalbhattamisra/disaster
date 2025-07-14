const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");  
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Volunteer.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new Volunteer({ name, email, password: hashed });
    await user.save();

    const token = jwt.sign({ id: user._id }, "secret_key");
    res.status(201).json({ token });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Volunteer.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret_key");
    res.status(200).json({ token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
