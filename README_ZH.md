# npx-card

👋 这是我的 NPX 名片，运行 `npx dong4j` 就能在命令行里认识我。

我为这个版本投入了不少心血，也很自豪！如果喜欢，请点个 **star** ⭐，也请不要把这份心血据为己有 ♥。

## 截图

最终效果类似：

[![asciicast](https://asciinema.org/a/yQWrglbOqUM44vi4MQ2ThpIp0.svg)](https://asciinema.org/a/yQWrglbOqUM44vi4MQ2ThpIp0)

## 自己动手做一份

参考 @jackboberg 的文章：[Write a Simple npx Business Card](https://studioelsa.se/blog/open-source-oss-npx-business-card)。

## 功能

- 📧 直接发送邮件
- 📄 简历（直接打开网站）
- 🦖 小恐龙跑酷
- 💬 实时聊天室（单房间）
- 🤖 AI 助手聊天
- 🎨 漂亮的命令行界面

## 使用

```bash
npx dong4j
```

菜单选项：
1. 发送邮件
2. 打开简历网站
3. 微信二维码
4. Github 统计
5. 小恐龙跑酷
6. AI 助手聊天
7. 进入实时聊天室
8. 查看最新博客
9. 退出

### 实时聊天室

所有 `npx dong4j` 用户共享同一个房间（lobby）。开启步骤：

1. 启动服务端（本地示例）：
   ```bash
   CHAT_SERVER_PORT=4173 node tools/liveChatServer.js
   ```
2. 设置客户端地址（或使用默认值）：
   ```bash
   export CHAT_SERVER_URL=http://localhost:4173
   ```
3. 运行 `npx dong4j`，选择 “Join Live Chat Room 💬”。

提示：
- 目前所有人都进入同一房间 `lobby`
- 聊天时输入 `exit` 可返回主菜单

## AI Chat 配置

AI Chat 使用 OpenAI API，有多种配置方式。

### 1. 环境变量

在项目根目录创建 `.env`：
```env
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1  # 可选，自定义 API 地址
OPENAI_MODEL=gpt-3.5-turbo                 # 可选，默认 gpt-3.5-turbo
CONFIG_SERVER_PORT=3000                    # 可选，配置服务端口
```

### 2. 配置服务器

1. 复制 `tools/configServer.example.js` 为 `tools/configServer.js`
2. 设置环境变量
3. 运行：
   ```bash
   node tools/configServer.js
   ```

### 3. 生成加密配置

1. 复制 `tools/generateConfig.example.js` 为 `tools/generateConfig.js`
2. 填写配置值
3. 生成：
   ```bash
   node tools/generateConfig.js
   ```
   会在 `lib/ai/defaultConfig.js` 生成加密配置。

### 4. 配置优先级

1. 远程配置服务器（如果可用）
2. 本地加密配置
3. 自定义输入

## 项目结构

```
.
├── lib/
│   ├── ai/              # AI 功能
│   │   ├── chat.js      # AI 聊天实现
│   │   ├── config.js    # AI 配置管理
│   │   └── defaultConfig.js  # 默认加密配置
│   ├── cli/             # CLI 展示
│   │   └── banner.js
│   ├── core/            # 基础信息
│   │   └── data.js
│   ├── game/            # 游戏
│   │   └── dino.js
│   └── utils/           # 工具
│       └── logger.js
├── tools/               # 开发/配置工具
│   ├── configServer.js
│   └── generateConfig.js
├── .env                 # 环境变量
├── .env.example         # 环境变量示例
└── card.js              # 入口
```

## 开发

1. 安装依赖：
   ```bash
   npm install
   ```
2. 准备环境变量：
   ```bash
   cp .env.example .env
   ```
   根据需要编辑 `.env`。
3. 本地运行：
   ```bash
   node card.js
   ```
4. 鉴权测试：
   ```bash
   node test/auth.test.js --config .env
   ```

## 安全

- 不提交 API key 等敏感配置
- 支持加密配置分发
- 本地开发使用环境变量
- 远程配置服务器支持安全传输

## 贡献

欢迎提 Issue 或 PR！

## 许可证

MIT

## Todo

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
