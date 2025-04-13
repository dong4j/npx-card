require('dotenv').config();

const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,  // 如果你使用自定义的 API 基地址
});

// 访问模型名
const model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'; // 如果没有指定环境变量，默认使用 'gpt-3.5-turbo'

// 示例使用
async function getResponse() {

  console.log("当前配置：");
  console.log("API_BASE:", process.env.OPENAI_API_BASE);
  console.log("MODEL:", process.env.OPENAI_MODEL);

  const response = await openai.chat.completions.create({
    model: model,
    messages: [{ role: 'user', content: 'Hello, how are you?' }],
  });

  console.log(response);
}

getResponse();