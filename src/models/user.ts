import mongoose, { Types } from "mongoose";
import { Task, TaskDoc } from "./task";

// an interface that describes the properties 
// required to create a new User
interface UserAttrs{
    email: string,
    password: string
}

// an interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc
}

// an interface that describes the properties
// that a user document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
    tasks: Types.DocumentArray<TaskDoc>;
}

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    tasks: [{
        type: mongoose.Schema.ObjectId,
        ref: Task
    }],
    password:{
        type: String,
        required: true
    }
})

userSchema.statics.build=(attrs: UserAttrs)=>{
    return new User(attrs);
}

const User=mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };