import mongoose, { Types } from "mongoose";
import { Task, TaskDoc } from "./task";
import { Password } from "../utils/password";

/**
 * Interface describing the properties required to create a new User.
 */
interface UserAttrs{
    email: string,
    password: string,
    name: string
}

/**
 * Interface describing the User Model static methods.
 */
interface UserModel extends mongoose.Model<UserDoc>{
    /**
   * Type-safe builder method for creating new User documents.
   * @param attrs - User attributes
   * @returns User document instance
   */
    build(attrs: UserAttrs): UserDoc
}

/**
 * Interface describing the properties of a User document.
 */
interface UserDoc extends mongoose.Document{
    name: string;
    email: string;
    password: string;
    tasks: TaskDoc[];
}

/**
 * Mongoose schema defining User document structure.
 */
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

/**
 * Static method to create new User documents with type checking.
 */
userSchema.statics.build=(attrs: UserAttrs)=>{
    return new User(attrs);
}

/**
 * Mongoose pre-save hook to hash password if modified.
 */
userSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        return next();
    }
    const hashed=await Password.hash(this.get('password'));
    this.set('password', hashed);
    next();
});

/**
 * The User model.
 */
const User=mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };