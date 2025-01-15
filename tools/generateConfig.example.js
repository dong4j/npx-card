#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// 从环境变量读取配置
const config = {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_API_BASE,
    model: process.env.OPENAI_MODEL
};

// 验证配置
if (!config.apiKey || !config.baseUrl || !config.model) {
    console.error('Error: Missing required environment variables');
    console.error('Please make sure the following variables are set in your .env file:');
    console.error('- OPENAI_API_KEY');
    console.error('- OPENAI_API_BASE');
    console.error('- OPENAI_MODEL');
    process.exit(1);
}

// 加密配置
const encryptedConfig = Buffer.from(JSON.stringify(config)).toString('base64');

// 生成配置文件内容
const configFileContent = `// 这里的配置是加密后的字符串
module.exports = {
    encryptedConfig: '${encryptedConfig}',
    authUrl: 'http://localhost:${process.env.CONFIG_SERVER_PORT || 3000}/v1/auth'
    configUrl: 'http://localhost:${process.env.CONFIG_SERVER_PORT || 3000}/v1/llm'
};`;

// 写入配置文件
const configPath = path.join(__dirname, '..', 'lib/ai', 'defaultConfig.js');
fs.writeFileSync(configPath, configFileContent);

console.log('Configuration file generated successfully!');
console.log(`Configuration written to: ${configPath}`);
console.log('\nConfiguration details:');
console.log(`API URL: ${config.baseUrl}`);
console.log(`Model: ${config.model}`);
