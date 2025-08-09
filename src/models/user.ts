import mongoose, { Types } from "mongoose";
import { Task, TaskDoc } from "./task";
import { Password } from "../utils/password";

// an interface that describes the properties 
// required to create a new User
interface UserAttrs{
    email: string,
    password: string,
    name: string
}

// an interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc
}

// an interface that describes the properties
// that a user document has
interface UserDoc extends mongoose.Document{
    name: string;
    email: string;
    password: string;
    tasks: TaskDoc[];
}

const userSchema=new mongoose.Schema<UserDoc>({
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

userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        return next();
    }
    const hashed=await Password.hash(this.get('password'));
    this.set('password', hashed);
    next();
})

const User=mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };