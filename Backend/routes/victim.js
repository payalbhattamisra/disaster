const express = require("express");
const router = express.Router();
const VictimRequest = require("../models/VictimRequest");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// Helper to extract lat/lng from string
function parseLatLng(location) {
  try {
    const regex = /Lat:([\d.-]+),Lng:([\d.-]+)/;
    const match = location.match(regex);
    if (!match) return [null, null];
    return [parseFloat(match[1]), parseFloat(match[2])];
  } catch (err) {
    return [null, null];
  }
}

// POST /api/victims/submit
router.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      contact,
      location,
      typeOfHelp,
      urgency,
      peopleCount,
      description,
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const newVictimRequest = new VictimRequest({
      name,
      contact,
      location,
      typeOfHelp,
      urgency,
      peopleCount,
      description,
      photo,
    });

    await newVictimRequest.save(); // Save to victimrequests

    // Parse lat/lng for map
    const [lat, lng] = parseLatLng(location);
    if (!lat || !lng) {
      return res.status(400).json({ error: "Invalid location format" });
    }

    // Save to requests collection
    const newMapRequest = new Request({
      type: typeOfHelp,
      urgency,
      address: location,
      lat,
      lng,
      status: "Pending",
    });

    await newMapRequest.save(); // Save to requests collection

    res.status(201).json({ message: "Request saved successfully." });
  } catch (error) {
    console.error("Error saving request:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
// GET /api/victim/all
router.get("/all", async (req, res) => {
  try {
    const victims = await VictimRequest.find();

    // Convert "Lat:xx,Lng:yy" string into latitude & longitude fields
    const formatted = victims.map(v => {
      let latitude = null;
      let longitude = null;
      if (v.location) {
        const match = v.location.match(/Lat:([\d.-]+),Lng:([\d.-]+)/);
        if (match) {
          latitude = parseFloat(match[1]);
          longitude = parseFloat(match[2]);
        }
      }
      return {
        ...v._doc,
        latitude,
        longitude
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching victims:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
