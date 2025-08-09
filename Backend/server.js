const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // static file serve


// Routes
const victimRoutes = require("./routes/victim");
app.use("/api/victim", victimRoutes);

const volunteerRoutes = require("./routes/volunteer");
app.use("/api/volunteer", volunteerRoutes);

const ngoRoutes=require("./routes/ngo");
app.use("/api/ngo",ngoRoutes);

// Connect to MongoDB
require('dotenv').config({ path: __dirname + '/.env' }); // Force load from backend

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});