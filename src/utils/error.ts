/**
 * Custom error class extending the built-in Error.
 * Includes an HTTP status code.
 */
export class CustomError extends Error{
    public status: number;
    constructor(status: number, message: string){
        super(message);
        this.status = status;
    }
}

/**
   * Creates a new CustomError.
   * @param status - HTTP status code for the error.
   * @param message - Error message.
   */
export function createErrorMessage(errorArr: any[]){
    let errorMsg=errorArr.map(el=>el.path+': '+el.msg).join(' ,');
    return errorMsg;
}