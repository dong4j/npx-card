const basic_data = require("./lib/data");
const boxen = require("boxen");
const chalk = require("chalk");

const data = {
  name: chalk.bold.green("              Hi there 👋，I'm " + basic_data.name),
  work: `${chalk.white(basic_data.title + " at")} ${chalk
    .hex("#2b82b2")
    .bold(basic_data.company)}`,
  twitter: chalk.gray(basic_data.twitter) + chalk.cyan(basic_data.name),
  github: chalk.gray(basic_data.github) + chalk.green(basic_data.name),
  linkedin: chalk.gray(basic_data.linkedin) + chalk.blue(basic_data.name),
  homepage: chalk.cyan(basic_data.homepage),
  blog: chalk.cyan(basic_data.blog),
  npx: chalk.red("npx") + " " + chalk.white(basic_data.name),

  labelWork: chalk.white.bold("       Work:"),
  labelTwitter: chalk.white.bold("    Twitter:"),
  labelGitHub: chalk.white.bold("     GitHub:"),
  labelLinkedIn: chalk.white.bold("   LinkedIn:"),
  labelHomepage: chalk.white.bold("   Homepage:"),
  labelBlog: chalk.white.bold("       Blog:"),
  labelCard: chalk.white.bold("       Card:"),
};

const me = boxen(
  [
    `${data.name}`,
    ``,
    `${data.labelWork}  ${data.work}`,
    ``,
    `${data.labelTwitter}  ${data.twitter}`,
    `${data.labelGitHub}  ${data.github}`,
    `${data.labelLinkedIn}  ${data.linkedin}`,
    `${data.labelHomepage}  ${data.homepage}`,
    `${data.labelBlog}  ${data.blog}`,
    ``,
    `${data.labelCard}  ${data.npx}`,
    ``,
    `${chalk.bold("I am currently looking for new opportunities,")}`,
    `${chalk.bold("my inbox is always open. Whether you have a")}`,
    `${chalk.bold("question or just want to say hi, I will try ")}`,
    `${chalk.bold("my best to get back to you!")}`,
  ].join("\n"),
  {
    margin: 1,
    float: "center",
    padding: 1,
    borderStyle: "single",
    borderColor: "green",
  }
);

const tip = [
  `Tip: Try ${chalk.cyanBright.bold("cmd/ctrl + click")} on the links above`,
  "",
].join("\n");

const print = () => {
  console.log(me);
  console.log(tip);
};
module.exports = () => print();
