import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieSession from 'cookie-session';
import cors from 'cors';

import TaskRouter from './routes/task';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(bodyParser.json());

app.use(cookieSession({
    signed: false,
    secure: process.env['NODE_ENV']=='production',
    // domain: process.env.COOKIE_DOMAIN
}));

app.get('/uptime', (req: Request, res: Response)=>{
    res.send('Up and running');
});

app.all('/tasks', TaskRouter);

export default app; 
