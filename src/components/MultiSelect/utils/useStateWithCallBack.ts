import {useState} from 'react';

export default function useStateWithCallBack<T>(initialState: T, afterSetState: ((t: T) => any)): [T, (t: T) => any] {
    const [state, setStateRaw] = useState(initialState)
    function setState(newState: T) {
        setStateRaw(newState)
        afterSetState(newState)
    }
    return [state, setState]
}