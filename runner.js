const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const render = require("./render");

const excludedDirs = ["node_modules"];

class Runner {
  constructor() {
    this.testFiles = [];
  }

  async runTests() {
    for (let file of this.testFiles) {
      console.log(chalk.gray(`---- ${file.shortName}`));

      global.render = render;

      // populating array with beforeEach functions
      const beforeEaches = [];
      global.beforeEach = (fn) => {
        beforeEaches.push(fn);
      };

      global.it = async (desc, fn) => {
        // executing every beforeEach function before calling it's callback fn function
        beforeEaches.forEach((func) => func());
        try {
          await fn();
          console.log(chalk.green(`\tOK - ${desc}`));
        } catch (err) {
          const message = err.message.replace(/\n/g, "\n\t");
          console.log(chalk.red(`\tERROR - ${desc}`));
          console.log(chalk.red("\t", message));
        }
      };

      try {
        require(file.name);
      } catch (err) {
        console.log(chalk.yellow(err));
      }
    }
  }

  async collectFiles(targetPath) {
    const files = await fs.promises.readdir(targetPath);

    for (let file of files) {
      const filePath = path.join(targetPath, file);
      const stats = await fs.promises.lstat(filePath);

      if (stats.isFile() && file.includes(".test.js")) {
        this.testFiles.push({ name: filePath, shortName: file });
      } else if (stats.isDirectory() && !excludedDirs.includes(file)) {
        const childFiles = await fs.promises.readdir(filePath);
        files.push(...childFiles.map((f) => path.join(file, f)));
      }
    }
  }
}

module.exports = Runner;
