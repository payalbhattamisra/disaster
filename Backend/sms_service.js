// sms_service.js
require("dotenv").config();
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(body) {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_FROM_NUMBER, // Your Twilio number
    to:process.env.TO_NUMBER  // Recipient number (your phone)
    });
    console.log("✅ SMS sent:", message.sid);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    throw error;
  }
}

module.exports = sendSMS;