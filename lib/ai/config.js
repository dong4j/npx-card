const { encryptedConfig, configUrl } = require("./defaultConfig");
const Logger = require("../utils/logger");
const Auth = require("./auth");
const fs = require("fs");
const path = require("path");

class AIConfig {
  static decryptConfig(encrypted) {
    try {
      const decoded = Buffer.from(encrypted, "base64").toString("utf-8");
      return JSON.parse(decoded);
    } catch (error) {
      Logger.error("Failed to decrypt configuration");
      return null;
    }
  }

  static async fetchRemoteConfig() {
    try {
      // First get the authentication token
      const token = await Auth.getToken();
      if (!token) {
        throw new Error("Failed to obtain authentication token");
      }

      // Use the token to fetch configuration
      const response = await fetch(configUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!data.encryptedConfig) {
        throw new Error("No encrypted configuration received from server");
      }

      // 获取 defaultConfig.js 的绝对路径
      const configPath = path.join(__dirname, "defaultConfig.js");

      // 更新配置文件
      const configContent = `module.exports = {
  configUrl: '${data.configUrl}',
  authUrl: '${data.authUrl}',
  encryptedConfig: '${data.encryptedConfig}'
};`;

      fs.writeFileSync(configPath, configContent, "utf8");
      const finalConfig = this.decryptConfig(data.encryptedConfig);
      finalConfig.type = "🎉";
      return finalConfig;
    } catch (error) {
      return null;
    }
  }

  static async loadConfig(inquirer) {
    const { configMethod } = await inquirer.prompt([
      {
        type: "list",
        name: "configMethod",
        message: "How would you like to configure the AI service?",
        choices: [
          { name: "Use provided AI service", value: "provided" },
          { name: "Use custom configuration", value: "custom" },
        ],
      },
    ]);

    if (configMethod === "provided") {
      let config = await this.fetchRemoteConfig();

      if (config) {
        // Logger.success("Successfully loaded configuration from remote server");
      } else {
        config = this.decryptConfig(encryptedConfig);

        if (config) {
          config.type = "👾";
          // Logger.success("Successfully loaded local encrypted configuration");
        } else {
          // Logger.error("Failed to load local encrypted configuration");
          Logger.warning("Falling back to custom configuration...");
        }
      }

      if (config) {
        return config;
      }
    }

    // 自定义配置
    return this.promptCustomConfig(inquirer);
  }

  static async promptCustomConfig(inquirer) {
    const config = {};

    // 获取 API Key
    const { apiKey } = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Enter your OpenAI API key:",
        validate: (input) => input.length > 0 || "API key is required",
      },
    ]);
    config.apiKey = apiKey;

    // 获取 Base URL
    const { useCustomUrl } = await inquirer.prompt([
      {
        type: "confirm",
        name: "useCustomUrl",
        message: "Do you want to use a custom API URL?",
        default: false,
      },
    ]);

    if (useCustomUrl) {
      const { baseUrl } = await inquirer.prompt([
        {
          type: "input",
          name: "baseUrl",
          message: "Enter the API base URL:",
          default: "https://api.openai.com/v1",
          validate: (input) => {
            try {
              new URL(input);
              return true;
            } catch {
              return "Please enter a valid URL";
            }
          },
        },
      ]);
      config.baseUrl = baseUrl;
    } else {
      config.baseUrl = "https://api.openai.com/v1";
    }

    // 获取模型名称
    const { model } = await inquirer.prompt([
      {
        type: "input",
        name: "model",
        message: "Enter the model name:",
        default: "gpt-3.5-turbo",
        validate: (input) => input.length > 0 || "Model name is required",
      },
    ]);
    config.model = model;
    config.type = "🤖";

    Logger.info('\nOpenAI API Configuration:');
    Logger.info('\nUsing configuration:');
    Logger.info(`API URL: ${config.baseUrl}`);
    Logger.info(`Model: ${config.model}\n`);
    return config;
  }
}

module.exports = AIConfig;
