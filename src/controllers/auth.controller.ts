import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/authService";
import { createErrorMessage, CustomError } from "../utils/error";
import { validationResult } from "express-validator";
import logger from "../utils/logger";

export class AuthController{
    /**
   * Handles user login.
   * 
   * Validates request body for email and password.
   * Calls AuthService.loginService to authenticate the user.
   * Sets JWT token in the session on success.
   * 
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction for error handling
   * @returns JSON containing auth result including JWT token
   * @throws 400 Bad Request if validation fails
   * @throws 401 Unauthorized if login fails
   */
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

    /**
   * Handles new user registration.
   * 
   * Validates request body for email, name, and password.
   * Calls AuthService.registrationService to create a new user.
   * Logs registration attempts and success.
   * 
   * @param req - Express Request object
   * @param res - Express Response object
   * @param next - Express NextFunction for error handling
   * @returns JSON with confirmation message and new user info
   * @throws 400 Bad Request if validation fails
   */
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

    /**
   * Logs out the current user by clearing the session.
   * 
   * @param req - Express Request object
   * @param res - Express Response object
   * @returns Empty JSON object
   */
    public static async logout(req: Request, res: Response){
        req.session=null;
        res.send({});
    }
}