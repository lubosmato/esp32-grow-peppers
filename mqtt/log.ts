import loglevel from "loglevel";
import prefix from "loglevel-plugin-prefix";
import chalk from "chalk";

const colors: {
  [key: string]: chalk.Chalk
} = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
};

loglevel.enableAll()

prefix.reg(loglevel);
prefix.apply(loglevel, {
  format(level, name, timestamp) {
    return `${chalk.gray(`[${timestamp}]`)} | ${colors[level.toUpperCase()](level)} | ${chalk.green(`${name}`)} |`
  },
  timestampFormatter(date) {
    const pad = (n: number, length = 2) => n.toString().padStart(length, "0")
    const year = date.getFullYear()
    const month = pad(date.getMonth())
    const day = pad(date.getDay())
    const hour = pad(date.getHours())
    const minute = pad(date.getMinutes())
    const second = pad(date.getSeconds())
    const millisecond = pad(date.getMilliseconds(), 3)

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`
  },
})

export default function getLogger(loggerName: string): loglevel.Logger {
  const logger = loglevel.getLogger(loggerName)
  return logger
}
