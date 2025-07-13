const express=require("express");
const router=express.Router();
const VictimRequest=require("../models/VictimRequest");
const multer=require("multer");
const path = require("path");


// Multer (used for handling file uploads), cb stands for callback. It’s a function that you must call to let Multer know that:
// You’re done handling the current step (like setting the destination or filename).
// You’re passing control back to Multer so it can proceed.
// Photo upload config

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // safe absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
//post request
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

    const newRequest = new VictimRequest({
      name,
      contact,
      location,
      typeOfHelp,
      urgency,
      peopleCount,
      description,
      photo,
    });

    await newRequest.save();

    res.status(201).json({ message: "Request saved successfully." });
  } catch (error) {
    console.error("Error saving request:", error); // Log real error
    res.status(500).json({ error: "Server error", details: error.message });
  }
});
module.exports = router;