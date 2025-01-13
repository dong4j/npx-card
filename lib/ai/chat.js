const OpenAI = require('openai');
const inquirer = require('inquirer');
const Logger = require('../utils/logger');
const AIConfig = require('./config');

class AIChat {
    constructor() {
        this.openai = null;
        this.context = [];
        this.model = null;
    }

    async initializeOpenAI() {
        Logger.info('\nOpenAI API Configuration:');

        const config = await AIConfig.loadConfig(inquirer);
        
        // 初始化 OpenAI 客户端
        this.openai = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseUrl
        });
        this.model = config.model;

        // 显示当前使用的配置
        Logger.info('\nUsing configuration:');
        Logger.info(`API URL: ${config.baseUrl}`);
        Logger.info(`Model: ${config.model}\n`);
    }

    async start() {
        Logger.highlight('\n🤖 Welcome to AI Chat!\n');
        Logger.warning('Type your message and press Enter to chat.');
        Logger.warning('Type "exit" to return to the main menu.\n');

        // 初始化 OpenAI 客户端
        await this.initializeOpenAI();

        while (true) {
            const { message } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'message',
                    message: '👉 You:',
                    validate: input => input.length > 0 || 'Message cannot be empty'
                }
            ]);

            if (message.toLowerCase() === 'exit') {
                Logger.highlight('\nGoodbye! 👋\n');
                break;
            }

            try {
                process.stdout.write('\n🤖 AI Assistant: ');
                const stream = await this.openai.chat.completions.create({
                    model: this.model,
                    messages: [
                        ...this.context,
                        { role: 'user', content: message }
                    ],
                    stream: true,
                });

                let response = '';
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) {
                        process.stdout.write(content);
                        response += content;
                    }
                }
                console.log('\n');

                // 更新对话历史
                this.context.push({ role: 'user', content: message });
                this.context.push({ role: 'assistant', content: response });

                // 保持对话历史在合理范围内
                if (this.context.length > 10) {
                    this.context = this.context.slice(-10);
                }

            } catch (error) {
                Logger.error(error.message);
                Logger.warning('Please try again.\n');
            }
        }
    }
}

module.exports = AIChat;
