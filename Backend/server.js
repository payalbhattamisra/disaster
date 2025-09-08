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

const inventoryRoutes = require('./routes/inventory');
app.use('/api/inventory', inventoryRoutes);

app.get("/api/news", async (req, res) => {
  try {
    const query = req.query.q || "earthquake OR flood OR wildfire";
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});
// Connect to MongoDB
require('dotenv').config({ path: __dirname + '/.env' }); // Force load from backend

require("dotenv").config();
console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID ? "Loaded ✅" : "Missing ❌");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});