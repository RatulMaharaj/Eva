import React from 'react';
interface iListItemProps {
    child: React.ReactNode;
    i: number;
    selected: number[];
    focusIndex: number;
    onClick?: (e: React.MouseEvent) => any;
    focusClassName?: string;
    selectedClassName?: string;
}
export function ListItem({ child, i, selected, focusIndex, onClick = x => x, focusClassName = "focused", selectedClassName = "selected" }: iListItemProps) {
    const isSelected = (selected.includes(i));
    const isFocused = (i === focusIndex);
    const showFocus = isFocused && ((selected.length > 1) || !isSelected);
    const labelClassName = [
        showFocus ? focusClassName : '',
        isSelected ? selectedClassName : '',
    ].join(' ');
    return (<div className={labelClassName}>
        <input type="radio" id={`radio-entry-${i}`} style={{ 'display': 'none' }} checked={isFocused} autoFocus={isFocused} data-index={i} onClick={onClick} />
        <input type="checkbox" id={`checkbox-entry-${i}`} style={{ 'display': 'none' }} checked={isSelected} data-index={i} />
        <label htmlFor={`radio-entry-${i}`}>
            {child}
        </label>
    </div>);
}
;
