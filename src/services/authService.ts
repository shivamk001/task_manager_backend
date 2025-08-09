import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { CustomError } from '../utils/error';
import { Password } from '../utils/password';
import { Env } from '../utils/env';

interface User{
    id: string;
    name: string;
    email: string;
}

export class AuthService{

    public static async registrationService(email: string, name: string, password: string): Promise<{name: string, email: string}>{
        // get the user
        let existingUser=await User.findOne({email: email});

        // if user exists
        if(existingUser){
            throw new CustomError(404, 'User already exists');
        }

        let newUser=User.build({
            name,
            email,
            password
        });

        await newUser.save();

        return {
            name: newUser.name,
            email: newUser.email
        };
    }

    public static async loginService(email: string, password: string): Promise<{jwt: string, user: User}>{
        // get the user
        let existingUser=await User.findOne({email: email});

        // if not user exists
        if(!existingUser){
            throw new CustomError(404, 'User not found');
        }

        // if user exists
        let passwordMatch=await Password.compare(password, existingUser.password);

        if(!passwordMatch){
            throw new CustomError(403, 'Incorrect Username or password');
        }
        
        //generate jwt
        let secret=Env.get('JWT_KEY');
        const userJWT=jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
            userName: existingUser.name
        }, secret, {expiresIn: '15m'});

        return {
            jwt: userJWT,
            user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    name: existingUser.name
            }
        }
        
    }
}