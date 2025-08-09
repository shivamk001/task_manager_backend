import mongoose from "mongoose";
import TaskStatus from "../utils/enums";

/**
 * Interface that describes a Task document in MongoDB.
 */
export interface TaskDoc extends mongoose.Document{
    id: string;
    subject: string;
    deadline: Date;
    status: string;
    userId: mongoose.Schema.Types.ObjectId;
    deleted: boolean;
    subtasks: {
        subject: string;
        deadline: Date;
        status: string;
        deleted: boolean;
    }[]
}

/**
 * Interface describing the Task Model static methods.
 */
export interface TaskModel extends mongoose.Model<TaskDoc>{
    build(attrs: TaskAttrs): TaskDoc;
}

/**
 * Attributes required to create a new Task.
 */
export interface TaskAttrs{
    subject: string;
    deadline: string;
    status: TaskStatus;
    userId: string
}

/**
 * Attributes for a SubTask.
 */
export interface SubTaskAttrs{
    subject: string;
    deadline: Date;
    status: TaskStatus;
    deleted: boolean;
}

/**
 * Mongoose schema for Task.
 */
const taskSchema=new mongoose.Schema<TaskDoc>({
    subject: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    status: {
        type: String,
        required: true,
        default: 'in-progress',
        enum: [TaskStatus.InProgress, TaskStatus.Pending, TaskStatus.Done]
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    },
    subtasks: [{
        subject: {
            type: String,
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'in-progress',
            enum: [TaskStatus.InProgress, TaskStatus.Pending, TaskStatus.Done]
        },
        deleted: {
            type: Boolean,
            default: false,
            required: true
        }
    }]
});

/**
 * Adds a static build method to Task model for type-safe creation.
 */
taskSchema.statics.build=(attrs: TaskAttrs)=>{
    return new Task(attrs);
}

/**
 * The Task model.
 */
const Task=mongoose.model<TaskDoc, TaskModel>('Task', taskSchema);

export {Task};