export function intRange(a: number, b: number): number[] {
    /*
    Returns an an array of integers from a to b (inclusive)
    Goes forward (+1) if b > a and backward (-1) if a > b
    e.g. intRange(2,4) -> [2,3,4]
    e.g. intRange(8,5) -> [8,7,6,5]
    */
    const len = Math.abs(a - b) + 1;
    const delta = Math.sign(b - a);
    const result = Array(len).fill(0).map((unused, i) => Number(a + i * delta));
    return result;
}
