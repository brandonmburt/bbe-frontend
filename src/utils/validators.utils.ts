

/**
 * Determines if the given value is a valid email address
 * @param email: potential email address
 * @returns boolean representing whether the given value is a valid email address
 */
export const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 *  Determines if the given value is a valid password
 * @param password: potential password
 * @returns boolean representing whether the given value is a valid password
 *  
 * Password must contain: 
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 * - No whitespace
 * 
 */
export const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
}