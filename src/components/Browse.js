import React, { useState, useEffect } from "react";
import {useLocation, useParams} from "react-router-dom"
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

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
    const urlSearchParams = new URLSearchParams(useLocation().search);
    const object = {}
    for (let [key, val] of urlSearchParams) {
        object[key] = val
    }
    return object
  }

function Browse() {
    const [path, setPath] = useState("D:\\downloads");
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch(`/api/browse?path=${path}`)
            .then(res => res.json())
            .then(results => setItems(results.results))
    }, [path])

    return (
        <div className="area">
            <div className="locationbar">
                <form className="location-form">
                    <div className="location-icon-wrapper">
                        <FontAwesomeIcon icon={faFolder} className="location-icon" />
                    </div>
                    <input type="search" className="location-inputbox" value={path} />
                </form>
            </div>
            <div className="results-area">
                <ul className="results-list">
                    {items.map(item => (<FsItem item={item} setPath={setPath} />
                    ))}
                </ul>
                <pre>
                    {JSON.stringify(useLocation(),null,2)}
                </pre>
                <pre>
                    {JSON.stringify(useQuery(),null,2)}
                </pre>
                <pre>{JSON.stringify(items, null, 2)}</pre>
            </div>
        </div>
    );
}

function FsItem({ item, setPath=() => {} }) {
    const { name, is_folder, size_bytes, path } = item
    const icon = is_folder ? faFolder : faFile;
    const href = is_folder ? "/browse?path=D:\\Downloads" : ""

    const onClick = (e) => {
        e.preventDefault()
        setPath(path + '\\' + name)
    }

    return (<li className="item">
        <OptionalA href={href} className="item" onClick={onClick} >
            <div className="item-icon-wrapper">
                <FontAwesomeIcon icon={icon} fixedWidth className="item-icon" />
            </div>
            {name}
        </OptionalA>
        </li>)
}

function OptionalA({children, href="", ...props}) {
    if (href) {
        return <a href={href} {...props}>
            {children}
        </a>    
    } else {
        return <span {...props}> {children}</span>
    }
        
}

export default Browse;
