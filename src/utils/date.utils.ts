
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


/**
 * @param timestamp: string in the format "2023-09-06T01:37:12.375Z"
 * @returns date string in the format "MM/DD/YY"
 */
export const convertTimestampToDate = (timestamp: string): string => {
    let date = new Date(timestamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear().toString().slice(2);
    return `${month}/${day}/${year}`;
}
