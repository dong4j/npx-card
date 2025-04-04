const fs = require('fs');
const request = require("request");
const path = require("path");
const ora = require("ora");
const cliSpinners = require("cli-spinners");
const basic_data = require("../core/data");
const Logger = require("../utils/logger");

class Resume {
  constructor() {}

  async download() {
    const loader = ora({
      text: " Downloading Resume",
      spinner: cliSpinners.material,
    }).start();

    const openModule = await import("open");

    return new Promise((resolve, reject) => {
      const pipe = request(basic_data.resume + "/resume.pdf").pipe(
        fs.createWriteStream("resume.pdf")
      );

      pipe.on("finish", () => {
        const downloadPath = path.join(
          process.cwd(),
          "resume.pdf"
        );
        Logger.info(`\nResume Downloaded at ${downloadPath} \n`);
        openModule.default(downloadPath);
        loader.stop();
        resolve();
      });

      pipe.on("error", (err) => {
        loader.stop();
        reject(err);
      });
    });
  }
}

module.exports = Resume;
