const express = require("express");
const router = express.Router();
const Volunteer = require("../models/Volunteer");  
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
 
// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, lat, lng } = req.body;

    const existing = await Volunteer.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new Volunteer({
      name,
      email,
      password: hashed,
      location: {
        type: "Point",
        coordinates: [lng || 0, lat || 0] // Store as [lng, lat] in GeoJSON format
      }
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, "secret_key");
    res.status(201).json({ 
      _id: user._id,
      token,
      points: user.points
    });

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
    res.status(200).json({ 
      _id: user._id,
      token,
      points: user.points
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

 // Update points
router.patch("/:id/points", async (req, res) => {
  try {
    let { points } = req.body;
    points = Number(points) || 0;

    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    volunteer.points += points;
    await volunteer.save();

    res.json(volunteer); // send updated volunteer back
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
