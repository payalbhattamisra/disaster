const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"]
  },
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

module.exports = mongoose.model("Ngo", ngoSchema);
