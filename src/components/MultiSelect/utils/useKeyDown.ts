import { useEffect } from 'react';

export default function useKeyDown(eventHandler: (e: KeyboardEvent) => void) {
    useEffect(() => {
        onMount();
        return (onUnmount);
    }, []);
    function onMount() { document.body.addEventListener('keydown', eventHandler); }
    ;
    function onUnmount() { document.body.removeEventListener('keydown', eventHandler); }
    ;
};