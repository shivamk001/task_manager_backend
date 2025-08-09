import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/error";
import logger from "../utils/logger";

const errorHandlingMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction)=>{
    let status = err.status;
    let message = err.message;

    logger.error(message, status);

    res.status(status).send(message);
}

export default errorHandlingMiddleware;