// Convert Unix epoch time (in milliseconds) to a Date object
export const fromUnixTime = (unixTime: number): Date => {
    return new Date(unixTime);
}
  
// Convert a Date object to Unix epoch time (in milliseconds)
export const toUnixTime = (date: Date): number => {
    return date.getTime();
};