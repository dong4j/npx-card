# npx-card

👋 Hey there! This is my NPX card, a command-line business card that you can run using `npx dong4j`.

And get to know me in unique style.

I spent a non-trivial amount of effort building and designing this iteration of npx card, and I am proud of it! All I ask of you all is to put a **star** ⭐ on this project and not claim this effort as your own ♥.

## SCREENSHOT

The final output might look something like this:

[![asciicast](https://asciinema.org/a/yQWrglbOqUM44vi4MQ2ThpIp0.svg)](https://asciinema.org/a/yQWrglbOqUM44vi4MQ2ThpIp0)

## STEPS TO CREATE YOUR OWN

The article written by our friend @jackboberg. I used the same for the reference to deploy the package.
[Write a Simple npx Business Card](https://studioelsa.se/blog/open-source-oss-npx-business-card).

## Features

- 📧 Direct email contact
- 📄 Resume download
- 🦖 Interactive Dino Runner game
- 🤖 AI Chat Assistant
- 🎨 Beautiful CLI interface

## Usage

Just run:

```bash
npx dong4j
```

You'll see an interactive menu with several options:

1. Send an email
2. Download resume
3. Play Dino Runner game
4. Chat with AI Assistant
5. Exit

## AI Chat Configuration

The AI Chat feature uses OpenAI's API and can be configured in multiple ways:

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1  # Optional: for custom API endpoint
OPENAI_MODEL=gpt-3.5-turbo                 # Optional: default is gpt-3.5-turbo
CONFIG_SERVER_PORT=3000                     # Optional: for configuration server
```

### 2. Configuration Server

You can run a local configuration server to manage AI settings:

1. Copy `tools/configServer.example.js` to `tools/configServer.js`
2. Set up your environment variables
3. Run the server:

```bash
node tools/configServer.js
```

### 3. Generate Encrypted Configuration

To create an encrypted configuration file:

1. Copy `tools/generateConfig.example.js` to `tools/generateConfig.js`
2. Update the configuration values
3. Generate the config:

```bash
node tools/generateConfig.js
```

This will create an encrypted configuration file at `lib/ai/defaultConfig.js`.

### Configuration Priority

The AI Chat system will try to load configuration in the following order:

1. Remote configuration server (if available)
2. Local encrypted configuration
3. Custom configuration (user input)

## Project Structure

```
.
├── lib/
│   ├── ai/              # AI-related functionality
│   │   ├── chat.js      # AI chat implementation
│   │   ├── config.js    # AI configuration management
│   │   └── defaultConfig.js  # Encrypted default configuration
│   ├── cli/             # CLI-related code
│   │   └── banner.js    # CLI banner display
│   ├── core/            # Core functionality
│   │   └── data.js      # Basic information
│   ├── game/            # Game-related code
│   │   └── dino.js      # Dino runner game
│   └── utils/           # Utility functions
│       └── logger.js    # Logging utility
├── tools/               # Development tools
│   ├── configServer.js  # Configuration server
│   └── generateConfig.js # Config generation tool
├── .env                 # Environment variables
├── .env.example         # Example environment variables
└── card.js             # Main entry point
```

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration

5. For local testing:
```bash
node card.js
```

## Security

- API keys and sensitive configurations are never committed to the repository
- Configuration can be encrypted for distribution
- Environment variables are used for local development
- Remote configuration server supports secure transmission

## Contributing

Feel free to open issues or submit pull requests!

## License

MIT

## Todo List

1. 社交媒体集成
    - 添加更多社交媒体链接选项（如 Twitter、LinkedIn、GitHub、微信等）
    - 可以直接在终端预览最近的社交媒体动态
2. 个性化主题
    - 添加多种颜色主题供选择
    - 支持自定义终端显示样式
    - 添加更多动画效果
3. 互动功能
    - 添加一个简单的小游戏或者彩蛋
    - 添加一个简单的问答环节，让访问者可以更好地了解你
    - 添加一个留言板功能，访问者可以直接在终端给你留言
4. 技术展示
    - 添加一个选项来展示你的技术栈
    - 展示你的主要项目列表
    - 显示你的 GitHub 统计数据
5. 实用工具
    - 添加一个日程安排功能，让别人可以直接通过终端预约会面时间
    - 提供一个订阅功能，让感兴趣的人可以订阅你的更新
    - 添加一个分享功能，让访问者可以方便地将你的名片分享给他人
6. 本地化支持
    - 添加多语言支持（中文、英文等）
    - 根据访问者的时区显示相应的时间
7. 性能优化
    - 添加缓存机制，提高加载速度
    - 添加离线支持，即使在没有网络的情况下也能显示基本信息
8. 数据统计
    - 添加访问统计功能
    - 记录哪些功能最受欢迎
    - 生成使用报告