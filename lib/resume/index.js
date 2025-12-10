const basic_data = require("../core/data");
const Logger = require("../utils/logger");

class Resume {
  constructor() {}

  async download() {
    const openModule = await import("open");
    Logger.info(`\nOpening resume in browser: ${basic_data.resume}\n`);
    await openModule.default(basic_data.resume);
    Logger.success("Resume opened in your browser.\n");
  }
}

module.exports = Resume;
