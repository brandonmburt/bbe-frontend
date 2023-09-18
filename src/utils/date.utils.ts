
/**
 * Accepts a date string in the format "M/D" and returns a numberical date
 * @param date: string in the format "M/D"
 * @returns numberical date
 */
export const getNumbericalDate = (date: string): number => {
    const [month, day] = date.split('/').map((str) => parseInt(str, 10)); // parse month and day as integers
    const year = new Date().getFullYear(); // Assuming current year for simplicity
    const dateObj = new Date(year, month - 1, day); // Create a Date object with the parsed values
    return dateObj.getTime(); // Get the numerical value (timestamp) of the date
}
