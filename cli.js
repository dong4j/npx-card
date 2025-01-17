#!/usr/bin/env node

// 重定向 stderr（标准错误流）到空设备，屏蔽所有错误或警告输出
const fs = require('fs');
const devNull = fs.openSync('/dev/null', 'w');
process.stderr.write = function () {};
process.stderr.fd = devNull;

// 告诉 npm 禁用引擎检查
process.env.npm_config_engine_strict = 'false';
// 禁用 Node.js 警告
process.env.NODE_NO_WARNINGS = '1';

// 覆盖 console.warn，屏蔽依赖包的警告
const originalWarn = console.warn;
console.warn = function (message) {
  if (!message.includes('EBADENGINE')) {
    originalWarn.apply(console, arguments);
  }
};

// 运行实际代码
require('./card.js');