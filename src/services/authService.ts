import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { CustomError } from '../utils/error';
import { Password } from '../utils/password';
import { Env } from '../utils/env';

/**
 * Interface representing the user details returned on login.
 */
interface User{
    id: string;
    name: string;
    email: string;
}

/**
 * Service class providing authentication related operations like registration and login.
 */
export class AuthService{

    /**
   * Registers a new user with the given email, name, and password.
   * 
   * @param email - User email address
   * @param name - User full name
   * @param password - Plaintext password to be hashed
   * @returns Promise resolving to an object containing the registered user's name and email
   * @throws CustomError if user already exists
   */
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

    /**
   * Authenticates a user by email and password, and returns a JWT token on success.
   * 
   * @param email - User email address
   * @param password - Plaintext password
   * @returns Promise resolving to an object containing the JWT token and user info
   * @throws CustomError if user not found or password mismatch
   */
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
        }, secret, {expiresIn: '59m'});

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