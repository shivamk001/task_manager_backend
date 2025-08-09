import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cookieSession from 'cookie-session';

import AuthRouter from './routes/auth';
import TaskRouter from './routes/task';
import errorHandlingMiddleware from "./middlewares/errorHandler";
import { request } from "http";
import logger from "./utils/logger";

const app = express();


app.use(bodyParser.json());

app.use(cookieSession({
    signed: false,
    secure: process.env['NODE_ENV']=='production',
    // domain: process.env.COOKIE_DOMAIN
}));

app.use((req: Request, res: Response, next: NextFunction)=>{
    logger.info(`New Request: ${req.url}, ${req.method}`);
    next();
})

app.get('/uptime', (req: Request, res: Response)=>{
    res.send('Up and running');
});

// Auth router
app.use(AuthRouter);

// Tasks router
app.use('/tasks', TaskRouter);

// error handling middleware
app.use(errorHandlingMiddleware);

export default app; 
