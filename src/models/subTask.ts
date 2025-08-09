import mongoose from "mongoose";
import TaskStatus from "../utils/enums";

interface SubtaskDoc{
    subject: string;
    deadline: string;
    status: TaskStatus;
}

interface SubtaskModel extends mongoose.Model<SubtaskDoc>{
    build(attrs: SubtaskAttrs): void;
}

interface SubtaskAttrs{
    subject: string;
    deadline: string;
    status: TaskStatus;
}

const subtaskSchema=new mongoose.Schema({
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
    }
});

subtaskSchema.statics.build=(attrs: SubtaskAttrs)=>{
    return new Subtask(attrs);
}

let Subtask=mongoose.model<SubtaskDoc, SubtaskModel>('Subtask', subtaskSchema);

export { Subtask };