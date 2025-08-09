import { ValidationError } from "express-validator";

export class CustomError extends Error{
    public status: number;
    constructor(status: number, message: string){
        super(message);
        this.status = status;
    }
}

// {type: string, value: string, msg: string, path: string, location: string}
export function createErrorMessage(errorArr: any[]){
    let errorMsg=errorArr.map(el=>el.path+': '+el.msg).join(' ,');
    return errorMsg;
}