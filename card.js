#!/usr/bin/env node

"use strict";

const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const open = require("open");
const fs = require("fs");
const request = require("request");
const path = require("path");
const ora = require("ora");
const cliSpinners = require("cli-spinners");

const Logger = require("./lib/utils/logger");
const DinoGame = require("./lib/game/dino");
const AIChat = require("./lib/ai/chat");
const basic_data = require("./lib/core/data");
const banner = require("./lib/cli/banner");
const WechatQRCode = require("./lib/wechat/qrcode");
const Stats = require("./lib/github/stats");

class CardCLI {
  constructor() {
    this.menuChoices = [
      {
        name: `1. Send me an ${chalk.green.bold("email")}?`,
        value: "email",
      },
      {
        name: `2. Download my ${chalk.magentaBright.bold("Resume")}?`,
        value: "resume",
      },
      {
        name: `3. Contact me via ${chalk.cyanBright.bold("WeChat")} 📱`,
        value: "QR",
      },
      {
        name: `4. Show my ${chalk.cyanBright.bold("Github")} Stats 〽️`,
        value: "github",
      },
      {
        name: `5. Play ${chalk.cyanBright.bold("Dino Runner")} Game 🦖`,
        value: "game",
      },
      {
        name: `6. Chat with ${chalk.cyanBright.bold("AI Assistant")} 🤖`,
        value: "chat",
      },
      {
        name: "7. Just quit. 👋",
        value: "exit",
      },
    ];
  }

  async downloadResume() {
    const loader = ora({
      text: " Downloading Resume",
      spinner: cliSpinners.material,
    }).start();

    return new Promise((resolve, reject) => {
      const pipe = request(basic_data.resume).pipe(
        fs.createWriteStream(basic_data.name + "-resume.html")
      );

      pipe.on("finish", () => {
        const downloadPath = path.join(
          process.cwd(),
          basic_data.name + "-resume.html"
        );
        Logger.info(`\nResume Downloaded at ${downloadPath} \n`);
        open(downloadPath);
        loader.stop();
        resolve();
      });

      pipe.on("error", (err) => {
        loader.stop();
        reject(err);
      });
    });
  }

  async sendEmail() {
    await open(basic_data.email);
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

  async showMenu() {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
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
