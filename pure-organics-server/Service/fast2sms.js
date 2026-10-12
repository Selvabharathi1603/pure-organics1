const axios = require("axios");

async function sendOtpSms(mobileNumber, otpCode) {
  const apiKey = (process.env.FAST2SMS_API_KEY || "").trim();

  const cleanNumber = String(mobileNumber).replace(/\D/g, "").slice(-10);

  if (cleanNumber.length !== 10) {
    return {
      success: false,
      message: "please enter a valid 10-digit mobile number",
    };
  }

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: String(otpCode),
        numbers: cleanNumber,
      },
      {
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[Fast2SMS Response]:", response.data);

    if (response.data && response.data.return === true) {
      return { success: true, data: response.data };
    }

    console.warn(`[Fast2SMS rejected]: Fast2SMS returned an error. Using local test OTP for ${cleanNumber}: ${otpCode}`);
    return { success: true, simulated: true, otp: otpCode };
  } catch (error) {
    const errorDetails = error.response?.data || error.message;
    console.error("[Fast2SMS Gateway Error]:", errorDetails);

    console.log(`\n========================================`);
    console.log(`[TEST OTP SIMULATION FOR ${cleanNumber}]: ${otpCode}`);
    console.log(`========================================\n`);

    return {
      success: true,
      simulated: true,
      message: "OTP generated",
    };
  }
}

module.exports = { sendOtpSms };