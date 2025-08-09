import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieSession from 'cookie-session';

import AuthRouter from './routes/auth';
import TaskRouter from './routes/task';
import errorHandlingMiddleware from "./middlewares/errorHandler";

const app = express();


app.use(bodyParser.json());

app.use(cookieSession({
    signed: false,
    secure: process.env['NODE_ENV']=='production',
    // domain: process.env.COOKIE_DOMAIN
}));

app.get('/uptime', (req: Request, res: Response)=>{
    res.send('Up and running');
});

// Auth router
app.use(AuthRouter);

// Tasks router
app.all('/tasks', TaskRouter);

// error handling middleware
app.use(errorHandlingMiddleware);

export default app; 
