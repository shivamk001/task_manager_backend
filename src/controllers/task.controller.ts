import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/taskService";

export class TaskController{
    public static async allTasks(req: Request, res: Response, next: NextFunction){
        try{
            let {userId}=req.currentUser;
            let tasks=await TaskService.getAllTasks(userId);

            res.status(200).json(tasks);
        }
        catch(err){
            next(err);
        }
    }

    public static async createTask(req: Request, res: Response, next: NextFunction){
        try{
            let {userId}=req.currentUser;
            let {subject, lastDate, status}=req.body;
            let newTask=await TaskService.createTask(userId, subject, lastDate, status);

            res.status(201).json(newTask);
        }
        catch(err){
            next(err);
        }
    }    
    
    public static async updateTask(req: Request, res: Response, next: NextFunction){
        try{
            let {userId}=req.currentUser;
            let {taskId}=req.params;
            let {subject, lastDate, status}=req.body

            let updatedTask=await TaskService.updateTask(userId, taskId, {subject: subject, deadline: lastDate, status, userId});

            res.status(200).json(updatedTask);
        }
        catch(err){
            next(err);
        }
    }

    public static async deleteTask(req: Request, res: Response, next: NextFunction){
        try{
            let {userId}=req.currentUser;
            let {taskId}=req.params;
            
            await TaskService.deleteTask(userId, taskId);

            res.status(204);
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