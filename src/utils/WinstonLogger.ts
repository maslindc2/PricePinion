/**
 * This is a custom logger that we will be using for this project.
 * This allows us to set different log levels for our project depending on production env or development env.
 * Currently we are setting the default log level to info and using the cli format.
 * In the future we can set a directory for logs to be stored and set the format to JSON.
 * Exporting as global scope allowing us to use this without creating an object each time.
 */
import winston from "winston";
import * as dotenv from "dotenv";
dotenv.config();
export const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: process.env.LOG_LEVEL || "error",
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
});
