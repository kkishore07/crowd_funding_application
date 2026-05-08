// Mock SMS service — replace with real provider integration (Twilio, Nexmo, etc.)
const sendSMS = async (phoneNumber, message) => {
  // Simulate async delivery
  await new Promise((r) => setTimeout(r, 200));
  const log = `[Mock SMS] To: ${phoneNumber} — ${message}`;
  console.log(log);
  return { success: true, message: log };
};

module.exports = { sendSMS };
