
// Serialize a Map into an array of key-value pairs
export function serializeMap(map: Map<any, any>) {
    return Array.from(map.entries());
}

// Deserialize an array of key-value pairs into a Map
export function deserializeMap(array: any[]): any {
    return new Map(array);
}