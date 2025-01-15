const Logger = require("../utils/logger");
const { authUrl } = require("./defaultConfig");

class Auth {
  static async getToken() {
    try {
      const response = await fetch(authUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Add your authentication parameters here
        }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      return data.token; // Adjust according to your API response structure
    } catch (error) {
      Logger.error("Failed to authenticate:", error);
      return null;
    }
  }
}

module.exports = Auth;
