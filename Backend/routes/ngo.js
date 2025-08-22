const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NGO = require("../models/Ngo");

const router = express.Router();
const VictimRequest = require("../models/VictimRequest");
const Volunteer = require("../models/Volunteer");
// Register NGO
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await NGO.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newNgo = new NGO({ name, email, password: hashedPassword });
    await newNgo.save();

    res.status(201).json({ message: "NGO registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login NGO
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const ngo = await NGO.findOne({ email });
    if (!ngo) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: ngo._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// GET /api/volunteer/activity
router.get("/activity", async (req, res) => {
  try {
    const requests = await VictimRequest.find().populate("assignedVolunteer", "name");

    const activity = requests.map(r => ({
      name: r.assignedVolunteer ? r.assignedVolunteer.name : "Unassigned",
      task: r.typeOfHelp,
      status: r.status
    }));

    res.json(activity);
  } catch (err) {
    console.error("Error fetching volunteer activity:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
