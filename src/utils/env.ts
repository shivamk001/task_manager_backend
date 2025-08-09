import dotenv from 'dotenv';
import path from 'path';
import logger from './logger';
import { CustomError } from './error';

export class Env{
    public static async init(){
        let envPath = process.env.ENV_PATH ?? path.join(__dirname, '../../env/prod.env')
        logger.info(`ENVPATH: ${envPath}`);

        const result = dotenv.config({ path: envPath });
        if (result.error) {
            logger.info('Failed to load .env file', result.error);
        } else {
            logger.info('Environment variables loaded successfully');
        }

    }

    public static get(key: string){
        if(process.env[key]){
            return process.env[key];
        }
        throw new CustomError(500, `Key not found, ${key}`);
    }
}