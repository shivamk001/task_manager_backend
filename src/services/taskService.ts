import { Task, TaskDoc, TaskAttrs, SubTaskAttrs } from "../models/task";
import { User } from "../models/user";
import TaskStatus from "../utils/enums";
import { CustomError } from "../utils/error";

export class TaskService{
    public static async getAllTasks(userId: string){
        let tasks=await User.findById({id: userId}).populate('tasks');

        return tasks;
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
        const user = await User.findById(userId);

        if(!user){
            throw new CustomError(401, 'User not found');
        }

        // get the task
        const task = user.tasks.id(taskId);
        if (!task) throw new Error("Task not found");

        Object.assign(task, updatedTask);
        await user.save();

        return task;
    }    
    
    public static async deleteTask(userId: string, taskId: string){
        // get the user
        const user = await User.findById(userId);

        if(!user){
            throw new CustomError(401, 'User not found');
        }

        // get the task
        const task = user.tasks.id(taskId);
        if (!task) throw new Error("Task not found");

        // mark task as deleted
        Object.assign(task, {deleted: true});
        await user.save();

        return true; 
    }    
    
    public static async allSubTasks(taskId: string){
        // get all subtasks which are not deleted
        let tasks: any=await Task
                        .find({taskId: taskId})
                        .populate('subtasks')
                        .lean();

        return tasks.subtasks;
    }    
    
    public static async updateSubTask(taskId: string, updatedSubtasks: SubTaskAttrs[]){
        // get all subtasks which are not deleted
        let tasks=await Task
                        .findById({id: taskId})
                        .populate('subtasks') as TaskDoc;

        // seperate the deleted subtasks
        let deletedSubtasks=tasks.subtasks.filter(sub=>sub.deleted);

        // update the subtasks array
        tasks.subtasks=[
            ...updatedSubtasks,
            ...deletedSubtasks
        ];

        await tasks.save();

        return tasks.subtasks;
    }


}