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
      }

      const data = await response.json();
      return data.token;
    } catch (error) {
      return null;
    }
  }
}

module.exports = Auth;
