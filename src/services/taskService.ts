import mongoose from "mongoose";
import { Task, TaskDoc, TaskAttrs, SubTaskAttrs } from "../models/task";
import { User } from "../models/user";
import TaskStatus from "../utils/enums";
import { CustomError } from "../utils/error";

/**
 * Service class to handle Task related operations such as create, update, delete, and fetch.
 */
export class TaskService{

    /**
   * Fetch all non-deleted tasks for a given user.
   * Filters out deleted subtasks as well.
   * 
   * @param userId - The ID of the user
   * @returns Array of tasks with filtered subtasks
   */
    public static async getAllTasks(userId: string){
        let doc=await User.findById(userId)
            // .select('tasks')
            .populate({
                path: 'tasks',
                match: { deleted: false }
            })
            .lean();
        
        // filter all subtasks
        let tasks=doc?.tasks.map(task=>{
            task.subtasks=task.subtasks.filter(subtask=>!subtask.deleted)
            return task;
        })

        return tasks || [];
    }    
    
    /**
   * Creates a new task for the given user.
   * 
   * @param userId - ID of the user creating the task
   * @param subject - Subject/title of the task
   * @param lastDate - Deadline date string for the task
   * @param status - Status of the task (in-progress, done, pending)
   * @returns The created task document
   * @throws Error if user does not exist
   */
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
    
    /**
   * Updates an existing task for a user by task ID.
   * 
   * @param userId - The ID of the user
   * @param taskId - The ID of the task to update
   * @param updatedTask - Updated task attributes
   * @returns The updated task document
   * @throws CustomError if user or task is not found
   */
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
    
    /**
   * Marks a task as deleted (soft delete).
   * 
   * @param userId - ID of the user
   * @param taskId - ID of the task to delete
   * @returns Success message and task ID
   * @throws CustomError if task does not exist
   */
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

    /**
   * Fetch all non-deleted subtasks for a given task.
   * 
   * @param taskId - ID of the task
   * @returns Array of subtasks
   * @throws CustomError if task does not exist
   */
    public static async allSubTasks(taskId: string){
        // get all subtasks which are not deleted
        let task=await Task
                        .findById(taskId)
                        // .populate('subtasks')
                        .lean();

        if(!task){
            throw new CustomError(404, 'Task does not exist');
        }

        // remove all deleted tasks 
        let subtasks=task.subtasks.filter(task=>!task.deleted);

        return subtasks;
    }    
    
    /**
   * Updates subtasks for a given task, keeping previously deleted subtasks intact.
   * 
   * @param taskId - ID of the task
   * @param updatedSubtasks - Array of new/updated subtasks (non-deleted)
   * @returns Updated array of subtasks (excluding deleted ones)
   * @throws CustomError if task does not exist
   */
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

        // save the task with updated subtasks
        await task.save();

        // remove all deleted tasks 
        let subtasks=task.subtasks.filter(task=>!task.deleted);

        return subtasks;
    }
}