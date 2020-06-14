import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFolder, faFile,
    // faFile, 
    // faCode, 
    // faFileWord, 
    // faFileExcel, 
    // faFilePowerpoint, 
    // faFilePDF, 
    // faFileArchive, 
    // faFileCsv 
} from '@fortawesome/free-solid-svg-icons'

import "./iconColors.css"
import "./Browse.css"

function Browse() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch('/api/browse?path=D:\\downloads')
            .then(res => res.json())
            .then(results => setItems(results.results))
    }, [])

    return (
        <div className="area">
            <div className="locationbar">
                <form className="location-form">
                    <div className="location-icon-wrapper">
                        <FontAwesomeIcon icon={faFolder} className="location-icon" />
                    </div>
                    <input type="search" className="location-inputbox" value="D:\Downloads" />
                </form>
            </div>
            <div className="results-area">
                <ul className="results-list">
                    {items.map(item => (<FsItem item={item} />
                    ))}
                </ul>
                <pre>{JSON.stringify(items, null, 2)}</pre>
            </div>
        </div>
    );
}

function FsItem({ item }) {
    const { name, is_folder, size_bytes } = item
    const icon = is_folder ? faFolder : faFile;
    return (<li className="item">
        <div className="item-icon-wrapper">
            <FontAwesomeIcon icon={icon} fixedWidth className="item-icon" />
        </div>
        {name}
        </li>)
}

export default Browse;
