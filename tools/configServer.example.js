require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// 从环境变量获取端口，默认为 3000
const port = process.env.CONFIG_SERVER_PORT || 3000;

// 启用 CORS
app.use(cors());

// 配置对象 - 从环境变量读取
const config = {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_API_BASE,
    model: process.env.OPENAI_MODEL
};

// 加密配置
const encryptedConfig = Buffer.from(JSON.stringify(config)).toString('base64');

// 配置端点
app.get('/v1/config', (req, res) => {
    res.json({
        encryptedConfig: encryptedConfig
    });
});

app.listen(port, () => {
    console.log(`Config server running at http://localhost:${port}/v1/config`);
});
