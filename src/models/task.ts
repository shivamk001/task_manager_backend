import mongoose from "mongoose";
import TaskStatus from "../utils/enums";

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

export interface TaskModel extends mongoose.Model<TaskDoc>{
    build(attrs: TaskAttrs): TaskDoc;
}

export interface TaskAttrs{
    subject: string;
    deadline: string;
    status: TaskStatus;
    userId: string
}

export interface SubTaskAttrs{
    subject: string;
    deadline: Date;
    status: TaskStatus;
    deleted: boolean;
}

const taskSchema=new mongoose.Schema<TaskDoc>({
    subject: {
        type: String,
        require: true
    },
    deadline: {
        type: Date,
        require: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    status: {
        type: String,
        require: true,
        default: 'in-progress',
        enum: [TaskStatus.InProgress, TaskStatus.Pending, TaskStatus.Done]
    },
    deleted: {
        type: Boolean,
        default: false,
        require: true
    },
    // userId: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: User
    // },
    subtasks: [{
        subject: String,
        deadline: {
            type: Date,
            require: true
        },
        status: {
            type: String,
            require: true,
            default: 'in-progress',
            enum: [TaskStatus.InProgress, TaskStatus.Pending, TaskStatus.Done]
        },
        deleted: {
            type: Boolean,
            default: false,
            require: true
        }
    }]
});

taskSchema.statics.build=(attrs: TaskAttrs)=>{
    return new Task(attrs);
}

const Task=mongoose.model<TaskDoc, TaskModel>('Task', taskSchema);

export {Task};