import mongoose from "mongoose";
import { Task, TaskDoc, TaskAttrs, SubTaskAttrs } from "../models/task";
import { User } from "../models/user";
import TaskStatus from "../utils/enums";
import { CustomError } from "../utils/error";

export class TaskService{
    public static async getAllTasks(userId: string){
        let doc=await User.findById(userId)
            .select('tasks')
            .populate('tasks')
            .lean();

        return doc!.tasks || [];
    }    
    
    public static async createTask(userId: string, subject: string, lastDate: string, status: TaskStatus){
        // get the user
        let user=await User.findById(userId);

        if(!user){
            throw new Error('User is not defined');
        }

        // create the task
        let task=Task.build({
            subject: subject,
            deadline: lastDate,
            status,
            userId: user!._id as string
        });
        await task.save();

        // store the task in user
        user.tasks.push(task);

        // save the user
        user.save();
        
        return task;
    }    
    
    public static async updateTask(userId: string, taskId: string, updatedTask: TaskAttrs){
        // get the user
        const user = await User.findById(userId)
                                .populate('tasks');
;
        console.log('user', user);
        if(!user){
            throw new CustomError(401, 'User not found');
        }

        const task = user.tasks.find(
            t => String(t._id) === taskId
        );

        if (!task) {
            throw new Error("Task not found");
        }

        // apply updates to the populated task
        Object.assign(task, updatedTask);

        // save the task directly since it's a separate model
        await task.save();

        return task;
    }    
    
    public static async deleteTask(userId: string, taskId: string){

        // get the task with given userId and taskId
        let task=await Task.findOne({
            _id: new mongoose.Types.ObjectId(taskId),
            userId: userId
        });

        if(!task){
            throw new CustomError(404, 'Task does not exist');
        }

        // mark task as deleted
        task.deleted=true;

        // save the task
        await task.save();

        return {message: 'Task deleted succesfully', id: task.id};
    }    
    
    public static async allSubTasks(taskId: string){
        // get all subtasks which are not deleted
        let task=await Task
                        .findById(taskId)
                        .populate('subtasks')
                        .lean();

        if(!task){
            throw new CustomError(404, 'Task does not exist');
        }

        return task.subtasks;
    }    
    
    public static async updateSubTask(taskId: string, updatedSubtasks: SubTaskAttrs[]){
        // get all subtasks which are not deleted
        let task=await Task
                        .findById(taskId)
                        .populate('subtasks') as TaskDoc;
        
        if(!task){
            throw new CustomError(404, 'Task does not exist');
        }

        // seperate the deleted subtasks
        let deletedSubtasks=task.subtasks.filter(sub=>sub.deleted);

        // update the subtasks array
        task.subtasks=[
            ...updatedSubtasks,
            ...deletedSubtasks
        ];

        await task.save();

        return task.subtasks;
    }


}