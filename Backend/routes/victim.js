const express = require("express");
const router = express.Router();
const VictimRequest = require("../models/VictimRequest");
const multer = require("multer");
const path = require("path");
const sendSMS = require("../sms_service");
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

    // Save directly to VictimRequest
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

    await newVictimRequest.save();
    console.log("✅ Victim request saved");

 const [lat, lng] = parseLatLng(location);

const smsBody = `🚨 HELP REQUEST 🚨
Name: ${name}
Contact: ${contact}
Location: Lat:${lat}, Lng:${lng}
Type: ${typeOfHelp}
Urgency: ${urgency}
People: ${peopleCount}
Description: ${description}`;


    // Send SMS automatically via Twilio
    await sendSMS(smsBody);

    console.log("✅ SMS sent successfully");

    res.status(201).json({ message: "Request saved and SMS sent successfully." });
  } catch (error) {
    console.error("❌ Error saving request:", error);
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

// Update status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await VictimRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Request not found" });

    let latitude = null;
    let longitude = null;
    if (updated.location) {
      const match = updated.location.match(/Lat:([\d.-]+),Lng:([\d.-]+)/);
      if (match) {
        latitude = parseFloat(match[1]);
        longitude = parseFloat(match[2]);
      }
    }

    res.json({ ...updated._doc, latitude, longitude });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
