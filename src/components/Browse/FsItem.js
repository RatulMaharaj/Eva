import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faCog, faFile, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow, parse } from 'date-fns'
import filesize from "filesize"

import getIcon from "./icon.js"

import './FsItem.css'

function FsItem({ item, setPath = () => { } }) {
    const { name, is_folder, size_bytes, path, hidden, read_only, system, modified_time, num_files, num_subfolders, folder_size_bytes } = item;
    const icon = is_folder ? faFolder : getIcon(name);
    let href = "", onClick = () => { }, size = "";
    if (is_folder) {
        href = "/browse?path=D:\\Downloads";
        onClick = (e) => {
            e.preventDefault();
            setPath(path ? (path + '\\' + name) : name);
        };
        size = size = <span className="size">{filesize(folder_size_bytes, { round: 1 })} ({num_files} <FontAwesomeIcon icon={faFile} className="tiny-icon" /> {num_subfolders} <FontAwesomeIcon icon={faFolder} className="tiny-icon" />)</span> 
    }
    else {
        size = <span className="size">{filesize(size_bytes, { round: 1 })}</span>
    }

    const modified = modified_time ? <span className="mod-time">{formatDistanceToNow(new Date(modified_time)) + ' ago'}</span> : ''

    const className = [
        'item',
        read_only ? 'read-only' : '',
        hidden ? 'hidden' : '',
        system ? 'system' : '',
    ].join(' ')

    return (<li className={className}>
        <OptionalA href={href} className="item-link" linkClassName="live-link" onClick={onClick}>
            <div className="item-icon-wrapper">
                <FontAwesomeIcon icon={icon} fixedWidth className="item-icon" />
                {system ? <FontAwesomeIcon icon={faCog} className="system-icon" /> : ""}
            </div>
            <span className="name">{name}</span>
        </OptionalA>
        {size}
        {modified}
    </li>);
}

function OptionalA({ children, href = "", className = "", linkClassName = "", ...props }) {
    if (href) {
        return <a href={href} className={className + " " + linkClassName} {...props}>
            {children}
        </a>;
    }
    else {
        return <span className={className} {...props}> {children}</span>;
    }
}

export default FsItem;