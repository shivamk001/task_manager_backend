declare global{
    namespace Express {
        interface Request {
            session: any;
            currentUser: any;
        }
    }
}

import mongoose from "mongoose";

import app from "./app";
import { Env } from "./utils/env";
import logger from "./utils/logger";

let startServer = async () =>{

    // initialize env variables
    Env.init();

    // connect to mongodb server
    let mongoDBUrl=Env.get('MONGODB_URL');
    mongoose.connect(mongoDBUrl)
        .then(()=>{
            logger.info('MONGO DB CONNECTED');
            let port = Env.get('APP_PORT');
            app.listen(port, ()=>{
                logger.info(`APP RUNNING ON PORT: ${port}`);
            });
        });
}

startServer()
.then(()=>{
    logger.info('SERVER STARTED SUCCESSFULLY');
})
.catch((err)=>{
    logger.error('ERROR STARTING SERVER:', err);
})