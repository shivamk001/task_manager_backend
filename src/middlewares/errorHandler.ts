import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error";
import logger from "../utils/logger";

/**
 * Express error handling middleware.
 * 
 * Catches errors of type CustomError, logs the error message and status,
 * and sends the error message as a response with the corresponding HTTP status code.
 * 
 * @param err - The CustomError thrown in the app
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction callback (not used here but required for error middleware signature)
 */
const errorHandlingMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction)=>{
    let status = err.status;
    let message = err.message;

    logger.error(message, status);

    res.status(status).send(message);
}

export default errorHandlingMiddleware;