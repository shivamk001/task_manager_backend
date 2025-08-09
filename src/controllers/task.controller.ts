import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/taskService";
import { validationResult } from "express-validator";
import { createErrorMessage, CustomError } from "../utils/error";

export class TaskController{
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