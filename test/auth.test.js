require("dotenv").config();
const fetch = require("node-fetch");

// 配置服务器地址
const BASE_URL =
  process.env.AUTH_URL.replace("/api/auth", "") || "http://localhost:" + process.env.CONFIG_SERVER_PORT;

// 测试认证和配置获取流程
async function testAuthAndConfig() {
  try {
    console.log("开始测试认证流程...");

    // 1. 测试认证接口
    console.log("\n1. 测试获取 token...");
    const authResponse = await fetch(`${BASE_URL}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!authResponse.ok) {
      throw new Error(
        `认证失败: ${authResponse.status} ${authResponse.statusText}`
      );
    }

    const { token, expiresIn } = await authResponse.json();
    console.log("✅ 成功获取 token:", token);
    console.log("Token 有效期:", expiresIn / 1000, "秒");

    // 2. 测试无 token 访问配置
    console.log("\n2. 测试无 token 访问配置...");
    const unauthorizedResponse = await fetch(`${BASE_URL}/api/config`);
    console.log("状态码:", unauthorizedResponse.status);
    if (unauthorizedResponse.status === 401) {
      console.log("✅ 无 token 访问被正确拒绝");
    } else {
      console.log("❌ 无 token 访问未被正确处理");
    }

    // 3. 测试使用 token 获取配置
    console.log("\n3. 测试使用 token 获取配置...");
    const configResponse = await fetch(`${BASE_URL}/api/config`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!configResponse.ok) {
      throw new Error(
        `获取配置失败: ${configResponse.status} ${configResponse.statusText}`
      );
    }

    const config = await configResponse.json();
    console.log("✅ 成功获取配置:", config);

    // 4. 等待 token 过期后测试
    console.log("\n4. 等待 token 过期测试...");
    console.log(`等待 ${expiresIn / 1000} 秒后继续测试...`);
    await new Promise((resolve) => setTimeout(resolve, expiresIn + 1000)); // token有效期 + 1秒

    const expiredResponse = await fetch(`${BASE_URL}/api/config`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (expiredResponse.status === 401) {
      console.log("✅ token 过期测试通过");
    } else {
      console.log("❌ token 过期未被正确处理");
    }

    console.log("\n测试完成！");
  } catch (error) {
    console.error("测试过程中发生错误:", error);
  }
}

// 运行测试
console.log("启动认证流程测试...");
testAuthAndConfig();
