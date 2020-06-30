import React, { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faCog, faFile } from '@fortawesome/free-solid-svg-icons';
import { faClone, faFolderOpen } from '@fortawesome/free-regular-svg-icons';
import { isToday, isThisMonth, isThisYear, format as formatDate } from 'date-fns'
import useClipboard from "react-use-clipboard";
import filesize from "filesize"

import getIcon from "../icon.js"

import './ResultItem.css'
import useEventListener from "../MultiSelect/utils/useEventListener.js";

const openExternal = path => fetch(`/api/open?path=${path}`)

const fmt = d => {
    let format = ''
    if (isToday(d)) {
        format = 'HH:mm'
    } else if (isThisMonth(d)) {
        format = 'd MMM HH:mm'
    } else if (isThisYear(d)) {
        format = 'd MMM'
    } else {
        format = 'd MMM yyyy'
    }
    return formatDate(d, format)
}

function ResultItem({ item, setPath = () => { }, active = false }) {
    const { name, is_folder, size_bytes, path, hidden, read_only, system, modified_time, num_files, num_subfolders, folder_size_bytes } = item;
    const icon = is_folder ? faFolder : getIcon(name);
    const fullName = path ? (path + '\\' + name) : name
    let href = "", onClick = () => { }, size = "";

    const browseButton = useRef(null)
    const browseButtonNewTab = useRef(null)

    const [isCopiedFullName, copyFullName] = useClipboard(fullName);
    const [isCopiedPath, copyPath] = useClipboard(path);

    useEventListener('keydown', e => {
        if (!active) return;
        const { key, shiftKey, ctrlKey, altKey } = e;
        const keyWithModifiers = (ctrlKey ? 'CTRL+' : '') + (altKey ? 'ALT+' : '') + (shiftKey ? 'SHIFT+' : '') + key
        switch (keyWithModifiers) {
            case "CTRL+Enter":
                openExternal(fullName)
                break;
            case "CTRL+SHIFT+Enter":
                openExternal(path)
                break;
            case "CTRL+b":
                browseButton.current.click()
                break;
            case "CTRL+SHIFT+B":
                browseButtonNewTab.current.click()
                break;
            case "CTRL+c":
                copyFullName()
                break;
            case "CTRL+SHIFT+C":
                copyPath()
                break;
            default:
                break;
        }
    })

    if (is_folder) {
        onClick = (e) => {
            e.preventDefault();
            setPath(fullName);
        };
        size = size = <span className="result-size">{filesize(folder_size_bytes, { round: 1 })} ({num_files} <FontAwesomeIcon icon={faFile} className="tiny-icon" /> {num_subfolders} <FontAwesomeIcon icon={faFolder} className="tiny-icon" />)</span>
    }
    else {
        size = (size != null) ? <span className="result-size">{filesize(size_bytes, { round: 1 })}</span> : ''
    }

    const modified = modified_time ? <span className="result-mod-time">{fmt(new Date(modified_time))}</span> : ''

    const className = [
        'result-item',
        read_only ? 'read-only' : '',
        hidden ? 'hidden' : '',
        system ? 'system' : '',
        active ? 'active' : '',
    ].join(' ')

    return (<li className={className}>
        <div className="item-icon-wrapper">
            <FontAwesomeIcon icon={icon} fixedWidth className="result-item-icon" />
            {system ? <FontAwesomeIcon icon={faCog} className="system-icon" /> : ""}
        </div>
        <div>
            <div className="name-row">
                <span className="name clickable hover-underline" onClick={() => openExternal(fullName)} >{name}</span>
                <button className="copy-button clickable" onClick={copyFullName}><FontAwesomeIcon icon={faClone} />{/*Name*/}</button>
            </div>
            <div className="name-row">
                <a ref={browseButton} href={`/browse?path=${path}`} className="copy-button clickable"><FontAwesomeIcon icon={faFolderOpen} /></a>
                <a ref={browseButtonNewTab} href={`/browse?path=${path}`} style={{display:'none'}} target="_blank" rel="noopener noreferrer">browse in a new tab</a>
                <div className="path clickable hover-underline" onClick={() => openExternal(path)} >
                    {path}
                </div>
                <button className="copy-button clickable" onClick={copyPath}><FontAwesomeIcon icon={faClone} />{/*Name*/}</button>
            </div>
            <span>
                {size}
                {modified}
            </span>
        </div>
    </li>);
}

export default ResultItem;