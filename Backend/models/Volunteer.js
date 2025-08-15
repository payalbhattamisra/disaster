const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
   // GeoJSON location: [lng, lat]
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  available: { type: Boolean, default: true }
});
volunteerSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Volunteer", volunteerSchema);
