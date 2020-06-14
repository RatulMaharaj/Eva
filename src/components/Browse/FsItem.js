import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons';
import filesize from "filesize"

import getIcon from "./icon.js"

import './FsItem.css'

function FsItem({ item, setPath = () => { } }) {
    const { name, is_folder, size_bytes, path } = item;
    const icon = is_folder ? faFolder : getIcon(name);
    let href = "", onClick = () => { }, size = "";
    if (is_folder) {
        href = "/browse?path=D:\\Downloads";
        onClick = (e) => {
            e.preventDefault();
            setPath(path + '\\' + name);
        };
    }
    else {
        size = <span className="size">{filesize(size_bytes, {round: 1})}</span>
    }
    return (<li className="item">
        <OptionalA href={href} className="item-link" onClick={onClick}>
            <div className="item-icon-wrapper">
                <FontAwesomeIcon icon={icon} fixedWidth className="item-icon" />
            </div>
            <span className="name">{name}</span>
            {size}
        </OptionalA>
    </li>);
}

function OptionalA({ children, href = "", ...props }) {
    if (href) {
        return <a href={href} {...props}>
            {children}
        </a>;
    }
    else {
        return <span {...props}> {children}</span>;
    }
}

export default FsItem;