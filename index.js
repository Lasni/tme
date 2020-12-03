#!/usr/bin/env node

const Runner = require("./runner");
const runner = new Runner();
const currentDir = process.cwd();

const run = async () => {
  await runner.collectFiles(currentDir);
  runner.runTests();
};

run();
