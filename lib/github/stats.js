const chalk = require("chalk");
const Logger = require("../utils/logger");
const GitHubStats = require("github-stats");

class Stats {
  constructor() {}

  // 将 stats.toString 的回调风格转换为 Promise 风格
  toStringPromise(stats) {
    return new Promise((resolve, reject) => {
      stats.toString((err, output, warns) => {
        if (err) {
          reject(err);
        } else {
          resolve({ output, warns });
        }
      });
    });
  }

  async generateCard() {
    // 创建 GitHubStats 实例
    var stats = new GitHubStats({
      user: "dong4j",
      s_user: true,
    });

    try {
      // 等待 stats.toString 完成
      const { output, warns } = await this.toStringPromise(stats);

      // 输出结果
      console.log(output);

      // 返回结果
      return output;
    } catch (error) {
      throw error; // 抛出错误以便调用者处理
    }
  }

  async display() {
    try {
      await this.generateCard();
    } catch (error) {
      Logger.error("Error displaying card:" + error.message);
    }
  }
}

module.exports = Stats;
