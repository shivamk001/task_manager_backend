import bcrypt from 'bcrypt';

export class Password{
    private static saltRounds: number = 1;

    public static async compare(enteredPassword: string, hash: string): Promise<boolean>{
        let result  = await bcrypt.compare(enteredPassword, hash);
        return result;
    }

    public static async hash(enteredPassword: string){
        let salt = await bcrypt.genSalt(this.saltRounds);
        let hash = await bcrypt.hash(enteredPassword, salt);
        return hash;
    }
}