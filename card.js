#!/usr/bin/env node

"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const Logger = require("./lib/utils/logger");
const DinoGame = require("./lib/game/dino");
const AIChat = require("./lib/ai/chat");
const basic_data = require("./lib/core/data");
const banner = require("./lib/cli/banner");
const WechatQRCode = require("./lib/wechat/qrcode");
const Stats = require("./lib/github/index");
const RSS = require("./lib/rss/index");
const Resume = require("./lib/resume/index");

class CardCLI {
  constructor() {
    this.menuChoices = [
      {
        name: `1. Send me an ${chalk.green.bold("email")}?`,
        value: "email",
        short: "Send email",
      },
      {
        name: `2. Download my ${chalk.magentaBright.bold("Resume")}?`,
        value: "resume",
        short: "Download resume",
      },
      {
        name: `3. Contact me via ${chalk.cyanBright.bold("WeChat")} 📱`,
        value: "QR",
        short: "Show QR",
      },
      {
        name: `4. Show my ${chalk.cyanBright.bold("Github")} Stats 〽️`,
        value: "github",
        short: "Show Github Stats",
      },
      {
        name: `5. Play ${chalk.cyanBright.bold("Dino Runner")} Game 🦖`,
        value: "game",
        short: "Play game",
      },
      {
        name: `6. Chat with ${chalk.cyanBright.bold("AI Assistant")} 🤖`,
        value: "chat",
        short: "AI Assistant",
      },
      {
        name: `7. Show my ${chalk.cyanBright.bold("Latest blog")} 💥`,
        value: "rss",
        short: "Show RSS",
      },
      {
        name: "Just quit. 👋",
        value: "exit",
      },
    ];
  }

  async downloadResume() {
    const resume = new Resume();
    await resume.download();
  }

  async sendEmail() {
    const openModule = await import("open");
    await openModule.default(basic_data.email);
    Logger.info("\nDone, see you soon at inbox.\n");
  }

  async playGame() {
    const game = new DinoGame();
    await game.start();
  }

  async startChat() {
    const chat = new AIChat();
    await chat.start();
  }

  async startQR() {
    const qrcode = new WechatQRCode();
    await qrcode.display();
  }

  async startGithubStats() {
    const stats = new Stats();
    await stats.display();
  }

  async startRss() {
    const rss = new RSS();
    await rss.display();
  }

  async showMenu() {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        // https://github.com/th0r/inquirer-sortable-checkbox?tab=readme-ov-file
        pageSize: 10,
        choices: this.menuChoices,
      },
    ]);

    switch (action) {
      case "email":
        await this.sendEmail();
        break;
      case "resume":
        await this.downloadResume();
        break;
      case "game":
        await this.playGame();
        break;
      case "chat":
        await this.startChat();
        break;
      case "QR":
        await this.startQR();
        break;
      case "github":
        await this.startGithubStats();
        break;
      case "rss":
        await this.startRss();
        break;
      case "exit":
        Logger.highlight("Hasta la vista. 👋👋👋\n");
        return false;
    }

    return true;
  }

  async start() {
    clear();
    banner.display();

    try {
      let continueRunning = true;
      while (continueRunning) {
        continueRunning = await this.showMenu();
      }
    } catch (error) {
      Logger.error(`An error occurred: ${error.message}`);
      process.exit(1);
    }
  }
}

// Start the CLI
const cli = new CardCLI();
cli.start();
