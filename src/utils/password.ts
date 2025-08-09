import bcrypt from 'bcrypt';

/**
 * Utility class for password hashing and comparison.
 */
export class Password{
    private static saltRounds: number = 1;

    /**
   * Compares a plain text password with a hashed password.
   * @param enteredPassword - The plain text password to check.
   * @param hash - The hashed password to compare against.
   * @returns Promise resolving to true if passwords match, false otherwise.
   */
    public static async compare(enteredPassword: string, hash: string): Promise<boolean>{
        let result  = await bcrypt.compare(enteredPassword, hash);
        return result;
    }

    /**
   * Hashes a plain text password.
   * @param enteredPassword - The plain text password to hash.
   * @returns Promise resolving to the hashed password string.
   */
    public static async hash(enteredPassword: string){
        let salt = await bcrypt.genSalt(this.saltRounds);
        let hash = await bcrypt.hash(enteredPassword, salt);
        return hash;
    }
}