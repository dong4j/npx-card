"use strict";

require("dotenv").config();
const inquirer = require("inquirer");
const readline = require("readline");
const chalk = require("chalk");
const { io } = require("socket.io-client");
const Logger = require("../utils/logger");

class LiveChatClient {
  constructor() {
    this.socket = null;
    this.socketId = null;
    this.username = null;
    this.serverUrl = null;
    this.room = "lobby";
    this.readline = null;
    this.exitResolver = null;
  }

  generateGuestName() {
    const suffix = Math.floor(100 + Math.random() * 900);
    return `guest-${suffix}`;
  }

  formatTime(timestamp) {
    return new Date(timestamp || Date.now()).toLocaleTimeString("zh-CN", {
      hour12: false,
    });
  }

  async askForConfig() {
    const defaultName = this.generateGuestName();
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "serverUrl",
        message: "Chat server URL:",
        default: process.env.CHAT_SERVER_URL || "https://api.dong4j.site/npx",
        validate: (input) => {
          try {
            new URL(input);
            return true;
          } catch (err) {
            return "Please provide a valid URL (e.g. http://localhost:4173)";
          }
        },
      },
      {
        type: "input",
        name: "username",
        message: "Display name:",
        default: defaultName,
        validate: (input) =>
          input.trim().length > 1 || "Name should be at least 2 characters",
      },
    ]);

    this.serverUrl = answers.serverUrl.trim();
    this.username = answers.username.trim();
  }

  setupReadline() {
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.readline.setPrompt(chalk.green("You > "));
    this.readline.on("line", (line) => {
      const message = line.trim();
      if (!message) {
        this.readline.prompt(true);
        return;
      }

      if (message.toLowerCase() === "exit") {
        this.cleanup();
        return;
      }

      this.socket.emit("chat:message", {
        room: this.room,
        message,
      });
      this.readline.prompt(true);
    });

    this.readline.on("SIGINT", () => {
      this.cleanup();
    });
  }

  bindSocketEvents() {
    this.socket.on("connect", () => {
      this.socketId = this.socket.id;
      Logger.highlight(
        `\nConnected to chat room as ${chalk.bold(this.username)} 🎉\n`
      );
      this.readline.prompt(true);
    });

    this.socket.on("connect_error", (err) => {
      Logger.error(`Connection failed: ${err.message}`);
      this.cleanup(true);
    });

    this.socket.on("disconnect", (reason) => {
      Logger.warning(`Disconnected: ${reason}`);
      this.cleanup(true);
    });

    this.socket.on("chat:message", (payload) => {
      const { author, message, timestamp, senderId } = payload || {};
      if (!message) return;
      // Skip echoing our own broadcast to avoid duplicate prompts
      if (senderId && this.socket && senderId === this.socket.id) return;
      const authorLabel =
        author && author !== this.username
          ? chalk.cyan(author)
          : chalk.magenta(author || "system");
      process.stdout.write(
        `\n[${this.formatTime(timestamp)}] ${authorLabel}: ${message}\n`
      );
      this.readline.prompt(true);
    });

    this.socket.on("chat:system", (payload) => {
      const { message, timestamp } = payload || {};
      if (!message) return;
      process.stdout.write(
        `\n[${this.formatTime(timestamp)}] ${chalk.yellow("system")}: ${message}\n`
      );
      this.readline.prompt(true);
    });
  }

  cleanup(keepNotice = false) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.socketId = null;
    }

    if (this.readline) {
      this.readline.close();
      this.readline = null;
    }

    if (!keepNotice) {
      Logger.highlight("\nExited chat room. 👋\n");
    }

    if (this.exitResolver) {
      this.exitResolver();
      this.exitResolver = null;
    }
  }

  async start() {
    await this.askForConfig();

    console.clear();
    Logger.highlight("\n👋 Welcome to the live chat room!\n");
    Logger.warning('Type "exit" anytime to return to the main menu.\n');
    Logger.info(`Connecting to ${this.serverUrl} ...`);

    const socketOptions = {
      transports: ["websocket", "polling"], // 支持降级到长轮询，适配 nginx 代理
      auth: {
        name: this.username,
        room: this.room,
      },
    };

    // 如果 URL 路径中包含 /npx，说明是通过 nginx 代理访问
    // Socket.IO 的 path 是相对于域名根路径的，所以需要：
    // 1. 将 base URL 设置为域名根路径（去掉 /npx）
    // 2. 设置 path 为 /npx/socket.io/ 以匹配 nginx 代理规则
    const url = new URL(this.serverUrl);
    let connectUrl = this.serverUrl;
    
    if (url.pathname && url.pathname.startsWith('/npx')) {
      // 通过 nginx 代理，base URL 应该是域名根路径
      connectUrl = `${url.protocol}//${url.host}`;
      socketOptions.path = '/npx/socket.io/';
      // Logger.info(`Using nginx proxy: ${connectUrl} with path ${socketOptions.path}`);
    }
    // 其他情况（如本地开发 http://localhost:4173）使用默认路径 /socket.io/

    this.socket = io(connectUrl, socketOptions);

    this.setupReadline();
    this.bindSocketEvents();

    // Keep the method pending until user leaves or disconnects
    await new Promise((resolve) => {
      this.exitResolver = resolve;
    });
  }
}

module.exports = LiveChatClient;
