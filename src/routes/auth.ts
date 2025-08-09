import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { body } from 'express-validator';

const router = express.Router();

/**
 * Register a new user.
 * 
 * Endpoint: POST /auth/register
 * 
 * Validates the request body for:
 * - email: must be a valid email address
 * - password: must be supplied and trimmed
 * - name: must be supplied and trimmed
 * 
 * On success, calls AuthController.register to create the user.
 * 
 * @route POST /auth/register
 * @param {string} email.body.required - user's email
 * @param {string} password.body.required - user's password
 * @param {string} name.body.required - user's name
 */
router.post('/auth/register',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password'),
        body('name')
            .trim()
            .notEmpty()
            .withMessage('You must supply a name'),
    ],
    AuthController.register);

/**
 * Login a user.
 * 
 * Endpoint: POST /auth/login
 * 
 * Validates request body:
 * - email: must be a valid email address
 * - password: required and trimmed
 * 
 * Calls AuthController.login on successful validation.
 * 
 * @route POST /auth/login
 * @param {string} email.body.required - user's email
 * @param {string} password.body.required - user's password
 */
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

/**
 * Logout the currently authenticated user.
 * 
 * Endpoint: GET /auth/logout
 * 
 * Invalidates the user session or token.
 * 
 * @route GET /auth/logout
 */
router.get('/auth/logout', AuthController.logout);

/**
 * Express router containing authentication routes such as register, login, and logout.
 * 
 * This router handles all /auth/* endpoints.
 */
export default router;

