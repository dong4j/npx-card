require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();

// 从环境变量获取端口，默认为 3000
const port = process.env.CONFIG_SERVER_PORT || 3000;
// 从环境变量获取 token 有效期（秒），默认为 5 秒
const tokenExpiration = (process.env.TOKEN_EXPIRATION || 5) * 1000;

// 启用 CORS
app.use(cors());
app.use(express.json());

// 存储有效的 token
const validTokens = new Set();

// 生成随机 token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// 验证 token 的中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || !validTokens.has(token)) {
    return res.status(401).json({ error: '未授权的访问' });
  }

  next();
}

// 配置对象 - 从环境变量读取
const config = {
    apiKey: process.env.OPENAI_API_KEY,
    baseUrl: process.env.OPENAI_API_BASE,
    model: process.env.OPENAI_MODEL
};

// 加密配置
const encryptedConfig = Buffer.from(JSON.stringify(config)).toString('base64');

app.all("*", (req, res, next) => {
    // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    // 允许的header类型
    res.header("Access-Control-Allow-Headers","content-type,authorization");
    // 跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  // 让options尝试请求快速结束
    else
        next();
});

// 认证路由
app.post('/api/auth', (req, res) => {
    const token = generateToken();
    validTokens.add(token);
    
    // Token 有效期为 1 小时
    setTimeout(() => {
        validTokens.delete(token);
    }, tokenExpiration);
    
    res.json({ token, expiresIn: tokenExpiration });
});

// 配置端点 - 添加认证中间件
app.get('/api/config', authenticateToken, (req, res) => {
    res.json({
        encryptedConfig: encryptedConfig,
        configUrl: process.env.CONFIG_URL,
        authUrl: process.env.AUTH_URL,
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Config server running at http://localhost:${port}`);
    console.log(`Auth endpoint: http://localhost:${port}/api/auth`);
    console.log(`Config endpoint: http://localhost:${port}/api/config`);
});
