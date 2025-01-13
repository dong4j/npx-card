const chalk = require("chalk");
const qrcode = require("qrcode-terminal");
const Logger = require("../utils/logger");

class WechatQRCode {
  constructor() {
    
  }

  async generateCard() {
    qrcode.generate("https://u.wechat.com/MAFRLF2g62RSwOxpPrw8dFo", {
      small: true,
    });
    Logger.info(
      `\n${chalk.green.bold("Scan the QR code to add me as a friend.")}\n`
    );
  }

  async display() {
    const card = await this.generateCard();
  }
}

module.exports = WechatQRCode;
