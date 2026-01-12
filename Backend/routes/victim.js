const express = require("express");
const router = express.Router();
const VictimRequest = require("../models/VictimRequest");
const multer = require("multer");
const path = require("path");
//const sendSMS = require("../sms_service");
const nodemailer = require("nodemailer");
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
//Gmail verfication 
const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Disaster Alert System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "🚨 New Disaster Help Request",
    html: `
      <h2>New Help Request</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Contact:</b> ${data.contact}</p>
      <p><b>Location:</b> ${data.location}</p>
      <p><b>Help Type:</b> ${data.typeOfHelp}</p>
      <p><b>Urgency:</b> ${data.urgency}</p>
      <p><b>People Affected:</b> ${data.peopleCount}</p>
      <p><b>Description:</b> ${data.description}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

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

// const smsBody = `🚨 HELP REQUEST 🚨
// Name: ${name}
// Contact: ${contact}
// Location: Lat:${lat}, Lng:${lng}
// Type: ${typeOfHelp}
// Urgency: ${urgency}
// People: ${peopleCount}
// Description: ${description}`;


    // Send SMS automatically via Twilio
    //await sendSMS(smsBody);

    //console.log("✅ SMS sent successfully");
    await sendEmail({
        name,
        contact,
        location,
        typeOfHelp,
        urgency,
        peopleCount,
        description,
      });

      console.log("✅ Email sent successfully");


    res.status(201).json({
        message: "Request saved and email sent successfully.",
      });

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
  if (v.location && v.location.includes("Lat") && v.location.includes("Lng")) {
    try {
      const parts = v.location.split(",");
      latitude = parseFloat(parts[0].split(":")[1].trim());
      longitude = parseFloat(parts[1].split(":")[1].trim());
    } catch (err) {
      latitude = null;
      longitude = null;
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
    const { status, volunteerId } = req.body; // <-- receive volunteer ID from frontend
    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updateData = { status };
    if (status === "In Progress" || status === "Completed") {
      updateData.assignedVolunteer = volunteerId; // assign volunteer
    }

    const updated = await VictimRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
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
