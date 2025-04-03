import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Sends an OTP message to a user's phone using Bulk SMS Login service.
 * 
 * @param {string} phoneNo - The destination phone number (including country code).
 * @param {string} otp - The one-time password to be sent.
 * @returns {Promise<void>}
 */
export const sendOtpPhone = async (phoneNo, otp) => {
  try {
    // Read from environment variables
    const authKey = process.env.SMS_COUNTRY_API_KEY;  // Your Bulk SMS Login Auth Key
    const templateId = process.env.SMS_COUNTRY_TEMPLATE_ID; // Your DLT Template ID

    // Customize these based on your own requirements
    const senderId = "24RYDS"; // Replace with your preferred Sender ID
    const route = 4;           // Check Bulk SMS Login docs for correct route if needed
    const country = 91;       // 0 often indicates 'International' or 'default country' usage
    const message = `Your 24RIDES journey starts with OTP ${otp}. Let's go! -
Regards,
24RIDES`;

    const url = "http://admin.bulksmslogin.com/api/sendhttp.php";

    // Using GET method with query parameters
    const response = await axios.get(url, {
      params: {
        authkey: authKey,
        mobiles: phoneNo,
        message: message,
        sender: senderId,
        route: route,
        country: country,
        DLT_TE_ID: templateId
      },
    });

    console.log("OTP sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending OTP via Bulk SMS Login:", error?.response?.data || error.message);
    throw new Error("Failed to send OTP");
  }
};
