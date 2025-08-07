import { NextFunction, Request, Response } from "express";

import { AuthService } from "../services/authService";
import { CustomError } from "../utils/error";
import { validationResult } from "express-validator";

export class AuthController{
    public static async login(req: Request, res: Response, next: NextFunction){
        try{
            const error=validationResult(req);

            if(!error.isEmpty()){
                throw new CustomError(400, error.array().join(' '));
            }

            const { email, name, password } = req.body;

            let result = await AuthService.loginService(email, password);

        }catch(err){
            next(err);
        } 
    }

    public static async register(req: Request, res: Response, next: NextFunction){
        try{
            const error=validationResult(req);
            console.log('Profile:', req.body);

            if(!error.isEmpty()){
                throw new CustomError(400, error.array().join(' '));
            }

            const { email, name, password }=req.body;

            let result = await AuthService.registrationService(email, name, password);

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