import { useState, SetStateAction, Dispatch } from 'react';

export default function useArray(initial: number[] = []): [number[], Dispatch<SetStateAction<number[]>>, any] {
    const [array, setArray] = useState<number[]>(initial);
    const add = (n: number) => !array.includes(n) ? setArray([...array, n]) : null;
    const remove = (n: number) => setArray(array.filter(x => x !== n));
    const toggle = (n: number) => array.includes(n) ? remove(n) : add(n);
    const get = () => array;
    return [
        array,
        setArray,
        { set: setArray, add, remove, toggle, get },
    ];
};
