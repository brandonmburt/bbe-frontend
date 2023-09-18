

/**
 * Calculates the range of an array of numbers
 * @param picks: Array of pick numbers
 * @param currAdp: Current ADP of player being evaluated
 * @returns [minValue, maxValue]
 */
export const calcuateScatterRange = (picks: number[], currAdp: number): [number, number] => {
    let min = Math.floor(Math.min(...picks, currAdp)), max = Math.ceil(Math.max(...picks, currAdp));
    let range = max - min, buffers = [0.1, 0.05];
    // Try a 10% range buffer, then 5%, else keep the range
    for (let i = 0; i < buffers.length; i++) {
        let buffer = Math.floor(range * buffers[i]);
        if (min - buffer > 0 && max + buffer < 217) {
            min -= buffer;
            max += buffer;
            break;
        }
    }
    return [min, max];
}

/**
 * Calculates the line of best fit for a scatter plot
 * @param arr: Array of scatter data points
 * @returns Array of points for the line of best fit
 */
export const calculateLineOfBestFit = (arr: any[]): any[] => {
    const n = arr.length;
    let sumX = 0;
    let sumY = 0;
    arr.forEach(point => {
      sumX += point.x;
      sumY += point.y;
    });
    const meanX = sumX / n;
    const meanY = sumY / n;
    
    // Step 2: Calculate slope (m)
    let numerator = 0;
    let denominator = 0;
    arr.forEach(point => {
      numerator += (point.x - meanX) * (point.y - meanY);
      denominator += (point.x - meanX) ** 2;
    });
    const slope = numerator / denominator;
    
    // Step 3: Calculate y-intercept (b)
    const yIntercept = meanY - slope * meanX;
    const minX = Math.min(...arr.map(e => e.x));
    const maxX = Math.max(...arr.map(e => e.x));
    return ([[minX, slope * minX + yIntercept], [maxX, slope * maxX + yIntercept]].map(([x, y]) => {
        return {x, y};
    }));
}