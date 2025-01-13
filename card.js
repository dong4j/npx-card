#!/usr/bin/env node

'use strict'

const info = require('./index.js')
const basic_data = require('./lib/data')
const chalk = require("chalk");
const inquirer = require("inquirer");
const clear = require("clear");
const open = require("open");
const fs = require('fs');
const request = require('request');
const path = require('path');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
const DinoGame = require('./lib/dinoGame');
clear();

const prompt = inquirer.createPromptModule();

const questions = [
    {
        type: "list",
        name: "action",
        message: "What you want to do?",
        choices: [
            {
                name: `Send me an ${chalk.green.bold("email")}?`,
                value: () => {
                    open(basic_data.email);
                    console.log("\nDone, see you soon at inbox.\n");
                }
            },
            {
                name: `Download my ${chalk.magentaBright.bold("Resume")}?`,
                value: () => {
                    cliSpinners.dots;
                    const loader = ora({
                        text: ' Downloading Resume',
                        spinner: cliSpinners.material,
                    }).start();
                    let pipe = request(basic_data.resume).pipe(fs.createWriteStream(basic_data.name + '-resume.html'));
                    pipe.on("finish", function () {
                        let downloadPath = path.join(process.cwd(), basic_data.name + '-resume.html')
                        console.log(`\nResume Downloaded at ${downloadPath} \n`);
                        open(downloadPath)
                        loader.stop();
                    });
                }
            },
            {
                name: `Play ${chalk.cyanBright.bold("Dino Runner")} Game 🦖`,
                value: async () => {
                    console.log(chalk.cyanBright.bold("\n🎮 Welcome to Dino Runner! 🎮"));
                    console.log(chalk.yellow("Jump over the cacti and survive as long as you can!"));
                    console.log(chalk.gray("Loading game..."));
                    
                    const game = new DinoGame();
                    await game.start();
                    
                    // After game over, return to menu
                    console.log(chalk.gray("\nPress any key to return to menu..."));
                    await new Promise(resolve => process.stdin.once('data', resolve));
                }
            },
            {
                name: "Just quit.",
                value: () => {
                    console.log("Hasta la vista.\n");
                }
            }
        ]
    }
];

info()

prompt(questions).then(answer => answer.action());
