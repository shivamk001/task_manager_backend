import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { body, query } from 'express-validator';

const router = express.Router();

// register user
router.post('/auth/register',
        [
            body('email')
                .isEmail()
                .withMessage('EMail must be valid'),
            body('password')
                .trim()
                .notEmpty()
                .withMessage('You must supply a password'),
            body('name')
                .trim()
                .notEmpty()
                .withMessage('You must supply a name')
        ],
        AuthController.register);

// login user
router.post('/auth/login', 
        [
        body('email')
            .isEmail()
            .withMessage('EMail must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    AuthController.login);

// to logout user
router.get('/auth/logout', AuthController.logout);

export default router;

