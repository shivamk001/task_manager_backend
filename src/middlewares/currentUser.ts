import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { CustomError } from "../utils/error";
import { Env } from "../utils/env";

/**
 * Middleware to authenticate the current user using JWT token stored in session.
 * 
 * Retrieves the JWT token from `req.session.jwt` and verifies it using the secret key.
 * If verification fails or token is missing, responds with 401 Unauthorized error.
 * On success, attaches the decoded user payload to `req.currentUser` and proceeds.
 * 
 * @param req - Express Request object, expects `session.jwt` to be present.
 * @param res - Express Response object, used to send 401 if unauthorized.
 * @param next - Express NextFunction callback to continue middleware chain.
 */
const currentUser = (req: Request, res: Response, next: NextFunction) =>{
    let secret=Env.get('JWT_KEY');
    
    let {jwt: jwtToken} = req.session;

    if(!jwtToken){
        let err = new CustomError(401, 'Unauthorized User');
        next(err);
    }
    jwt.verify(jwtToken, secret, (err: any, user: any)=>{
        if(err){
            return res.status(401).send('Unauthorized User');
        }
            req.currentUser=user;
            next();
        }
    )
}

export default currentUser;