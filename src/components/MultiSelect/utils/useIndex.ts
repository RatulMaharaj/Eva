import {useState} from 'react';

export default function useIndex(length: number, loop: boolean = true, initialValue: number = 0): [number, (n: number) => number, (n: number) => number] {

    const [value, setValue] = useState<number>(initialValue);

    function setIndex(n: number, shift: number = 0) {
        const newIndex = shiftIntBounded(n, shift, length, loop);
        setValue(newIndex);
        return newIndex;
    };

    function shiftIndex(n: number) {
        return setIndex(n,value)
    };

    return [value, setIndex, shiftIndex];

}

function shiftIntBounded(delta: number, current: number, length: number, loop: boolean = true) {
    if (loop) {
        return ((current + delta) % length + length) % length;
    }
    else {
        return Math.min(Math.max(0, current + delta), length - 1);
    }
}
