import env from "./env";
import moment from "moment";
import winston from "winston";

const isDev = env.appEnv === "development";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});
const loggerOptions: winston.LoggerOptions = {
  level: isDev ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.splat(),
    winston.format.metadata(),
    winston.format.timestamp({
      format: () => moment().format("LLL"),
    }),
    winston.format.json(),
    winston.format.simple(),
    isDev
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message}`;
    }),
  ),
};

const logger = winston.createLogger({
  ...loggerOptions,
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
    new winston.transports.File({ filename: "./logs/info.log" }),
  ],
});

export default logger;
