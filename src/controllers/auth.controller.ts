import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/authService";
import { createErrorMessage, CustomError } from "../utils/error";
import { validationResult } from "express-validator";
import logger from "../utils/logger";

export class AuthController{
    public static async login(req: Request, res: Response, next: NextFunction){
        try{
            const error=validationResult(req);
            
            if(!error.isEmpty()){
                let errorMessage=createErrorMessage(error.array());
                throw new CustomError(400, errorMessage);
            }

            const { email, password } = req.body;

            let result = await AuthService.loginService(email, password);

            req.session={
                jwt: result.jwt
            }

            res.status(200).json(result);

        }catch(err){
            next(err);
        } 
    }

    public static async register(req: Request, res: Response, next: NextFunction){
        try{
            const error=validationResult(req);
            
            if(!error.isEmpty()){
                let errorMessage=createErrorMessage(error.array());
                throw new CustomError(400, errorMessage);
            }

            const { email, name, password }=req.body;

            logger.info(`New User Registration: ${email}, ${name}`);

            let newUser=await AuthService.registrationService(email, name, password);

            logger.info(`User Registration Successful: ${email}, ${name}`);

            res.status(201).json({
                    message: 'User registration successful',
                    ...newUser
                });

        }
        catch(err){
            next(err);
        }
    }

    public static async logout(req: Request, res: Response){
        req.session=null;
        res.send({});
    }
}