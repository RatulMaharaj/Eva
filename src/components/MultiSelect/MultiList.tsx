import React, { useCallback, useState, Children } from 'react';
import useIndex from './utils/useIndex';
import useArray from './utils/useArray';
import useEventListener from './utils/useEventListener'
import {intRange} from './utils/intRange'
import { ListItem } from './ListItem';

// TODO: Handle SHIFT+Click
// TODO: Handle changes in underlying list

interface iMultiSelectListProps {
    children: React.ReactNodeArray,
    onFocusChange?: (newFocus: number) => any
    onSelectedChange?: (newSelection: number[]) => any
}

export default function MultiSelectList({ children, onFocusChange = x => x, onSelectedChange = x => x}: iMultiSelectListProps) {

    const noItems = children.length

    const [focusIndex, setFocusIndex, shiftFocusIndex] = useIndex(noItems,true,-1)
    const [selected, setSelected, sel] = useArray([])

    useCallback(() => onFocusChange(focusIndex),[focusIndex])()
    useCallback(() => onSelectedChange(selected),[selected])()

    useEventListener('keydown', onKeyDown)

    const kids = children.map((child,i) => <ListItem {...{child,i,selected, focusIndex, onClick}}/>)

    return (
        <React.Fragment>
            {kids}
        </React.Fragment>
    )

    function shiftFocusAndSelection(n: number, shiftKey: boolean = false, ctrlKey: boolean = false) {
        const newFocus = shiftFocusIndex(n)
        if (shiftKey) { sel.add(newFocus) }
        else if (ctrlKey) { /* don't change selection */ }
        else { setSelected([newFocus]) }
    }

    function onKeyDown(kEvent: KeyboardEvent) {
        const { key, shiftKey, ctrlKey } = kEvent;
        switch (key) {
            case "ArrowDown":
            // case "ArrowRight":
                shiftFocusAndSelection(1, shiftKey, ctrlKey);
                kEvent.preventDefault()
                break;
            case "ArrowUp":
            // case "ArrowLeft":
                shiftFocusAndSelection(-1, shiftKey, ctrlKey);
                kEvent.preventDefault()
                break;
            case " ":
                if (ctrlKey) {
                    sel.toggle(focusIndex)
                    kEvent.preventDefault()
                }
                break;
            default:
                break;
        }
    }

    function onClick(e: React.MouseEvent) {
        const index = e.target && e.currentTarget.getAttribute('data-index')
        if (index !== null) {
            const i = Number(index)
            setFocusIndex(i)

            if (e.shiftKey) {
                // TODO: NOT WORKING
                const range = intRange(focusIndex, i)
                alert(range)
            }
            if (e.ctrlKey) {
                sel.toggle(i)
            } else {
                setSelected([i])
            }
        }
    }
}