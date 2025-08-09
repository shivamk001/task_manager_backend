import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { validationResult } from "express-validator";
import { createErrorMessage, CustomError } from "../utils/error";

export class TaskController{
    /**
   * Get all tasks for the currently authenticated user.
   * 
   * @param req - Express Request object; expects `currentUser.id` to identify user.
   * @param res - Express Response object, sends array of tasks.
   * @param next - Express NextFunction for error handling.
   * @returns 200 with JSON array of tasks.
   */
    public static async allTasks(req: Request, res: Response, next: NextFunction){
        try{
            let {id}=req.currentUser;
            let tasks=await TaskService.getAllTasks(id);

            res.status(200).json(tasks);
        }
        catch(err){
            next(err);
        }
    }

    /**
   * Create a new task for the authenticated user.
   * 
   * Validates request body for subject, lastDate, and status.
   * 
   * @param req - Express Request object; expects `currentUser.id` and body params.
   * @param res - Express Response object, sends created task JSON.
   * @param next - Express NextFunction for error handling.
   * @throws 400 if validation fails.
   * @returns 201 with JSON of newly created task.
   */
    public static async createTask(req: Request, res: Response, next: NextFunction){
        try{
            const error=validationResult(req);
            
            if(!error.isEmpty()){
                let errorMessage=createErrorMessage(error.array());
                throw new CustomError(400, errorMessage);
            }

            let {id}=req.currentUser;
            let {subject, lastDate, status}=req.body;
            let newTask=await TaskService.createTask(id, subject, lastDate, status);

            res.status(201).json(newTask);
        }
        catch(err){
            next(err);
        }
    }    
    
    /**
   * Update an existing task by its ID for the authenticated user.
   * 
   * Validates request body and parameters.
   * 
   * @param req - Express Request object; expects `currentUser.id`, `taskId` param, and body params.
   * @param res - Express Response object, sends updated task JSON.
   * @param next - Express NextFunction for error handling.
   * @throws 400 if validation fails.
   * @returns 200 with JSON of updated task.
   */
    public static async updateTask(req: Request, res: Response, next: NextFunction){
        try{
            const error=validationResult(req);
            
            if(!error.isEmpty()){
                let errorMessage=createErrorMessage(error.array());
                throw new CustomError(400, errorMessage);
            }

            let {id}=req.currentUser;
            let {taskId}=req.params;
            let {subject, lastDate, status}=req.body;

            let updatedTask=await TaskService.updateTask(id, taskId, {subject: subject, deadline: lastDate, status, userId: id});

            res.status(200).json(updatedTask);
        }
        catch(err){
            next(err);
        }
    }

    /**
   * Delete a task by its ID for the authenticated user.
   * 
   * @param req - Express Request object; expects `currentUser.id` and `taskId` param.
   * @param res - Express Response object, sends 204 No Content on success.
   * @param next - Express NextFunction for error handling.
   * @returns 204 No Content on successful deletion.
   */
    public static async deleteTask(req: Request, res: Response, next: NextFunction){
        try{
            let {id}=req.currentUser;
            let {taskId}=req.params;
            
            let result=await TaskService.deleteTask(id, taskId);

            res.status(204).end();
        }
        catch(err){
            next(err);
        }
    }

    /**
   * Get all subtasks for a specific task.
   * 
   * @param req - Express Request object; expects `taskId` param.
   * @param res - Express Response object, sends array of subtasks.
   * @param next - Express NextFunction for error handling.
   * @returns 200 with JSON array of subtasks.
   */
    public static async allSubTasks(req: Request, res: Response, next: NextFunction){
        try{
            let {taskId}=req.params;

            let subTasks=await TaskService.allSubTasks(taskId);

            res.status(200).json(subTasks);
        }
        catch(err){
            next(err);
        }
    }   
    
    /**
   * Update the list of subtasks for a specific task.
   * 
   * Expects full list of subtasks in the request body.
   * 
   * @param req - Express Request object; expects `taskId` param and `tasks` array in body.
   * @param res - Express Response object, sends updated list of subtasks.
   * @param next - Express NextFunction for error handling.
   * @returns 200 with JSON array of updated subtasks.
   */
    public static async updateSubTask(req: Request, res: Response, next: NextFunction){
        try{
            let {taskId}=req.params;
            let {tasks}=req.body;

            let updatedTasks=await TaskService.updateSubTask(taskId, tasks);

            res.status(200).json(updatedTasks);
        }
        catch(err){
            next(err);
        }
    }
}