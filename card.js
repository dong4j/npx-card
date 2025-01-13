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
const qrcode = require("qrcode-terminal");
var GitHubStats = require("github-stats");

class CardCLI {
  constructor() {
    this.menuChoices = [
      {
        name: `Send me an ${chalk.green.bold("email")}?`,
        value: "email",
      },
      {
        name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
        value: "resume",
      },
      {
        name: `Contact me via ${chalk.cyanBright.bold("WeChat")} 📱`,
        value: "QR",
      },
      {
        name: `My ${chalk.cyanBright.bold("Github")} Stats 〽️`,
        value: "github",
      },
      {
        name: `Play ${chalk.cyanBright.bold("Dino Runner")} Game 🦖`,
        value: "game",
      },
      {
        name: `Chat with ${chalk.cyanBright.bold("AI Assistant")} 🤖`,
        value: "chat",
      },
      {
        name: "Just quit. 👋",
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
    qrcode.generate("https://u.wechat.com/MAFRLF2g62RSwOxpPrw8dFo", {
      small: true,
    });
    Logger.info("\nDone, Scan the QR code to add me as a friend.\n");
  }

  async startGithubStats() {
    // todo 阻塞直到返回数据
    var stats = new GitHubStats({
      user: "dong4j",
      s_user: true,
    });

    // Stringify everything
    stats.toString(function (err, output, warns) {
      console.log(err || output);
    });
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
