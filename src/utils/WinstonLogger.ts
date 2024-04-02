/**
 * This is a custom logger that we will be using for this project.
 * This will allow us to configure logging when we move to deployment and
 * integrate logging for Morgan when we set that up later on.
 * This also allows us to set different log levels for our project depending on production env or development env.
 * Current we are setting the default log level to info and using the cli format.
 * In the future we can set a directory for logs to be stored and set the format to JSON,
 */

import winston from "winston";
export const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    level: "debug",
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
});
