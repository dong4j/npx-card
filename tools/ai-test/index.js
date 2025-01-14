import OpenAI from "openai"; // We're using the v4 SDK
import { createHeaders } from "portkey-ai";

const openai = new OpenAI({
  apiKey: "11111", // defaults to process.env["OPENAI_API_KEY"],
  baseURL: "http://192.168.31.7:8787/v1",
  defaultHeaders: createHeaders({
    provider: "openai",
    customHost: "http://192.168.31.8:1234/v1",
  }),
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-4-turbo',
  });

  console.log(chatCompletion.choices);

  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: "Say this is a test" }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      process.stdout.write(content);
    }
  }
  console.log("\n");
}

main();
