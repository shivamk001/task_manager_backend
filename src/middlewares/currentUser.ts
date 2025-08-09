import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { CustomError } from "../utils/error";
import { Env } from "../utils/env";

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