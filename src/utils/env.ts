import dotenv from 'dotenv';
import path from 'path';
import logger from './logger';
import { CustomError } from './error';

/**
 * Utility class for environment variable management.
 */
export class Env{
    /**
   * Loads environment variables from a .env file.
   * Uses `ENV_PATH` env variable or defaults to `../../env/prod.env`.
   * Logs success or failure.
   */
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

    /**
   * Retrieves the value of an environment variable by key.
   * Throws a CustomError if the key is not found.
   * 
   * @param key - The environment variable key
   * @returns The value of the environment variable
   * @throws CustomError if the environment variable is not defined
   */
    public static get(key: string){
        if(process.env[key]){
            return process.env[key];
        }
        throw new CustomError(500, `Key not found, ${key}`);
    }
}