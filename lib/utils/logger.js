const chalk = require('chalk');

class Logger {
    static info(message) {
        console.log(chalk.gray(message));
    }

    static success(message) {
        console.log(chalk.green(`✓ ${message}`));
    }

    static error(message) {
        console.log(chalk.red(`Error: ${message}`));
    }

    static warning(message) {
        console.log(chalk.yellow(message));
    }

    static highlight(message) {
        console.log(chalk.cyan.bold(message));
    }
}

module.exports = Logger;
