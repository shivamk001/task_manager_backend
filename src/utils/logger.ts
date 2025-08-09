import winston from "winston";

/**
 * Winston logger configuration.
 * Defines custom log levels and outputs to console in simple format.
 */
const logger = winston.createLogger({
    levels: {
        error: 0,
        info: 2
    },
    transports: [new winston.transports.Console()],
    format: winston.format.simple()
});

export default logger;