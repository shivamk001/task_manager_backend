import winston from "winston";

const logger = winston.createLogger({
    levels: {
        error: 0,
        info: 2
    },
    transports: [new winston.transports.Console()],
    format: winston.format.simple()
});

export default logger;