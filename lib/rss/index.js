const fetch = require("node-fetch");
const { parseFeed } = require("@rowanmanning/feed-parser");

class RSS {
  constructor() {}

  async generateCard() {
    try {
      const response = await fetch("https://dong4j.github.io/rss2.xml");
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const feed = await parseFeed(await response.text());
      let count = 1;
      feed.items.slice(0, 5).forEach((item) => {
        console.log(`${count++}. ${item.title}: ${item.url}`);
      });
    } catch (error) {
      console.error("Failed to fetch and parse feed:", error);
    }
  }

  async display() {
    try {
      await this.generateCard();
    } catch (error) {
      Logger.error("Error displaying:" + error.message);
    }
  }
}

module.exports = RSS;
