// sms_service.js
require("dotenv").config();
const twilio = require("twilio");

const client = twilio('AC8e027780214146acfd44962d62536245', '9b23894772923108a1ca831fa1d8560f');

async function sendSMS(body) {
  try {
    const message = await client.messages.create({
      body,
      from: '+17404402827', // Your Twilio number
    to: '+918895905526'  // Recipient number (your phone)
    });
    console.log("✅ SMS sent:", message.sid);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    throw error;
  }
}

module.exports = sendSMS;
