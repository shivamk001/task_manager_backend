import mongoose from "mongoose";
import { Subtask } from "./subTask";
import TaskStatus from "../utils/enums";

interface TaskDoc{
    subject: string;
    deadline: string;
    status: TaskStatus;
}

interface TaskModel extends mongoose.Model<TaskDoc>{
    build(attrs: TaskAttrs): void;
}

interface TaskAttrs{
    subject: string;
    deadline: string;
    status: TaskStatus;
}

const taskSchema=new mongoose.Schema({
    subject: {
        type: String,
        require: true
    },
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
    },
    subtasks: [{type: mongoose.Schema.ObjectId, ref: Subtask}]
});

taskSchema.statics.build=(attrs: TaskAttrs)=>{
    return new Task(attrs);
}

const Task=mongoose.model<TaskDoc, TaskModel>('Task', taskSchema);

export {Task};