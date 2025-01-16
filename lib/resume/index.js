const fs = require("fs");
const request = require("request");
const path = require("path");
const ora = require("ora");
const cliSpinners = require("cli-spinners");
const basic_data = require("../core/data");
const Logger = require("../utils/logger");
const open = require("open");

class Resume {
  constructor() {}

  async download() {
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
}

module.exports = Resume;
